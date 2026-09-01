import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	bandClearanceScale,
	curtainRisePx,
	exitDurationVh,
	exitOrder,
} from "@/components/landing/panorama-geometry";
import { EXIT_SETTLE_VH } from "@/components/landing/story-phases";
import type {
	PanoramaConfig,
	VesselConfig,
} from "@/components/landing/work-history-data";

export type AmbienceControls = { pause: () => void; resume: () => void };

/**
 * Timeline builders for one city panorama. Scroll-driven phases write into a master
 * timeline whose seconds are viewport-heights; time-based ambience runs on its own clock.
 * Geometry that the speed map audits lives in panorama-geometry.ts.
 */

export function panoramaLayers(stage: HTMLElement): HTMLElement[] {
	return gsap.utils.toArray<HTMLElement>(
		stage.querySelectorAll("[data-pano-layer]"),
	);
}

/** Hide every layer at its entrance offsets; vessels park off-screen. */
export function setLayersBeforeEntrance(
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	panoramaLayers(stage).forEach((el, i) => {
		const { src, from, origin, drift } = config.layers[i];
		if (drift) {
			const vessel = config.vessels?.find((v) => v.src === src);
			gsap.set(el, {
				xPercent: vessel ? vesselSailStart(stage, vessel) : 0,
				autoAlpha: 0,
			});
			return;
		}
		gsap.set(el, {
			...from,
			autoAlpha: 0,
			transformOrigin: origin ?? "50% 50%",
		});
	});
}

/**
 * Each layer casts on a third into the previous one's landing; with the flat ease two to
 * three layers stay visibly in motion at once (a snappier ease reads as a queue).
 */
export function buildCascade(
	tl: gsap.core.Timeline,
	at: number,
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	panoramaLayers(stage).forEach((el, i) => {
		const { step, drift, ease, dur } = config.layers[i];
		if (drift || step === undefined) return;
		const layerAt = at + step * config.stepVh;
		const duration = dur ?? config.durVh;
		tl.to(
			el,
			{
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration,
				ease: ease ?? "power1.out",
				force3D: true,
			},
			layerAt,
		).to(el, { autoAlpha: 1, duration: duration * 0.5, ease: "none" }, layerAt);
	});
}

/**
 * Year-cued layers rise where the clock crosses their year on the master timeline, so
 * they build and un-build with the time scrub like everything else.
 */
export function buildYearCues(
	tl: gsap.core.Timeline,
	scrub: { at: number; vhPerYear: number; spanStart: number },
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	panoramaLayers(stage).forEach((el, i) => {
		const { yearCue, ease, dur } = config.layers[i];
		if (yearCue === undefined) return;
		const cueAt = scrub.at + (yearCue - scrub.spanStart) * scrub.vhPerYear;
		const duration = dur ?? config.durVh;
		tl.to(
			el,
			{
				xPercent: 0,
				yPercent: 0,
				scale: 1,
				duration,
				ease: ease ?? "power1.out",
				force3D: true,
			},
			cueAt,
		).to(el, { autoAlpha: 1, duration: duration * 0.5, ease: "none" }, cueAt);
	});
}

/**
 * Post-landing breath: foreground rises, background sinks, sea level holds as the pivot.
 * Animated on `y`, which composes with the entrance yPercent and the vessels' xPercent.
 * `viewportHeight`: the section's h-screen box, never innerHeight (iOS toolbar).
 */
export function buildParallaxShift(
	tl: gsap.core.Timeline,
	at: number,
	len: number,
	stage: HTMLElement,
	config: PanoramaConfig,
	viewportHeight: () => number,
) {
	panoramaLayers(stage).forEach((el, i) => {
		const shift = config.layers[i].parallax;
		if (!shift) return;
		tl.to(
			el,
			{
				y: () => {
					const scale =
						shift < 0 && !config.horizonLocked
							? bandClearanceScale(config, stage.offsetHeight, viewportHeight())
							: 1;
					return stage.offsetHeight * shift * scale;
				},
				duration: len,
				ease: "power1.inOut",
				force3D: true,
			},
			at,
		);
	});
}

/**
 * The curtain that opens the band for horizon-locked cities (sea level caps the water's
 * rise); clamped so its top always leaves a sliver of front water under the horizon.
 */
export function buildSurfaceReveal(
	tl: gsap.core.Timeline,
	at: number,
	len: number,
	stage: HTMLElement,
	config: PanoramaConfig,
	viewportHeight: () => number,
) {
	if (!config.horizonLocked) return;
	const surface = stage.querySelector("[data-pano-surface]");
	if (!surface) return;
	tl.to(
		surface,
		{
			y: () => curtainRisePx(config, stage.offsetHeight, viewportHeight()),
			duration: len,
			ease: "power1.inOut",
			force3D: true,
		},
		at,
	);
}

/**
 * The cascade in reverse, last-in-first-out; scrubbed, so scrolling back re-assembles.
 * Each layer's duration is budget-derived (FRA-187): the settle floor, stretched so tall
 * sprites like the towers never outrun the scroll.
 */
export function buildSceneExit(
	tl: gsap.core.Timeline,
	at: number,
	len: number,
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	const spread = Math.max(len - EXIT_SETTLE_VH, 0.01);
	panoramaLayers(stage).forEach((el, i) => {
		const layer = config.layers[i];
		const { from, origin, drift, parallax } = layer;
		const exitAt = at + exitOrder(config, layer) * spread;
		// Vessels keep their sail-owned x; y: 0 unwinds the parallax shift alongside.
		const vars: gsap.TweenVars = drift
			? { autoAlpha: 0 }
			: { ...from, autoAlpha: 0, transformOrigin: origin ?? "50% 50%" };
		if (parallax) vars.y = 0;
		tl.to(
			el,
			{
				...vars,
				duration: exitDurationVh(config, layer),
				ease: "power1.in",
				force3D: true,
			},
			exitAt,
		);
	});
	const surface = stage.querySelector("[data-pano-surface]");
	if (surface) {
		tl.to(
			surface,
			{ y: 0, duration: len * 0.6, ease: "power1.inOut", force3D: true },
			at,
		);
	}
	const sun = stage.querySelector("[data-pano-sun]");
	if (sun && config.sun) {
		tl.to(sun, { autoAlpha: 0, duration: EXIT_SETTLE_VH, ease: "none" }, at);
	}
}

/** Outro part one: the band parallax reverses and the curtain lowers before dusk falls. */
export function buildOutroClose(
	tl: gsap.core.Timeline,
	at: number,
	len: number,
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	panoramaLayers(stage).forEach((el, i) => {
		if (!config.layers[i].parallax) return;
		tl.to(el, { y: 0, duration: len, ease: "power1.inOut", force3D: true }, at);
	});
	const surface = stage.querySelector("[data-pano-surface]");
	if (surface) {
		tl.to(
			surface,
			{ y: 0, duration: len, ease: "power1.inOut", force3D: true },
			at,
		);
	}
}

/**
 * Outro part two: dusk dims to the palette's off-black, staggered by depth (foreground
 * first, sky last), and a dusk-ink veil closes so the end state is the palette color.
 */
export function buildDusk(
	tl: gsap.core.Timeline,
	cues: { at: number; len: number },
	stage: HTMLElement,
	_config: PanoramaConfig,
) {
	const { at, len } = cues;
	const sun = stage.querySelector("[data-pano-sun]");
	// Starts stagger back-to-front so the street darkens while the sky still glows.
	// Explicit brightness(1) start: GSAP cannot interpolate from filter: none.
	const layers = panoramaLayers(stage);
	const dimLen = len * 0.55;
	layers.forEach((el, i) => {
		const zNorm = layers.length > 1 ? i / (layers.length - 1) : 1;
		tl.fromTo(
			el,
			{ filter: "brightness(1)" },
			{
				filter: "brightness(0)",
				duration: dimLen,
				ease: "power2.in",
				immediateRender: false,
			},
			at + (1 - zNorm) * (len - dimLen),
		);
	});
	if (sun) {
		tl.fromTo(
			sun,
			{ filter: "brightness(1)" },
			{
				filter: "brightness(0)",
				duration: dimLen,
				ease: "power2.in",
				immediateRender: false,
			},
			at + (len - dimLen),
		);
	}
	const veil = stage.querySelector("[data-pano-veil]");
	if (veil) {
		tl.fromTo(
			veil,
			{ autoAlpha: 0 },
			{ autoAlpha: 1, duration: len, ease: "power3.in" },
			at,
		);
	}
}

/**
 * The sun's day arc, linear with the scrub so years and daylight pass together and
 * reversing the scroll raises it back.
 */
export function buildSunset(
	tl: gsap.core.Timeline,
	cues: {
		enterAt: number;
		scrubAt: number;
		scrubLen: number;
		/** Length of the outro-close beat between scrub and dusk, if any. */
		closeLen?: number;
		/** Length of the dusk outro the growth arc runs through, if any. */
		duskLen?: number;
	},
	stage: HTMLElement,
	config: PanoramaConfig,
) {
	const disc = stage.querySelector("[data-pano-sun]");
	const track = stage.querySelector("[data-pano-sun-track]");
	if (!disc || !track || !config.sun) return;
	const {
		left,
		top,
		size,
		endLeft,
		endTop,
		duskEndTop,
		endScale,
		growthEase,
		growthStart,
	} = config.sun;
	const gs = growthStart ?? 0.5;
	// Width-% to height-% conversion for the disc's radius.
	const [aw, ah] = config.aspect.split("/").map((n) => Number.parseFloat(n));
	const aspect = aw > 0 && ah > 0 ? aw / ah : 1.5;
	const radiusPct = (scale: number) => (size / 2) * scale * aspect;

	gsap.set(disc, { autoAlpha: 0, transformOrigin: "50% 50%" });
	tl.to(
		disc,
		{ autoAlpha: 1, duration: config.durVh, ease: "none" },
		cues.enterAt,
	);

	// Split across the nested pair so every tween stays declarative (scrub-rewind safe).
	// The TRACK carries the crown's line, running through outro-close so the sun never
	// freezes; the DISC pairs swell with an equal-ease dive, so the crown cannot stall.
	const centerAtGs = top + (endTop - top) * gs;
	const finalCenter = duskEndTop ?? endTop;
	const crownEnd = finalCenter - radiusPct(endScale);
	const arcLen =
		cues.scrubLen * (1 - gs) + (cues.closeLen ?? 0) + (cues.duskLen ?? 0);
	const arcAt = cues.scrubAt + cues.scrubLen * gs;
	tl.to(
		track,
		{
			x: () => (stage.offsetWidth * (endLeft - left)) / 100,
			duration: cues.scrubLen,
			ease: "none",
			force3D: true,
		},
		cues.scrubAt,
	)
		.to(
			track,
			{
				y: () => (stage.offsetHeight * (centerAtGs - top)) / 100,
				duration: cues.scrubLen * gs,
				ease: "none",
				force3D: true,
			},
			cues.scrubAt,
		)
		.to(
			track,
			{
				y: () => (stage.offsetHeight * (crownEnd + radiusPct(1) - top)) / 100,
				duration: arcLen,
				ease: "none",
				force3D: true,
			},
			arcAt,
		)
		.to(
			disc,
			{
				scale: endScale,
				y: () =>
					(stage.offsetHeight * (radiusPct(endScale) - radiusPct(1))) / 100,
				duration: arcLen,
				ease: growthEase ?? "power3.in",
				force3D: true,
			},
			arcAt,
		);
}

/**
 * Drift on the sway wrappers, entrances on the images inside: two owners, no shared
 * properties. Period scales with width for equal perceived speed; phase seeds desync.
 * Born paused at their seeds; the stage window (work-history.tsx) resumes them in place.
 */
export function attachCloudSway(
	stage: HTMLElement,
	config: PanoramaConfig,
): AmbienceControls {
	const sways = gsap.utils.toArray<HTMLElement>(
		stage.querySelectorAll("[data-pano-sway]"),
	);
	const ambientLayers = config.layers.filter((l) => l.ambient);
	const tweens = sways.map((el, i) => {
		const widthPct = parseFloat(String(ambientLayers[i]?.style.width));
		const xAmp = widthPct > 40 ? 3 : 4.5;
		return gsap
			.fromTo(
				el,
				{ xPercent: -xAmp, scale: 0.95 },
				{
					xPercent: xAmp,
					scale: 1.05,
					duration: 7 + widthPct * 0.16,
					ease: "sine.inOut",
					yoyo: true,
					repeat: -1,
					force3D: true,
					paused: true,
				},
			)
			.progress((0.17 + i * 0.37) % 1);
	});
	return {
		pause: () => {
			for (const tween of tweens) tween.pause();
		},
		resume: () => {
			for (const tween of tweens) tween.play();
		},
	};
}

/**
 * The bow starts 5% of the VIEWPORT into the frame (the stage is wider than narrow
 * viewports), so the entrance delay after the cue matches on every screen width.
 */
export function vesselSailStartPct(
	geo: { stageWidth: number; stageLeft: number; viewportWidth: number },
	vessel: Pick<VesselConfig, "fromSide" | "leftPct" | "widthPct">,
): number {
	const { stageWidth, stageLeft, viewportWidth } = geo;
	const spriteWidth = (vessel.widthPct / 100) * stageWidth;
	const restX = (vessel.leftPct / 100) * stageWidth;
	// Viewport edges in stage-local space: the stage is not guaranteed centered on the
	// viewport (mobileFocusX shifts it below sm).
	const enterX =
		vessel.fromSide === "right"
			? viewportWidth - stageLeft - viewportWidth * 0.05
			: -stageLeft + viewportWidth * 0.05 - spriteWidth;
	return ((enterX - restX) / spriteWidth) * 100;
}

function vesselSailStart(stage: HTMLElement, vessel: VesselConfig): number {
	// offsetLeft is layout-resolved (the stage positions via `left`, no x transform), so
	// it stays truthful while GSAP transforms the layers mid-exit.
	return vesselSailStartPct(
		{
			stageWidth: stage.offsetWidth,
			stageLeft: stage.offsetLeft,
			viewportWidth: window.innerWidth,
		},
		vessel,
	);
}

/**
 * Casts off once the cue layer lands, then sails on real time. Visibility lives outside
 * the sail: scroll-back fades the boat mid-glide, and only once hidden does it rewind.
 * The chapter's stage window pauses sails off stage and resumes them in place.
 */
export function attachVessels({
	stage,
	config,
	cueScrollY,
}: {
	stage: HTMLElement;
	config: PanoramaConfig;
	/** Absolute document scroll position of a vessel's cast-off cue. */
	cueScrollY: (vessel: VesselConfig) => () => number;
}): AmbienceControls & { cleanup: () => void } {
	const vessels = (config.vessels ?? []).flatMap((vessel) => {
		const layerIndex = config.layers.findIndex((l) => l.src === vessel.src);
		const el = panoramaLayers(stage)[layerIndex];
		if (!el) return [];
		const cue = cueScrollY(vessel);
		// The cue owns cast-off; the stage window only suspends a sail already under way.
		let castOff = false;
		let reveal: gsap.core.Tween | null = null;

		const sail = gsap
			.timeline({ paused: true })
			.to(el, {
				xPercent: 0,
				duration: vessel.sailSeconds,
				ease: "power1.out",
				force3D: true,
			})
			.to(el, {
				xPercent: vessel.fromSide === "right" ? 6 : -6,
				duration: 12,
				ease: "sine.inOut",
				yoyo: true,
				repeat: -1,
				force3D: true,
			});
		ScrollTrigger.create({
			start: cue,
			end: () => cue() + 1,
			onEnter: () => {
				castOff = true;
				reveal?.kill();
				reveal = gsap.to(el, {
					autoAlpha: 1,
					duration: 0.6,
					ease: "none",
					overwrite: "auto",
				});
				sail.play();
			},
			onLeaveBack: () => {
				castOff = false;
				reveal?.kill();
				reveal = null;
				gsap.to(el, {
					autoAlpha: 0,
					duration: 0.5,
					ease: "power1.out",
					overwrite: "auto",
					onComplete: () => sail.pause(0),
				});
			},
			invalidateOnRefresh: true,
		});
		const remeasureStart = () => {
			if (sail.progress() === 0) {
				gsap.set(el, { xPercent: vesselSailStart(stage, vessel) });
				sail.invalidate();
			}
		};
		ScrollTrigger.addEventListener("refresh", remeasureStart);
		return {
			sail,
			isCastOff: () => castOff,
			// The 0.6s reveal is clock-driven too: a one-frame skip past the chapter would
			// otherwise keep fading a frozen boat back in over the next chapter's opening.
			pauseReveal: () => {
				if (reveal?.isActive()) {
					reveal.pause();
					gsap.set(el, { autoAlpha: 0 });
				}
			},
			resumeReveal: () => {
				if (reveal?.paused()) reveal.play();
			},
			cleanup: () =>
				ScrollTrigger.removeEventListener("refresh", remeasureStart),
		};
	});
	return {
		pause: () => {
			for (const { sail, pauseReveal } of vessels) {
				sail.pause();
				pauseReveal();
			}
		},
		resume: () => {
			for (const { sail, isCastOff, resumeReveal } of vessels) {
				if (isCastOff()) {
					sail.play();
					resumeReveal();
				}
			}
		},
		cleanup: () => {
			for (const { cleanup } of vessels) cleanup();
		},
	};
}
