import { type PhaseSpec, resolvePhases } from "./scroll-phases";

/**
 * The landfall descent's phases and every scrubbed travel, DOM-free so the speed map can
 * audit them. Seconds are viewport-heights; the 200vh pull-up plus the fade and hold
 * lengths are the handoff contract with other-projects.tsx (README inv. 11).
 */
const PHASES: PhaseSpec[] = [
	/** Crossfade over the pinned projects canvas; both skies motionless. */
	{ id: "fade", len: 1 },
	/** Pinned sky while the showcase panel exits above the stage. */
	{ id: "hold", len: 1 },
	/** Stars alone; the station crosses the frame. */
	{ id: "drift", len: 1.75 },
	/** The atmosphere's glow crests the bottom edge, then the limb itself. */
	{ id: "limb", len: 1.75 },
	/** Into the glow: deep blue floods up, stars wash out. */
	{ id: "entry", len: 1.5 },
	/** Daylight: deep blue crossfades to day sky, the sun blooms. */
	{ id: "day", len: 1.25 },
	/** The cloud deck streams past, overlapping the daylight turn. */
	{ id: "clouds", len: 2.5, with: "day", offset: 0.5 },
	/** Clean sky breather before the vista scrolls in. */
	{ id: "settle", len: 0.5 },
];
export const DESCENT_PHASE = resolvePhases(PHASES);

/** Deeper layers travel less; travel spans the full pin so the parallax never stops
 * while stars are visible (they fade during entry). */
export const STAR_LAYERS = [
	{ name: "far", seed: 11, count: 90, min: 0.5, max: 1.0, travel: -22 },
	{ name: "mid", seed: 23, count: 60, min: 0.7, max: 1.4, travel: -48 },
	{ name: "near", seed: 47, count: 34, min: 0.9, max: 2.0, travel: -85 },
] as const;

/** The station's crossing, in vh (y) and vw (x), over drift plus limb. */
export const STATION_TRAVEL = { y: [80, -80], x: [4, -3] } as const;
/** The limb's rise (vh) over limb plus this fraction of entry, then its swell. */
export const EARTH_RISE_VH = 56;
export const EARTH_RISE_ENTRY_FRACTION = 0.6;
export const EARTH_SWELL_SCALE = 1.9;

/**
 * Cirrus leads, cumulus follow. Every slot ends exactly at the settle boundary, so a
 * later `at` means a faster cloud; travel derives from rendered height at run time.
 * Spaced so no cloud outruns the scroll (under 1.0x) at either budget viewport.
 */
export const CLOUD_SLOTS = [
	{ src: "cloud9-high", w: 1463, h: 203, left: "8%", width: "44vw", at: 0 },
	{
		src: "cloud10-high",
		w: 1436,
		h: 141,
		left: "55%",
		width: "42vw",
		at: 0.15,
	},
	{ src: "cloud4", w: 1613, h: 382, left: "2%", width: "38vw", at: 0.45 },
	{ src: "cloud2", w: 1587, h: 699, left: "52%", width: "45vw", at: 0.6 },
	{ src: "cloud6", w: 1442, h: 514, left: "62%", width: "40vw", at: 0.8 },
	{ src: "cloud3", w: 1632, h: 745, left: "-8%", width: "55vw", at: 0.95 },
] as const;
/** A cloud clears the frame (viewport plus margin) beyond its own height. */
export const CLOUD_CLEARANCE_VH = 105;

/** Rendered cloud height in vh at a viewport: the slot's vw width times the asset ratio. */
export function cloudHeightVh(
	slot: (typeof CLOUD_SLOTS)[number],
	viewport: { w: number; h: number },
): number {
	const widthPx = (Number.parseFloat(slot.width) / 100) * viewport.w;
	return ((widthPx * slot.h) / slot.w / viewport.h) * 100;
}

/**
 * The vista's entry planes, in vh from their start pose to rest, over the vista's own
 * height of scroll. Distant planes lag, foreground leads; every cloud plane stays below
 * the cliff's 14vh so no sky layer outruns the rock.
 */
export const VISTA_TRAVEL = {
	horizon: { from: -6, to: 0 },
	sea: { from: -3.5, to: 0 },
	cliff: { from: 14, to: 0 },
	ground: { from: 20, to: 0 },
} as const;
/** The bank grows from natural size so its side edges never pull into view. */
export const VISTA_HORIZON_SCALE = 1.3;
export const VISTA_CLOUD_PLANES = {
	low: { from: 2, to: -2.5 },
	mid: { from: 3.5, to: -5 },
	high: { from: 5, to: -7 },
} as const;
/** The sun is the most distant object: the smallest travel of all. */
export const VISTA_SUN_TRAVEL = { from: 1.5, to: -1 } as const;
