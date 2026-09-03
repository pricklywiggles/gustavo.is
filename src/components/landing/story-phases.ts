import { type PhaseMap, type PhaseSpec, resolvePhases } from "./scroll-phases";
import type { CityChapter, PanoramaConfig } from "./work-history-data";

/**
 * The work-history story's phase list and pacing knobs, DOM-free so the speed map can
 * audit them (scripts/scroll-speed-map.mjs). Seconds are viewport-heights (README inv. 1).
 */

// 0.4 keeps San Francisco's 13-year scrub (a still scene) near 5 viewports; at 0.5 it
// was the longest beat on the page after the builds.
export const SCRUB_VH_PER_YEAR = 0.4;
// Shared by the dock and the swap anchored to its end, so the two cannot drift apart.
const YEAR_DOCK_VH = 0.6;
// Ends inside hud-in's tail (0.25 at most), so the scrub and every later phase stay put.
export const PRODUCT_IN_VH = 0.2;
// The two chapter-transition beats overlap so the departure reads as one gesture.
export const HUD_OUT_VH = 0.5;
export const SCENE_OUT_VH = 1.8;
/** Floor for one layer's exit; layers whose travel would outrun the budget get longer. */
export const EXIT_SETTLE_VH = 0.9;

/**
 * Perceived speed caps as multiples of scroll speed (travel / span). Large: bands, city
 * masses, the cloud deck, anything that fills the frame. Small: ambient clouds, stars,
 * distant planes. Peak is the eased maximum (power1 peaks at twice its mean).
 */
export const PACING_BUDGET = {
	large: { mean: 1, peak: 2 },
	small: { mean: 1.5, peak: 3 },
} as const;

/** Scroll length of the full cascade, in viewport-heights. */
export function cascadeLength(config: PanoramaConfig): number {
	return config.lastStep * config.stepVh + config.durVh;
}

/** A chapter's ambience's on-stage span; the last ends with outro-dusk (veil opaque). */
export function stageWindow(
	phase: PhaseMap,
	i: number,
	chapters: number,
): { start: number; end: number } {
	const exit = i < chapters - 1 ? `scene-out@${i}` : "outro-dusk";
	return {
		start: phase.at[`panorama-in@${i}`],
		end: phase.at[exit] + phase.len[exit],
	};
}

export function storyPhases(story: CityChapter[]) {
	const specs: PhaseSpec[] = [
		// Anchored, not sequential: no equation beat waits on the previous one.
		{ id: "line1", len: 0.5 },
		{ id: "line2", len: 0.5, with: "line1", offset: 0 },
		{ id: "rule", len: 0.3, with: "line1", offset: 0.35 },
		{ id: "line3", len: 0.5, with: "rule", offset: 0.2 },
		{ id: "ink", len: 0.25 },
		{ id: "hold", len: 0.3 },
	];
	story.forEach((chapter, i) => {
		const pano = chapter.panorama;
		specs.push({ id: `panorama-in@${i}`, len: cascadeLength(pano) });
		if (i === 0) {
			specs.push({ id: "quote-exit", len: 0.5, with: "panorama-in@0" });
			// Far slower than the operands' exit: the word hangs before the rush at the viewer.
			specs.push({ id: "result-exit", len: 1.4, with: "panorama-in@0" });
		}
		// Starts while the last cascade layer is still landing: the cascade's own overlap rhythm.
		specs.push({
			id: `parallax@${i}`,
			len: 0.5,
			with: `panorama-in@${i}`,
			offset: pano.lastStep * pano.stepVh + pano.durVh / 2,
		});
		specs.push({ id: `year-in@${i}`, len: 0.45 });
		specs.push({ id: `year-dock@${i}`, len: YEAR_DOCK_VH });
		// The hero string hands off to the odometer while both sit still: after the
		// dock, inside hud-in's tail, so the scrub and every later phase stay put.
		specs.push({
			id: `year-swap@${i}`,
			len: 0.2,
			with: `year-dock@${i}`,
			offset: YEAR_DOCK_VH,
		});
		// Starts at the dock's end: the year holds the center until then.
		specs.push({
			id: `product-in@${i}`,
			len: PRODUCT_IN_VH,
			with: `year-dock@${i}`,
			offset: YEAR_DOCK_VH,
		});
		specs.push({
			id: `hud-in@${i}`,
			len: 0.55,
			with: `year-dock@${i}`,
			offset: 0.3,
		});
		specs.push({
			id: `scrub@${i}`,
			len: (chapter.span[1] - chapter.span[0]) * SCRUB_VH_PER_YEAR,
		});
		if (i < story.length - 1) {
			specs.push({ id: `hud-out@${i}`, len: HUD_OUT_VH });
			specs.push({
				id: `scene-out@${i}`,
				len: SCENE_OUT_VH,
				with: `hud-out@${i}`,
				offset: 0.25,
			});
		} else {
			specs.push({ id: "outro-close", len: 0.7 });
			specs.push({ id: "outro-dusk", len: 2.4 });
			specs.push({ id: "tail", len: 0.4 });
		}
	});
	return resolvePhases(specs);
}
