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

/** Master-timeline seconds are viewport-heights; ambience runs on a real-time clock. */

export function panoramaLayers(stage: HTMLElement): HTMLElement[] {
	return gsap.utils.toArray<HTMLElement>(
		stage.querySelectorAll("[data-pano-layer]"),
	);
}

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

/** Two to three layers stay in motion at once; a snappier ease reads as a queue. */
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
 * Animated on `y`: it composes with the entrance yPercent and the vessels' xPercent.
 * `viewportHeight` is the section's h-screen box, never innerHeight (iOS toolbar).
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

/** Horizon-locked cities open their band with a curtain: sea level caps the water's rise. */
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
		// Vessels keep their sail-owned x; y: 0 unwinds the parallax shift.
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

/** Dimming ends on black; the closing dusk-ink veil is what lands the palette color. */
export function buildDusk(
	tl: gsap.core.Timeline,
	cues: { at: number; len: number },
	stage: HTMLElement,
	_config: PanoramaConfig,
) {
	const { at, len } = cues;
	const sun = stage.querySelector("[data-pano-sun]");
	// Stagger back-to-front: the street darkens while the sky still glows.
	// Explicit brightness(1) start: GSAP cannot interpolate filter from `none`.
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

/** The day arc runs linear with the scrub so years and daylight pass together. */
export function buildSunset(
	tl: gsap.core.Timeline,
	cues: {
		enterAt: number;
		scrubAt: number;
		scrubLen: number;
		closeLen?: number;
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
	// `size` is a width-%; the aspect converts the radius to height-%.
	const [aw, ah] = config.aspect.split("/").map((n) => Number.parseFloat(n));
	const aspect = aw > 0 && ah > 0 ? aw / ah : 1.5;
	const radiusPct = (scale: number) => (size / 2) * scale * aspect;

	gsap.set(disc, { autoAlpha: 0, transformOrigin: "50% 50%" });
	tl.to(
		disc,
		{ autoAlpha: 1, duration: config.durVh, ease: "none" },
		cues.enterAt,
	);

	// Declarative only: an imperative crown arc dies after one scrub rewind (README inv. 3).
	// Track owns the crown's line; the disc's swell pairs with an equal-ease dive so it cannot stall.
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
 * Sway on the wrappers, entrances on the images: two owners, no shared property. Period scales
 * with width for equal perceived speed. Born paused; the stage window resumes them in place.
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

/** The bow starts 5% of the VIEWPORT in, so the entrance delay matches on every screen width. */
export function vesselSailStartPct(
	geo: { stageWidth: number; stageLeft: number; viewportWidth: number },
	vessel: Pick<VesselConfig, "fromSide" | "leftPct" | "widthPct">,
): number {
	const { stageWidth, stageLeft, viewportWidth } = geo;
	const spriteWidth = (vessel.widthPct / 100) * stageWidth;
	const restX = (vessel.leftPct / 100) * stageWidth;
	// Viewport edges in stage-local space: mobileFocusX can shift the stage off center.
	const enterX =
		vessel.fromSide === "right"
			? viewportWidth - stageLeft - viewportWidth * 0.05
			: -stageLeft + viewportWidth * 0.05 - spriteWidth;
	return ((enterX - restX) / spriteWidth) * 100;
}

function vesselSailStart(stage: HTMLElement, vessel: VesselConfig): number {
	// offsetLeft stays truthful while GSAP transforms layers: the stage positions via `left`.
	return vesselSailStartPct(
		{
			stageWidth: stage.offsetWidth,
			stageLeft: stage.offsetLeft,
			viewportWidth: window.innerWidth,
		},
		vessel,
	);
}

/** Visibility sits outside the sail: scroll-back fades the boat mid-glide, rewinds once hidden. */
export function attachVessels({
	stage,
	config,
	cueScrollY,
}: {
	stage: HTMLElement;
	config: PanoramaConfig;
	/** Absolute document scroll position of the cast-off cue. */
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
			// Clock-driven too: a skip past the chapter would fade a frozen boat back in.
			pauseReveal: () => {
				// progress, not isActive: a reveal created this frame has not ticked yet.
				if (reveal && !reveal.paused() && reveal.progress() < 1) {
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
