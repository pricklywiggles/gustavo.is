import { PANORAMA_DIMENSIONS } from "./panorama-dimensions";
import { EXIT_SETTLE_VH, PACING_BUDGET } from "./story-phases";
import type { PanoramaConfig, PanoramaLayer } from "./work-history-data";

/**
 * Panorama layer geometry from config alone (no DOM): stage size, rendered layer boxes,
 * the band-clearance amplifier, the curtain's rise, and each layer's entrance and exit
 * travel. panorama-phases.ts drives tweens from the same math; the speed map audits it.
 */

export type Viewport = { w: number; h: number };

/** The viewports the pacing budget is audited at (CSS px; a phone's h is its large viewport, 100vh). */
export const BUDGET_VIEWPORTS: Record<"desktop" | "phone", Viewport> = {
	desktop: { w: 1440, h: 900 },
	phone: { w: 390, h: 844 },
};

/** Tailwind's sm breakpoint: below it the scene applies each layer's `mobile` placement. */
const SM_BREAKPOINT_PX = 640;

// The cover-fit stage width: every derived expression in panorama-scene.tsx is generated
// from these two numbers, so they cannot drift apart.
export const PANO_W_VW = 100;
export const PANO_W_VH = 150;

/** Width over height of the stage, for converting width-% into height-%. */
export function stageAspect(config: PanoramaConfig): number {
	const [w, h] = config.aspect.split("/").map((n) => Number.parseFloat(n));
	return w > 0 && h > 0 ? w / h : 1.5;
}

export function stageWidthPx(viewport: Viewport): number {
	return Math.max(
		(viewport.w * PANO_W_VW) / 100,
		(viewport.h * PANO_W_VH) / 100,
	);
}

export function stageHeightPx(
	config: PanoramaConfig,
	viewport: Viewport,
): number {
	return stageWidthPx(viewport) / stageAspect(config);
}

// Band target: a viewport fraction floored at enough rows for the stint bar. A 3:2
// viewport reproduces the authored shift exactly; only shorter/wider ones amplify.
const BAND_VH_FRACTION = 0.125;
const BAND_MIN_PX = 112;

export function bandTargetPx(vh: number): number {
	return Math.max(BAND_MIN_PX, vh * BAND_VH_FRACTION);
}

/**
 * Amplifies the rising parallax so the band clears its target on short/wide viewports.
 * Solve bandTop = (vh - H)/2 + H*(1 + shift) = vh - target for shift; the ratio scales
 * the whole foreground group so relative depths (and the ferry's weld) survive.
 */
export function bandClearanceScale(
	config: PanoramaConfig,
	stageHeight: number,
	vh: number,
): number {
	const authored = config.layers.find((l) => l.fill)?.parallax;
	if (!authored) return 1;
	if (stageHeight <= 0 || vh <= 0) return 1;
	const needed =
		(vh - bandTargetPx(vh) - (vh - stageHeight) / 2) / stageHeight - 1;
	return Math.max(1, needed / authored);
}

/**
 * The curtain's rise (px, negative up) for horizon-locked cities: the band it opens is
 * clamped so the curtain's top always leaves a sliver of front water under the horizon.
 */
export function curtainRisePx(
	config: PanoramaConfig,
	stageHeight: number,
	vh: number,
): number {
	const fillLayer = config.layers.find((l) => l.fill);
	const restingTopPct = fillLayer
		? Number.parseFloat(String(fillLayer.style.top))
		: 100;
	const curtainCeilingPct =
		restingTopPct + (fillLayer?.parallax ?? 0) * 100 + 0.4;
	const stageTop = (vh - stageHeight) / 2;
	const maxBand = vh - (stageTop + (curtainCeilingPct / 100) * stageHeight);
	const band = Math.min(bandTargetPx(vh), Math.max(0, maxBand));
	return vh - band - (stageTop + stageHeight);
}

/** A layer's rendered box at a viewport, or null when the asset is not in the manifest. */
export function layerBoxPx(
	layer: PanoramaLayer,
	viewport: Viewport,
): { w: number; h: number } | null {
	const dims = PANORAMA_DIMENSIONS[layer.src];
	if (!dims) return null;
	const widthStyle =
		viewport.w < SM_BREAKPOINT_PX
			? (layer.mobile?.width ?? layer.style.width)
			: layer.style.width;
	const w =
		(Number.parseFloat(String(widthStyle)) / 100) * stageWidthPx(viewport);
	return { w, h: (w * dims.h) / dims.w };
}

/** The breath's shift for one layer (px, positive down), amplified where the band needs it. */
export function parallaxShiftPx(
	config: PanoramaConfig,
	layer: PanoramaLayer,
	viewport: Viewport,
): number {
	const shift = layer.parallax;
	if (!shift) return 0;
	const stageHeight = stageHeightPx(config, viewport);
	const scale =
		shift < 0 && !config.horizonLocked
			? bandClearanceScale(config, stageHeight, viewport.h)
			: 1;
	return stageHeight * shift * scale;
}

/** The `from` pose's translation (px, positive right/down) relative to the layer's rest. */
export function poseDeltaPx(
	layer: PanoramaLayer,
	box: { w: number; h: number },
): { dx: number; dy: number } {
	const xPercent = Number(layer.from?.xPercent ?? 0);
	const yPercent = Number(layer.from?.yPercent ?? 0);
	return { dx: (xPercent / 100) * box.w, dy: (yPercent / 100) * box.h };
}

/**
 * Edge travel of the `from` pose's scale (px): the farthest corner from the transform
 * origin moves |scale - 1| times its distance. Null when the pose has no scale.
 */
export function scaleEdgeTravelPx(
	layer: PanoramaLayer,
	box: { w: number; h: number },
): number | null {
	const scale = layer.from?.scale;
	if (scale === undefined) return null;
	const [ox, oy] = (layer.origin ?? "50% 50%")
		.split(/\s+/)
		.map((n) => Number.parseFloat(n) / 100);
	const originX = (Number.isFinite(ox) ? ox : 0.5) * box.w;
	const originY = (Number.isFinite(oy) ? oy : 0.5) * box.h;
	const reach = Math.max(
		Math.hypot(originX, originY),
		Math.hypot(box.w - originX, originY),
		Math.hypot(originX, box.h - originY),
		Math.hypot(box.w - originX, box.h - originY),
	);
	return Math.abs(Number(scale) - 1) * reach;
}

/** Cascade entrance: the pose's translation, in viewport-heights. */
export function entranceTravelVh(
	layer: PanoramaLayer,
	viewport: Viewport,
): number | null {
	const box = layerBoxPx(layer, viewport);
	if (!box || !layer.from) return null;
	const { dx, dy } = poseDeltaPx(layer, box);
	return Math.hypot(dx, dy) / viewport.h;
}

/**
 * Scene exit: the layer returns to its pose while its breath shift unwinds to zero in
 * the same tween, so the two signed y deltas add before the magnitude is taken.
 */
export function exitTravelVh(
	config: PanoramaConfig,
	layer: PanoramaLayer,
	viewport: Viewport,
): number | null {
	const box = layerBoxPx(layer, viewport);
	if (!box || !layer.from) return null;
	const { dx, dy } = poseDeltaPx(layer, box);
	const unwind = parallaxShiftPx(config, layer, viewport);
	return Math.hypot(dx, dy - unwind) / viewport.h;
}

export type LayerClass = keyof typeof PACING_BUDGET;

/** Ambient clouds are distant and blurred; everything else fills the frame. */
export function layerClass(layer: PanoramaLayer): LayerClass {
	return layer.ambient ? "small" : "large";
}

/** Exit order: last in, first out; year-cued and drift layers lead. */
export function exitOrder(
	config: PanoramaConfig,
	layer: PanoramaLayer,
): number {
	return layer.step !== undefined
		? (config.lastStep - layer.step) / config.lastStep
		: 0;
}

/**
 * One layer's exit duration in viewport-heights: the settle floor, stretched so the
 * layer never exceeds its class's mean cap at either budget viewport. Fixed at build,
 * never from live DOM: images have no box yet when the timeline builds.
 */
export function exitDurationVh(
	config: PanoramaConfig,
	layer: PanoramaLayer,
): number {
	if (layer.drift || !layer.from) return EXIT_SETTLE_VH;
	const cap = PACING_BUDGET[layerClass(layer)].mean;
	let duration = EXIT_SETTLE_VH;
	for (const viewport of Object.values(BUDGET_VIEWPORTS)) {
		const travel = exitTravelVh(config, layer, viewport);
		if (travel !== null) duration = Math.max(duration, travel / cap);
	}
	return duration;
}

/** Where the last layer's exit ends, relative to the phase start. */
export function exitWindowVh(config: PanoramaConfig, len: number): number {
	const spread = Math.max(len - EXIT_SETTLE_VH, 0.01);
	return Math.max(
		...config.layers.map(
			(layer) =>
				exitOrder(config, layer) * spread + exitDurationVh(config, layer),
		),
	);
}
