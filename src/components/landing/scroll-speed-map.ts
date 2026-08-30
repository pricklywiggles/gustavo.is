import {
	CLOUD_CLEARANCE_VH,
	CLOUD_SLOTS,
	cloudHeightVh,
	DESCENT_PHASE,
	EARTH_RISE_ENTRY_FRACTION,
	EARTH_RISE_VH,
	STAR_LAYERS,
	STATION_TRAVEL,
	VISTA_CLOUD_PLANES,
	VISTA_HORIZON_SCALE,
	VISTA_SUN_TRAVEL,
	VISTA_TRAVEL,
} from "./landfall-geometry";
import {
	BUDGET_VIEWPORTS,
	curtainRisePx,
	entranceTravelVh,
	exitDurationVh,
	exitOrder,
	exitTravelVh,
	exitWindowVh,
	layerBoxPx,
	layerClass,
	parallaxShiftPx,
	scaleEdgeTravelPx,
	stageHeightPx,
	stageWidthPx,
	type Viewport,
} from "./panorama-geometry";
import {
	CHARACTER_SHRINK_SCALE,
	CONVERGENCE_SPAN_VH,
	HERO_PARALLAX,
	HERO_SUN_SIZE,
	HOLE_STAGES,
	REVEAL_LENGTH_VH,
	REVEAL_TRAVEL_VH,
	SUN_CONVERGENCE_SCALE,
} from "./scroll-geometry";
import {
	EXIT_SETTLE_VH,
	PACING_BUDGET,
	SCENE_OUT_VH,
	storyPhases,
} from "./story-phases";
import { CHAPTERS, type PanoramaConfig } from "./work-history-data";

/**
 * The landing page's scroll pacing, one row per scrubbed tween: how far it travels
 * (viewport-heights) over how much scroll (viewport-heights). A ratio of 1.0 moves with
 * the finger; 2.0 moves twice as fast. Derived from config alone so it runs in Node
 * (scripts/scroll-speed-map.mjs) and as a budget test (FRA-187).
 */

export type SpeedClass =
	| keyof typeof PACING_BUDGET
	| "entrance"
	| "reveal"
	| "info";

export type SpeedEntry = {
	section: "hero" | "work-history" | "landfall" | "vista" | "projects";
	phase: string;
	target: string;
	class: SpeedClass;
	/** Translation (or scale edge travel) in viewport-heights; null when nothing moves. */
	travelVh: number | null;
	spanVh: number;
	ease: string;
	meanRatio: number | null;
	/** Mean times the ease's peak-rate factor. */
	peakRatio: number | null;
	note?: string;
};

/** Peak rate of each ease over its mean rate (GSAP: power1 is quadratic, power2 cubic). */
const EASE_PEAK: Record<string, number> = {
	none: 1,
	"power1.in": 2,
	"power1.out": 2,
	"power1.inOut": 2,
	"power2.in": 3,
	"power2.out": 3,
	"power2.inOut": 3,
	"power3.in": 4,
	"power3.out": 4,
	"power3.inOut": 4,
	"sine.inOut": Math.PI / 2,
	// 3 * c3 - 2 * c1 at t = 0, with c1 = 1.7 and c3 = c1 + 1; the 5% overshoot adds
	// about a tenth to the path the endpoint delta understates.
	"back.out(1.7)": 4.7,
};

export function easePeakFactor(ease: string): number {
	const factor = EASE_PEAK[ease];
	if (factor === undefined) throw new Error(`no peak factor for ease ${ease}`);
	return factor;
}

type Row = Omit<SpeedEntry, "meanRatio" | "peakRatio">;

function entry(row: Row): SpeedEntry {
	const mean = row.travelVh === null ? null : row.travelVh / row.spanVh;
	return {
		...row,
		meanRatio: mean,
		peakRatio: mean === null ? null : mean * easePeakFactor(row.ease),
	};
}

function heroRows(viewport: Viewport): SpeedEntry[] {
	const rows: SpeedEntry[] = [];
	for (const [name, factor] of Object.entries(HERO_PARALLAX)) {
		rows.push(
			entry({
				section: "hero",
				phase: "parallax",
				target: name,
				class: name.startsWith("ground") ? "large" : "small",
				travelVh: factor,
				spanVh: 1,
				ease: "none",
			}),
		);
	}
	const sunPx = Math.min(viewport.w, viewport.h) * (HERO_SUN_SIZE / 100);
	rows.push(
		entry({
			section: "hero",
			phase: "convergence",
			target: "sun (scale edge)",
			class: "small",
			travelVh:
				((SUN_CONVERGENCE_SCALE - 1) * (sunPx / Math.SQRT2)) / viewport.h,
			spanVh: CONVERGENCE_SPAN_VH,
			ease: "none",
			note: "corner of the disc's box, origin center",
		}),
	);
	// The character is 200x400 CSS px from sm up, 130x260 below; origin bottom left.
	const [cw, ch] = viewport.w >= 640 ? [200, 400] : [130, 260];
	rows.push(
		entry({
			section: "hero",
			phase: "convergence",
			target: "character (scale edge)",
			class: "small",
			travelVh:
				((1 - CHARACTER_SHRINK_SCALE) * Math.hypot(cw, ch)) / viewport.h,
			spanVh: CONVERGENCE_SPAN_VH,
			ease: "none",
			note: "top right corner, origin bottom left",
		}),
	);
	let radius = 0;
	HOLE_STAGES.forEach((stage, i) => {
		rows.push(
			entry({
				section: "hero",
				phase: `hole stage ${i + 1}`,
				target: "hole radius",
				class: "reveal",
				travelVh: stage.s - radius,
				spanVh: stage.duration * REVEAL_LENGTH_VH,
				ease: stage.ease,
				note: "edge speed of the reveal, not an object crossing",
			}),
		);
		radius = stage.s;
	});
	rows.push(
		entry({
			section: "hero",
			phase: "reveal (iOS carrier)",
			target: "sheet",
			class: "info",
			travelVh: REVEAL_TRAVEL_VH,
			spanVh: REVEAL_TRAVEL_VH,
			ease: "none",
			note: "must stay 1.0: the hole's yOff rides the same clock (FRA-185)",
		}),
	);
	return rows;
}

function sunRows(
	config: PanoramaConfig,
	chapter: number,
	phase: ReturnType<typeof storyPhases>,
	isLast: boolean,
	viewport: Viewport,
): SpeedEntry[] {
	const sun = config.sun;
	if (!sun) return [];
	const stageW = stageWidthPx(viewport);
	const stageH = stageHeightPx(config, viewport);
	const scrubLen = phase.len[`scrub@${chapter}`];
	const gs = sun.growthStart ?? 0.5;
	const [aw, ah] = config.aspect.split("/").map((n) => Number.parseFloat(n));
	const radiusPct = (scale: number) => (sun.size / 2) * scale * (aw / ah);
	const centerAtGs = sun.top + (sun.endTop - sun.top) * gs;
	const crownEnd = (sun.duskEndTop ?? sun.endTop) - radiusPct(sun.endScale);
	const arcLen =
		scrubLen * (1 - gs) +
		(isLast ? phase.len["outro-close"] + phase.len["outro-dusk"] : 0);
	const base = {
		section: "work-history" as const,
		class: "small" as const,
	};
	return [
		entry({
			...base,
			phase: `scrub@${chapter}`,
			target: "sun track x",
			travelVh:
				(Math.abs(sun.endLeft - sun.left) / 100) * (stageW / viewport.h),
			spanVh: scrubLen,
			ease: "none",
		}),
		entry({
			...base,
			phase: `scrub@${chapter}`,
			target: "sun track y (to growth start)",
			travelVh: (Math.abs(centerAtGs - sun.top) / 100) * (stageH / viewport.h),
			spanVh: scrubLen * gs,
			ease: "none",
		}),
		entry({
			...base,
			phase: `scrub@${chapter} arc`,
			target: "sun track y (growth arc)",
			travelVh:
				(Math.abs(crownEnd + radiusPct(1) - centerAtGs) / 100) *
				(stageH / viewport.h),
			spanVh: arcLen,
			ease: "none",
		}),
		entry({
			...base,
			phase: `scrub@${chapter} arc`,
			target: "sun disc (scale edge)",
			travelVh:
				(radiusPct(sun.endScale) - radiusPct(1)) / 100 / (viewport.h / stageH),
			spanVh: arcLen,
			ease: sun.growthEase ?? "power3.in",
			note: "the crown's dive pairs with the swell; edge is the disc's bottom",
		}),
	];
}

function workHistoryRows(viewport: Viewport): SpeedEntry[] {
	const phase = storyPhases(CHAPTERS);
	const rows: SpeedEntry[] = [];
	CHAPTERS.forEach((chapter, i) => {
		const config = chapter.panorama;
		const isLast = i === CHAPTERS.length - 1;
		const stageH = stageHeightPx(config, viewport);
		const spread = Math.max(SCENE_OUT_VH - EXIT_SETTLE_VH, 0.01);
		for (const layer of config.layers) {
			const name = `${chapter.id}/${layer.src.split("/").pop()}`;
			const box = layerBoxPx(layer, viewport);
			if (layer.from && !layer.drift && box) {
				const entranceSpan = layer.dur ?? config.durVh;
				const entranceEase = layer.ease ?? "power1.out";
				const entrancePhase =
					layer.yearCue !== undefined
						? `year-cue@${i} (${layer.yearCue})`
						: `panorama-in@${i}`;
				rows.push(
					entry({
						section: "work-history",
						phase: entrancePhase,
						target: name,
						class: "entrance",
						travelVh: entranceTravelVh(layer, viewport),
						spanVh: entranceSpan,
						ease: entranceEase,
					}),
				);
				const edge = scaleEdgeTravelPx(layer, box);
				if (edge !== null) {
					rows.push(
						entry({
							section: "work-history",
							phase: entrancePhase,
							target: `${name} (scale edge)`,
							class: "entrance",
							travelVh: edge / viewport.h,
							spanVh: entranceSpan,
							ease: entranceEase,
						}),
					);
				}
				if (!isLast) {
					const exitSpan = exitDurationVh(config, layer);
					rows.push(
						entry({
							section: "work-history",
							phase: `scene-out@${i}`,
							target: name,
							class: layerClass(layer),
							travelVh: exitTravelVh(config, layer, viewport),
							spanVh: exitSpan,
							ease: "power1.in",
							note: `starts ${(exitOrder(config, layer) * spread).toFixed(2)} in`,
						}),
					);
					if (edge !== null) {
						rows.push(
							entry({
								section: "work-history",
								phase: `scene-out@${i}`,
								target: `${name} (scale edge)`,
								class: layerClass(layer),
								travelVh: edge / viewport.h,
								spanVh: exitSpan,
								ease: "power1.in",
							}),
						);
					}
				}
			}
			if (layer.parallax) {
				const shiftVh =
					Math.abs(parallaxShiftPx(config, layer, viewport)) / viewport.h;
				rows.push(
					entry({
						section: "work-history",
						phase: `parallax@${i}`,
						target: name,
						class: layerClass(layer),
						travelVh: shiftVh,
						spanVh: phase.len[`parallax@${i}`],
						ease: "power1.inOut",
					}),
				);
				if (isLast) {
					rows.push(
						entry({
							section: "work-history",
							phase: "outro-close",
							target: name,
							class: layerClass(layer),
							travelVh: shiftVh,
							spanVh: phase.len["outro-close"],
							ease: "power1.inOut",
						}),
					);
				}
			}
		}
		if (config.horizonLocked) {
			const riseVh =
				Math.abs(curtainRisePx(config, stageH, viewport.h)) / viewport.h;
			const curtain = {
				section: "work-history" as const,
				target: `${chapter.id}/surface curtain`,
				class: "large" as const,
				travelVh: riseVh,
				ease: "power1.inOut",
			};
			rows.push(
				entry({
					...curtain,
					phase: `parallax@${i}`,
					spanVh: phase.len[`parallax@${i}`],
				}),
			);
			rows.push(
				isLast
					? entry({
							...curtain,
							phase: "outro-close",
							spanVh: phase.len["outro-close"],
						})
					: entry({
							...curtain,
							phase: `scene-out@${i}`,
							spanVh: SCENE_OUT_VH * 0.6,
						}),
			);
		}
		rows.push(...sunRows(config, i, phase, isLast, viewport));
		rows.push(
			entry({
				section: "work-history",
				phase: `scrub@${i}`,
				target: `${chapter.id}/scene`,
				class: "info",
				travelVh: 0,
				spanVh: phase.len[`scrub@${i}`],
				ease: "none",
				note: "readouts only; the scene holds while the years pass",
			}),
		);
	});
	return rows;
}

function landfallRows(viewport: Viewport): SpeedEntry[] {
	const { at, len, total } = DESCENT_PHASE;
	const rows: SpeedEntry[] = [];
	for (const layer of STAR_LAYERS) {
		rows.push(
			entry({
				section: "landfall",
				phase: "descent",
				target: `stars ${layer.name}`,
				class: "small",
				travelVh: Math.abs(layer.travel) / 100,
				spanVh: total,
				ease: "none",
			}),
		);
	}
	const stationY = (STATION_TRAVEL.y[0] - STATION_TRAVEL.y[1]) / 100;
	const stationX =
		((STATION_TRAVEL.x[0] - STATION_TRAVEL.x[1]) / 100) *
		(viewport.w / viewport.h);
	rows.push(
		entry({
			section: "landfall",
			phase: "drift+limb",
			target: "station",
			class: "large",
			travelVh: Math.hypot(stationX, stationY),
			spanVh: at.entry - at.drift,
			ease: "none",
		}),
	);
	rows.push(
		entry({
			section: "landfall",
			phase: "limb+entry",
			target: "earth rise",
			class: "large",
			travelVh: EARTH_RISE_VH / 100,
			spanVh: len.limb + len.entry * EARTH_RISE_ENTRY_FRACTION,
			ease: "power1.out",
		}),
	);
	rows.push(
		entry({
			section: "landfall",
			phase: "entry",
			target: "earth swell",
			class: "info",
			travelVh: null,
			spanVh: len.entry,
			ease: "none",
			note: "scale about the top edge: the visible limb holds while its curve flattens",
		}),
	);
	for (const slot of CLOUD_SLOTS) {
		rows.push(
			entry({
				section: "landfall",
				phase: "clouds",
				target: slot.src,
				class: "large",
				travelVh: (CLOUD_CLEARANCE_VH + cloudHeightVh(slot, viewport)) / 100,
				spanVh: at.settle - (at.clouds + slot.at),
				ease: "none",
			}),
		);
	}
	return rows;
}

function vistaRows(viewport: Viewport): SpeedEntry[] {
	const base = { section: "vista" as const, phase: "entry", ease: "none" };
	// The vista scrubs over its own height, about one viewport.
	const spanVh = 1;
	const rows: SpeedEntry[] = [];
	for (const [name, travel] of Object.entries(VISTA_TRAVEL)) {
		rows.push(
			entry({
				...base,
				target: name,
				class: name === "horizon" ? "small" : "large",
				travelVh: Math.abs(travel.to - travel.from) / 100,
				spanVh,
			}),
		);
	}
	rows.push(
		entry({
			...base,
			target: "horizon (scale)",
			class: "info",
			travelVh: null,
			spanVh,
			note: `bank grows to ${VISTA_HORIZON_SCALE} from its bottom edge; its box is art-sized`,
		}),
	);
	for (const [name, travel] of Object.entries(VISTA_CLOUD_PLANES)) {
		rows.push(
			entry({
				...base,
				target: `cloud plane ${name}`,
				class: "small",
				travelVh: Math.abs(travel.to - travel.from) / 100,
				spanVh,
			}),
		);
	}
	rows.push(
		entry({
			...base,
			target: "sun",
			class: "small",
			travelVh: Math.abs(VISTA_SUN_TRAVEL.to - VISTA_SUN_TRAVEL.from) / 100,
			spanVh,
		}),
	);
	void viewport;
	return rows;
}

function projectsRows(): SpeedEntry[] {
	return [
		entry({
			section: "projects",
			phase: "seed scrub",
			target: "starfield",
			class: "info",
			travelVh: null,
			spanVh: 2,
			ease: "none",
			note: "stars accumulate and the UFO rides in; the theater then plays on real time",
		}),
		entry({
			section: "projects",
			phase: "showcase",
			target: "rail and tip",
			class: "info",
			travelVh: 7,
			spanVh: 7,
			ease: "none",
			note: "one viewport per project, 1:1 with progress",
		}),
	];
}

/** Every scrubbed tween at one viewport, fastest peak first. */
export function speedMap(viewport: Viewport): SpeedEntry[] {
	const rows = [
		...heroRows(viewport),
		...workHistoryRows(viewport),
		...landfallRows(viewport),
		...vistaRows(viewport),
		...projectsRows(),
	];
	return rows.sort((a, b) => (b.peakRatio ?? -1) - (a.peakRatio ?? -1));
}

/** Rows whose class carries a cap and that exceed it. */
export function budgetViolations(entries: SpeedEntry[]): SpeedEntry[] {
	return entries.filter((row) => {
		if (row.class !== "large" && row.class !== "small") return false;
		const cap = PACING_BUDGET[row.class];
		return (
			(row.meanRatio ?? 0) > cap.mean + 1e-9 ||
			(row.peakRatio ?? 0) > cap.peak + 1e-9
		);
	});
}

/** Where each transitioning chapter's last exit ends, against the phase length. */
export function exitWindows(): {
	chapter: string;
	endVh: number;
	lenVh: number;
}[] {
	return CHAPTERS.slice(0, -1).map((chapter) => ({
		chapter: chapter.id,
		endVh: exitWindowVh(chapter.panorama, SCENE_OUT_VH),
		lenVh: SCENE_OUT_VH,
	}));
}

export { BUDGET_VIEWPORTS, PACING_BUDGET };
