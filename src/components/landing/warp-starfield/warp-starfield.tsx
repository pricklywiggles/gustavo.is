"use client";

import { useEffect, useRef, useState } from "react";
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
 * Catch-up time (seconds) for the scroll sample on iOS devices only, whose sparse scroll
 * events would otherwise step the settled overlay against a page the compositor scrolls
 * smoothly. Short on purpose: at the scrub tweens' quarter second the overlay trailed
 * the finger and settled like a spring. Everywhere else the raw sample is the baseline.
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
	 * Polled every frame: pixels scrolled into the follow-on content. Slides the settled
	 * overlay away at scroll speed and drifts the arrival field in parallax.
	 */
	sceneScroll?: () => number;
	/**
	 * Headline that drops out of warp, as lines of word units; flattened order is the
	 * stagger order. Rendered as real DOM text each word reveals on landing.
	 */
	headline?: string[][];
	/** Ghost echoes per word; more steps reach further into the past, lengthening the smear. */
	textTrailSteps?: number;
	/** Pops out of the lower-left once the headline settles; leans in the words' empty left. */
	astronautSrc?: string;
	/** Fires once after the last streak and headline land; immediate under reduced motion. */
	onComplete?: () => void;
	/**
	 * The self-running theater window: true when the warp arms, false once the scene settles.
	 * Callers hold the page still with it; never fired on reduced-motion or no-canvas paths.
	 */
	onTheater?: (playing: boolean) => void;
};

/**
 * The warp-speed set piece. Plays once per mount (change key to replay); the root fills
 * whatever positioned box the caller gives it.
 */
export function WarpStarfield({
	className,
	starCount = 100,
	warpDuration = 8,
	seedProgress,
	sceneScroll,
	headline,
	textTrailSteps = 6,
	astronautSrc,
	onComplete,
	onTheater,
}: WarpStarfieldProps) {
	const rootRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ufoRef = useRef<HTMLImageElement>(null);
	const astronautRef = useRef<HTMLImageElement>(null);
	const astronautBoxRef = useRef<HTMLDivElement>(null);
	const headlineRef = useRef<HTMLDivElement>(null);
	const hintRef = useRef<HTMLDivElement>(null);
	const onCompleteRef = useRef(onComplete);
	const onTheaterRef = useRef(onTheater);
	const seedProgressRef = useRef(seedProgress);
	const sceneScrollRef = useRef(sceneScroll);
	// A live reduced-motion flip must re-branch from a pristine DOM: the effect mutates
	// inline styles, so the epoch keys a full remount and re-runs the effect.
	const [motionEpoch, setMotionEpoch] = useState(0);
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		const bump = () => setMotionEpoch((epoch) => epoch + 1);
		query.addEventListener("change", bump);
		return () => query.removeEventListener("change", bump);
	}, []);
	useEffect(() => {
		onCompleteRef.current = onComplete;
		onTheaterRef.current = onTheater;
		seedProgressRef.current = seedProgress;
		sceneScrollRef.current = sceneScroll;
	}, [onComplete, onTheater, seedProgress, sceneScroll]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: motionEpoch keys the scene subtree, so the effect must re-run to wire the freshly remounted canvas, UFO, and hint nodes
	useEffect(() => {
		const root = rootRef.current;
		const canvas = canvasRef.current;
		const ctx = canvas?.getContext("2d");
		// Inline opacity outranks the JSX opacity-0 class, so re-renders can't hide a landed word.
		const spans = Array.from(
			root?.querySelectorAll<HTMLElement>("[data-warp-word]") ?? [],
		);
		const showText = () => {
			for (const el of spans) el.style.opacity = "1";
		};
		const popAstronaut = (instant = false) => {
			const astronaut = astronautRef.current;
			if (!astronaut) return;
			if (instant) astronaut.style.transition = "none";
			astronaut.style.transform = ASTRONAUT_REST;
		};
		const showHint = (instant = false) => {
			const hint = hintRef.current;
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

		// Measured at warp start so the display font has loaded and rects reflect real glyphs.
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

		// Screen-space shift of the settled overlay; canvas-flown words follow it too so a
		// mid-flight scroll-back can't split them from their DOM rests.
		let overlayShift = 0;
		// Vertical camera drift (world units) for the arrival field.
		let restCamY = 0;

		const drawWordAt = (word: FlyingWord, z: number) => {
			const scale = 1 / z;
			ctx.save();
			ctx.translate(
				view.width / 2 + word.offsetX * scale,
				view.height / 2 + word.offsetY * scale + overlayShift,
			);
			ctx.scale(scale, scale);
			ctx.fillText(word.text, -word.width / 2, word.baselineOff);
			ctx.restore();
		};

		// After the warp the overlay is released to the scroll: back up slides it away at
		// scroll speed, on into the showcase carries it out the top.
		const placeOverlay = (progress: number, scenePx: number) => {
			if (sim.warpAt === null) return;
			const off = Math.max(0, (1 - progress) * 2 * view.height) - scenePx;
			if (off === overlayShift) return;
			overlayShift = off;
			const shift = `0 ${off}px`;
			if (headlineRef.current) headlineRef.current.style.translate = shift;
			if (astronautBoxRef.current)
				astronautBoxRef.current.style.translate = shift;
			if (hintRef.current) hintRef.current.style.translate = `-50% ${off}px`;
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
			// The settled overlay must still ride with the scroll or it sits fixed over the
			// follow-on content; stars stay parked, no parallax here.
			// Progress pinned at 1: the two-viewport seed entry read as two empty screens here.
			const syncOverlay = () => {
				placeOverlay(1, Math.max(0, sceneScrollRef.current?.() ?? 0));
			};
			syncOverlay();
			window.addEventListener("scroll", syncOverlay, { passive: true });
			window.addEventListener("resize", syncOverlay);
			return () => {
				window.removeEventListener("scroll", syncOverlay);
				window.removeEventListener("resize", syncOverlay);
				observer.disconnect();
			};
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

			placeOverlay(progress, scenePx);
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
	}, [starCount, warpDuration, textTrailSteps, motionEpoch]);

	return (
		<div ref={rootRef} key={motionEpoch} className={className}>
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
			{astronautSrc && (
				// Width-relative and bottom-anchored so the astronaut-to-words proportion holds
				// at any viewport; the negative left tucks his backpack edge offscreen.
				<div
					ref={astronautBoxRef}
					className="pointer-events-none absolute bottom-[10vw] left-[-1.5vw] w-[22.5vw] rotate-[16deg]"
				>
					{/* The drift lives on its own layer so it never fights the pop transition below. */}
					<div className="motion-safe:animate-[float-bob_2.8s_ease-in-out_infinite_alternate]">
						{/* biome-ignore lint/performance/noImgElement: transform-animated
						    actor with its own transition; next/image's wrapper and
						    optimization pipeline add nothing for it. */}
						<img
							ref={astronautRef}
							src={astronautSrc}
							alt=""
							draggable={false}
							className="h-auto w-full [transform:translateY(160%)] [transition:transform_800ms_cubic-bezier(0.34,1.8,0.5,1)]"
						/>
					</div>
				</div>
			)}
			{headline && (
				// Decorative: the section supplies the accessible heading; split spans would
				// read as one mashed word.
				<div
					ref={headlineRef}
					aria-hidden="true"
					className="pointer-events-none absolute inset-0 flex flex-col items-end justify-end pr-[1vw] pb-[4vh] text-right font-display text-pale-dune"
				>
					{headline.map((line) => (
						<div
							key={line.join("-")}
							className="whitespace-nowrap text-[20vw] leading-[0.85]"
						>
							{line.map((word) => (
								<span
									key={word}
									data-warp-word
									className="inline-block opacity-0"
								>
									{word}
								</span>
							))}
						</div>
					))}
				</div>
			)}
			<div
				ref={hintRef}
				data-scroll-hint
				className="pointer-events-none absolute bottom-[3vh] left-1/2 -translate-x-1/2 opacity-0 [transition:opacity_600ms_ease]"
			>
				{/* The bounce lives on a wrapper div: browsers often skip compositing CSS
				    animations applied to the svg element itself. */}
				<div className="motion-safe:animate-bounce">
					<svg
						viewBox="0 0 24 24"
						aria-hidden="true"
						className="size-8 text-pale-dune/70"
					>
						<path
							d="m6 9 6 6 6-6"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</div>
			</div>
		</div>
	);
}
