"use client";

import { type RefObject, useEffect, useRef } from "react";
import { isIOSDevice } from "@/lib/ios-device";
import {
	advance,
	focalFor,
	phaseAt,
	projectAt,
	REST_STAR_COUNT,
	restCapFor,
	type Star,
	seedTo,
	speedAt,
	ufoPose,
	type Viewport,
	type WarpConfig,
	type WarpSim,
	wordDepth,
	wordProgress,
} from "./warp-starfield-math";

/** Streak length as seconds of travel, so it scales with camera speed for free. */
const TAIL_SECONDS = 0.085;
/** Cap on a frame's dt so a backgrounded tab doesn't teleport the field. */
const MAX_FRAME_DT = 0.05;
const TAU = Math.PI * 2;
/** Seconds between headline echo samples into the past; the smear scales with real speed. */
const TEXT_TRAIL_DT = 0.045;
/** Fraction of the flight spent fading in from nothing. */
const TEXT_FADE_IN = 0.12;
/** Hold at full seed before the jump, letting the field and UFO register. */
const WARP_ARM_DELAY = 0.3;
/** World-units of camera drift per scene pixel; a near star moves at ~8% of scroll speed. */
const REST_PARALLAX = 0.16;
/**
 * Catch-up time (seconds) for the scroll sample that drifts the arrival field, on iOS
 * devices only, whose sparse scroll events would otherwise step the star camera.
 * Everywhere else the raw sample is the baseline.
 */
const SCROLL_SMOOTHING = 0.08;
/** Beat between the last word landing and the astronaut's pop. */
const ASTRONAUT_DELAY = 0.25;
/** Beat between the astronaut's pop and the scroll cue appearing. */
const HINT_DELAY = 0.5;
/** Resting pose; the wrapper carries the rotation, so the pop's translateY travels along
 * the astronaut's tilted spine. */
const ASTRONAUT_REST = "translateY(0)";

/** Ease-in: words accelerate the whole way and stop cold; the trail catches up after. */
const flightEase = (p: number) => p ** 3;

type FlyingWord = {
	el: HTMLElement;
	text: string;
	font: string;
	letterSpacing: string;
	color: string;
	/** Advance width at rest size, from the same canvas font. */
	width: number;
	/** Baseline offset from box center (half-leading model), so canvas glyphs match the DOM. */
	baselineOff: number;
	/** Resting box center, relative to the viewport center (the flight ray). */
	offsetX: number;
	offsetY: number;
	landed: boolean;
};

type WarpStarfieldProps = {
	className?: string;
	/** Dots placed before the jump. */
	starCount?: number;
	/** Seconds of acceleration once the field is set. */
	warpDuration?: number;
	/**
	 * Polled every frame for the seeding scrub, 0..1. Stars accumulate with it and the UFO
	 * rides it in; holding 1 for a beat triggers the warp. Omitted, the warp self-starts.
	 */
	seedProgress?: () => number;
	/**
	 * Polled every frame: pixels scrolled into the follow-on content. Drifts the arrival
	 * field in parallax.
	 */
	sceneScroll?: () => number;
	/**
	 * The settled scene (`WarpStarfieldOverlay`): its `[data-warp-word]` spans are the
	 * headline the words fly into, `[data-warp-astronaut]` pops after them, and
	 * `[data-scroll-hint]` follows. It lives in document flow, so its screen must coincide
	 * with the canvas while the theater plays (the page is locked there).
	 */
	overlay?: RefObject<HTMLElement | null>;
	/** Ghost echoes per word; more steps reach further into the past, lengthening the smear. */
	textTrailSteps?: number;
	/** Fires once after the last streak and headline land; immediate under reduced motion. */
	onComplete?: () => void;
	/**
	 * The self-running theater window: true when the warp arms, false once the scene settles.
	 * Callers hold the page still with it; never fired on reduced-motion or no-canvas paths.
	 */
	onTheater?: (playing: boolean) => void;
};

/**
 * The warp-speed set piece: the canvas and the UFO. Plays once per mount (change key to
 * replay, and remount the overlay with it: the effect mutates its inline styles); the
 * root fills whatever positioned box the caller gives it.
 */
export function WarpStarfield({
	className,
	starCount = 100,
	warpDuration = 8,
	seedProgress,
	sceneScroll,
	overlay,
	textTrailSteps = 6,
	onComplete,
	onTheater,
}: WarpStarfieldProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ufoRef = useRef<HTMLImageElement>(null);
	const onCompleteRef = useRef(onComplete);
	const onTheaterRef = useRef(onTheater);
	const seedProgressRef = useRef(seedProgress);
	const sceneScrollRef = useRef(sceneScroll);
	useEffect(() => {
		onCompleteRef.current = onComplete;
		onTheaterRef.current = onTheater;
		seedProgressRef.current = seedProgress;
		sceneScrollRef.current = sceneScroll;
	}, [onComplete, onTheater, seedProgress, sceneScroll]);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		const scene = overlay?.current ?? null;
		// Inline opacity outranks the JSX opacity-0 class, so re-renders can't hide a landed word.
		const spans = Array.from(
			scene?.querySelectorAll<HTMLElement>("[data-warp-word]") ?? [],
		);
		const astronaut =
			scene?.querySelector<HTMLElement>("[data-warp-astronaut]") ?? null;
		const hint =
			scene?.querySelector<HTMLElement>("[data-scroll-hint]") ?? null;
		const showText = () => {
			for (const el of spans) el.style.opacity = "1";
		};
		const popAstronaut = (instant = false) => {
			if (!astronaut) return;
			if (instant) astronaut.style.transition = "none";
			astronaut.style.transform = ASTRONAUT_REST;
		};
		const showHint = (instant = false) => {
			if (!hint) return;
			if (instant) hint.style.transition = "none";
			hint.style.opacity = "1";
		};
		if (!canvas || !ctx) {
			showText();
			popAstronaut(true);
			showHint(true);
			return;
		}

		const config: WarpConfig = { starCount, warpDuration };
		const sim: WarpSim = {
			elapsed: 0,
			stars: [],
			seeded: 0,
			spawnBudget: 0,
			warpAt: null,
			rest: [],
			restBudget: 0,
			restCap: REST_STAR_COUNT,
		};
		const view: Viewport = { width: 0, height: 0, focal: 0 };
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		// The ramp's darkest token, resolved so the sky tracks the palette.
		const background =
			getComputedStyle(document.documentElement)
				.getPropertyValue("--color-dusk-ink")
				.trim() || "#000";

		let words: FlyingWord[] = [];
		let wordsMeasured = false;

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			view.width = rect.width;
			view.height = rect.height;
			view.focal = focalFor(rect.width, rect.height);
			canvas.width = Math.round(rect.width * dpr);
			canvas.height = Math.round(rect.height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			// Resting rects move with the viewport-relative type size.
			wordsMeasured = false;
		};

		// Measured at warp start so the display font has loaded and rects reflect real
		// glyphs. Canvas-relative: the overlay's screen coincides with the canvas at the
		// theater's lock, which is where the flight happens.
		const measureWords = () => {
			const rootRect = canvas.getBoundingClientRect();
			words = spans.map((el, i) => {
				const style = getComputedStyle(el);
				const font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
				const letterSpacing =
					style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
				ctx.font = font;
				ctx.letterSpacing = letterSpacing;
				const text = el.textContent ?? "";
				const metrics = ctx.measureText(text);
				// fontBoundingBox* is missing on older Firefox; the ink box is a close stand-in.
				const ascent =
					metrics.fontBoundingBoxAscent ?? metrics.actualBoundingBoxAscent;
				const descent =
					metrics.fontBoundingBoxDescent ?? metrics.actualBoundingBoxDescent;
				const rect = el.getBoundingClientRect();
				return {
					el,
					text,
					font,
					letterSpacing,
					color: style.color,
					width: metrics.width,
					baselineOff: (ascent - descent) / 2,
					offsetX: rect.left + rect.width / 2 - rootRect.left - view.width / 2,
					offsetY: rect.top + rect.height / 2 - rootRect.top - view.height / 2,
					landed: words[i]?.landed ?? false,
				};
			});
			wordsMeasured = true;
		};

		// Vertical camera drift (world units) for the arrival field.
		let restCamY = 0;

		const drawWordAt = (word: FlyingWord, z: number) => {
			const scale = 1 / z;
			ctx.save();
			ctx.translate(
				view.width / 2 + word.offsetX * scale,
				view.height / 2 + word.offsetY * scale,
			);
			ctx.scale(scale, scale);
			ctx.fillText(word.text, -word.width / 2, word.baselineOff);
			ctx.restore();
		};

		// The last echo's alpha stays ~0.17 of the base at any step count, so raising
		// textTrailSteps lengthens the smear instead of appending invisible copies.
		const echoFalloff = (k: number) =>
			0.7 ** (((k - 1) * 5) / Math.max(textTrailSteps - 1, 1));

		const drawWords = () => {
			for (const [i, word] of words.entries()) {
				const p = wordProgress(sim, config, i);
				if (p <= 0) continue;
				if (p >= 1 && !word.landed) {
					word.landed = true;
					word.el.style.opacity = "1";
				}
				ctx.font = word.font;
				ctx.letterSpacing = word.letterSpacing;
				ctx.fillStyle = word.color;
				ctx.textAlign = "left";
				ctx.textBaseline = "alphabetic";

				// Each echo dies at the resting spot, so the trail sweeps in after the cold stop.
				ctx.globalCompositeOperation = "lighter";
				for (let k = textTrailSteps; k >= 1; k--) {
					const past: WarpSim = {
						...sim,
						elapsed: sim.elapsed - k * TEXT_TRAIL_DT,
					};
					const pk = wordProgress(past, config, i);
					if (pk <= 0 || pk >= 1) continue;
					ctx.globalAlpha =
						Math.min(pk / TEXT_FADE_IN, 1) * 0.3 * echoFalloff(k);
					drawWordAt(word, wordDepth(flightEase(pk)));
				}

				// The word composites normally: at touchdown its color must equal the DOM
				// text it hands off to. Once landed, the DOM span carries it.
				if (!word.landed) {
					ctx.globalCompositeOperation = "source-over";
					ctx.globalAlpha = Math.min(p / TEXT_FADE_IN, 1);
					drawWordAt(word, wordDepth(flightEase(p)));
				}
				ctx.globalAlpha = 1;
			}
		};

		const starColor = (star: Star) => (a: number) =>
			`hsla(${star.hue}, ${star.sat}%, ${star.light}%, ${a})`;

		const starAlpha = (star: Star) => {
			const fade = Math.min((sim.elapsed - star.bornAt) / star.fadeSeconds, 1);
			const twinkle = 0.82 + 0.18 * Math.sin(sim.elapsed * 2.1 + star.twinkle);
			return star.brightness * fade * (2 - fade) * twinkle;
		};

		const drawDot = (
			at: { x: number; y: number; radius: number },
			color: (a: number) => string,
			alpha: number,
		) => {
			ctx.fillStyle = color(alpha * 0.22);
			ctx.beginPath();
			ctx.arc(at.x, at.y, at.radius * 2.4, 0, TAU);
			ctx.fill();
			ctx.fillStyle = color(alpha);
			ctx.beginPath();
			ctx.arc(at.x, at.y, at.radius, 0, TAU);
			ctx.fill();
		};

		const draw = () => {
			ctx.globalCompositeOperation = "source-over";
			ctx.fillStyle = background;
			ctx.fillRect(0, 0, view.width, view.height);
			// Additive blending so crossing streaks flare instead of occluding.
			ctx.globalCompositeOperation = "lighter";
			ctx.lineCap = "round";

			// Arrival field, parked behind everything; camera drift parallaxes it as the
			// showcase scrolls through.
			for (const star of sim.rest) {
				drawDot(
					projectAt(star, star.z, view, restCamY),
					starColor(star),
					starAlpha(star),
				);
			}

			const tailDz = speedAt(sim, config) * TAIL_SECONDS;
			for (const star of sim.stars) {
				const alpha = starAlpha(star);
				const color = starColor(star);

				const head = projectAt(star, star.z, view);
				const tail = tailDz > 0 ? projectAt(star, star.z + tailDz, view) : head;
				const length = Math.hypot(head.x - tail.x, head.y - tail.y);

				if (length < 1) {
					drawDot(head, color, alpha);
					continue;
				}

				// A mid stop keeps most of the streak luminous (a head-only ramp reads as
				// grey thread); the halo pass under it supplies the neon bloom.
				const streak = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
				streak.addColorStop(0, color(0));
				streak.addColorStop(0.35, color(alpha * 0.7));
				streak.addColorStop(1, color(alpha));
				ctx.strokeStyle = streak;
				ctx.globalAlpha = 0.4;
				ctx.lineWidth = Math.max(head.radius, 1) * 4;
				ctx.beginPath();
				ctx.moveTo(tail.x, tail.y);
				ctx.lineTo(head.x, head.y);
				ctx.stroke();
				ctx.globalAlpha = 1;
				ctx.lineWidth = Math.max(head.radius, 0.6) * 1.5;
				ctx.beginPath();
				ctx.moveTo(tail.x, tail.y);
				ctx.lineTo(head.x, head.y);
				ctx.stroke();

				if (length > 6) {
					ctx.fillStyle = `hsla(${star.hue}, ${star.sat * 0.4}%, 96%, ${alpha * 0.9})`;
					ctx.beginPath();
					ctx.arc(head.x, head.y, Math.max(head.radius * 0.75, 0.5), 0, TAU);
					ctx.fill();
				}
			}

			if (wordsMeasured) drawWords();
		};

		const placeUfo = (progress: number) => {
			const ufo = ufoRef.current;
			if (!ufo) return;
			const pose = ufoPose(sim, config, progress);
			ufo.style.opacity = String(pose.opacity);
			ufo.style.transform = `translate(-50%, -50%) translateY(${
				pose.y * view.height
			}px) scale(${pose.scale})`;
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas);

		let finished = false;
		const finish = () => {
			if (finished) return;
			finished = true;
			// Without a headline there is no chevron beat; the theater ends with the drain.
			if (spans.length === 0) onTheaterRef.current?.(false);
			onCompleteRef.current?.();
		};

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// The resting end state: star births backdated so the fade-in math renders them lit.
			sim.warpAt = 0;
			seedTo(sim, 1, view, config);
			for (const star of sim.stars) star.bornAt = -star.fadeSeconds;
			draw();
			showText();
			popAstronaut(true);
			showHint(true);
			finish();
			// Stars stay parked, no parallax here; the overlay's own track rides the page.
			return () => observer.disconnect();
		}

		let frame = 0;
		let last: number | null = null;
		let running = false;
		// Sim time the scrub first held 1; the warp arms WARP_ARM_DELAY later.
		let armedAt: number | null = null;
		// Sim time the last word landed; the astronaut pops a beat later, the cue follows.
		let astronautAt: number | null = null;
		let astronautPopped = false;
		let hintShown = false;
		const smoothScroll = isIOSDevice();
		// Scroll sample; low-passed on iOS (see SCROLL_SMOOTHING), snapping within half a pixel.
		let scenePx = 0;
		const step = (now: number) => {
			if (!running) return;
			const dt =
				last === null ? 0 : Math.min((now - last) / 1000, MAX_FRAME_DT);
			last = now;

			const progress = Math.min(
				Math.max(seedProgressRef.current?.() ?? 1, 0),
				1,
			);
			const targetPx = Math.max(0, sceneScrollRef.current?.() ?? 0);
			if (smoothScroll) {
				scenePx +=
					(targetPx - scenePx) * (1 - Math.exp(-dt / SCROLL_SMOOTHING));
				if (Math.abs(targetPx - scenePx) < 0.5) scenePx = targetPx;
			} else {
				scenePx = targetPx;
			}
			restCamY = (scenePx * REST_PARALLAX) / Math.max(view.focal, 1);
			if (sim.warpAt !== null) sim.restCap = restCapFor(progress);
			advance(sim, dt, view, config);

			if (sim.warpAt === null) {
				seedTo(sim, progress, view, config);
				if (progress >= 1) {
					armedAt ??= sim.elapsed;
					if (sim.elapsed - armedAt >= WARP_ARM_DELAY) {
						sim.warpAt = sim.elapsed;
						onTheaterRef.current?.(true);
					}
				} else {
					armedAt = null;
				}
			}
			if (!wordsMeasured && sim.warpAt !== null) measureWords();

			draw();
			placeUfo(sim.warpAt === null ? progress : 1);

			if (
				astronautAt === null &&
				spans.length > 0 &&
				wordsMeasured &&
				words.every((word) => word.landed)
			) {
				astronautAt = sim.elapsed;
			}
			if (
				!astronautPopped &&
				astronautAt !== null &&
				sim.elapsed - astronautAt >= ASTRONAUT_DELAY
			) {
				astronautPopped = true;
				popAstronaut();
			}
			if (
				!hintShown &&
				astronautAt !== null &&
				sim.elapsed - astronautAt >= ASTRONAUT_DELAY + HINT_DELAY
			) {
				hintShown = true;
				showHint();
				onTheaterRef.current?.(false);
			}

			// Done once every word's deepest echo has caught up (a landed word still smears).
			// finish() fires once, but the loop stays alive: the arrival field keeps
			// twinkling; the guard keeps the per-word sim copies from allocating forever.
			if (!finished) {
				const textDone =
					spans.length === 0 ||
					(wordsMeasured &&
						words.every((_, i) => {
							const past: WarpSim = {
								...sim,
								elapsed: sim.elapsed - textTrailSteps * TEXT_TRAIL_DT,
							};
							return wordProgress(past, config, i) >= 1;
						}));
				if (textDone && phaseAt(sim, config) === "done") finish();
			}
			frame = requestAnimationFrame(step);
		};

		// Run only while the stage is near the viewport, or the canvas burns GPU from page
		// load onward; resetting `last` on resume keeps the off-screen gap out of the sim clock.
		const start = () => {
			if (running) return;
			running = true;
			last = null;
			frame = requestAnimationFrame(step);
		};
		const stop = () => {
			running = false;
			cancelAnimationFrame(frame);
		};
		let intersection: IntersectionObserver | null = null;
		if (typeof IntersectionObserver === "undefined") {
			start();
		} else {
			intersection = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) start();
					else stop();
				},
				{ rootMargin: "100px" },
			);
			intersection.observe(canvas);
		}

		return () => {
			stop();
			intersection?.disconnect();
			observer.disconnect();
		};
	}, [starCount, warpDuration, textTrailSteps, overlay]);

	return (
		<div className={className}>
			<canvas ref={canvasRef} className="absolute inset-0 size-full" />
			{/* Decorative actor; placed every frame from the sim clock. */}
			{/* biome-ignore lint/performance/noImgElement: next/image cannot
			    optimize an SVG and its wrapper fights the per-frame transform;
			    a plain img is the right element here. */}
			<img
				ref={ufoRef}
				src="/projects/ufo.svg"
				alt=""
				draggable={false}
				className="pointer-events-none absolute top-1/2 left-1/2 w-[16vw] max-w-56 opacity-0 select-none"
			/>
		</div>
	);
}
