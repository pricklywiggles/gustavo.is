import type gsap from "gsap";
import type { CSSProperties } from "react";

// Career data hand-normalized from tmp/work-history.xlsx; blank spreadsheet cells inherit
// from the row above.

// Panorama layers are trimmed exports from the authored canvas: full-width bands anchor to
// the canvas bottom, sprites carry canvas-percentage positions, array order is z-order
// bottom to top.
/**
 * Below-sm placement overrides, rendered as custom properties behind max-sm: classes: no JS
 * runs on breakpoint flips, and phase builders that measure config read the desktop values.
 */
export type MobilePlacement = {
	left?: string;
	top?: string;
	width?: string;
};

export type PanoramaLayer = {
	src: string;
	style: CSSProperties;
	/** Requires left, top, and width in `style`; missing mobile axes fall back to desktop. */
	mobile?: MobilePlacement;
	/** Scroll-in beat; absent for drift (own clock) and year-cued layers. */
	step?: number;
	from?: gsap.TweenVars;
	origin?: string;
	/** Entrance ease; the cascade's default is power1.out. */
	ease?: string;
	/** Entrance length override, in viewport-heights; defaults to durVh. */
	dur?: number;
	/** Enters when the time scrub reaches this year instead of during the cascade. */
	yearCue?: number;
	/** Clouds: wrap in a sway element that drifts/breathes forever. */
	ambient?: boolean;
	/** Vessels (ferry, sailboats): time-based sail-in, decoupled from the scrub. */
	drift?: boolean;
	/**
	 * Post-landing parallax shift as a fraction of stage height, positive down. Sea-level
	 * layers hold as the pivot; z-above rises, z-below sinks to open the HUD band.
	 */
	parallax?: number;
	/** Flat-color extension below a rising band so the exposed stage reads as the page surface. */
	fill?: string;
};

/** A boat that sails in on real time once its cue layer has landed. */
export type VesselConfig = {
	/** src of the drift layer this vessel animates. */
	src: string;
	/** Casts off when the cascade beat at this step has landed. */
	cueStep: number;
	sailSeconds: number;
	fromSide: "left" | "right";
	/** Mooring and width in stage percentages, shared with the layer style. */
	leftPct: number;
	widthPct: number;
};

/** Programmatic sun disc behind every layer; it lowers and grows across the time scrub. */
export type SunConfig = {
	/** Resting disc CENTER and diameter, in canvas percentages. */
	left: number;
	top: number;
	size: number;
	/** Disc CENTER when the scrub's descent ends (canvas %). */
	endLeft: number;
	endTop: number;
	/**
	 * Dusk descent target (disc-center canvas %): the swollen disc's top edge must finish
	 * below the occluding hill's crest. Absent, dusk continues at the scrub's descent speed.
	 */
	duskEndTop?: number;
	/** Scale when dusk finishes; the growth is one arc from growthStart through the end of dusk. */
	endScale: number;
	/** Growth-arc ease; defaults to power3.in. */
	growthEase?: string;
	/** Growth-arc start as a fraction of the scrub's descent (0 first year, 1 dusk). Default 0.5. */
	growthStart?: number;
	/**
	 * Below-sm RESTING disc center (canvas %). Deltas still come from the desktop numbers,
	 * so the whole arc translates rigidly; no size knob, or the crown arc would desync.
	 */
	mobile?: { left?: number; top?: number };
};

/** A city's full animation spec: every timing lives here so each panorama has its own rhythm. */
export type PanoramaConfig = {
	aspect: string;
	/**
	 * Canvas x-fraction the below-sm crop centers on (default 0.5). Any value is safe: the
	 * stage offset clamps to real coverage slack, degrading to an edge-flush crop.
	 */
	mobileFocusX?: number;
	layers: PanoramaLayer[];
	/** Per-layer entrance length, in viewport-heights of scroll. */
	durVh: number;
	/** Beat spacing between layer entrances, in viewport-heights. */
	stepVh: number;
	/** Highest `step` in layers: the cascade's last beat. */
	lastStep: number;
	/**
	 * Rises are authored to stop at sea level: never amplify for band clearance, or short
	 * viewports push water tops past the horizon. The band is whatever the rises reveal.
	 */
	horizonLocked?: boolean;
	vessels?: VesselConfig[];
	sun?: SunConfig;
};

export type Stint = {
	company: string;
	/** Path under public/, omitted while the asset doesn't exist yet. */
	companyLogo?: string;
	role: string;
	product: string;
	productLogo?: string;
	/** [start, end) in fractional years. */
	years: [number, number];
	/** Users this product reached; the HUD counter accumulates these. */
	usersReached?: number;
};

export type CityChapter = {
	id: "seattle" | "san-francisco" | "los-angeles";
	name: string;
	/** [first, last] year the chapter's time scrub covers. */
	span: [number, number];
	panorama: PanoramaConfig;
	stints: Stint[];
};

/**
 * Latest stint that has started at the given year; a gap between jobs holds the previous
 * stint rather than blanking the bar.
 */
export function stintIndexAt(stints: Stint[], year: number): number {
	for (let i = stints.length - 1; i > 0; i--) {
		if (year >= stints[i].years[0]) return i;
	}
	return 0;
}

/**
 * Years a users figure accrues over: a company-wide figure (Microsoft's 200M) extends
 * through following same-company stints until the next figure; per-product figures don't.
 */
function accrualWindow(stints: Stint[], index: number): [number, number] {
	const start = stints[index].years[0];
	let end = stints[index].years[1];
	for (let i = index + 1; i < stints.length; i++) {
		if (stints[i].company !== stints[index].company) break;
		if (stints[i].usersReached != null) break;
		end = stints[i].years[1];
	}
	return [start, end];
}

/**
 * Accrued smoothly across each figure's window so the counter climbs rather than jumping at
 * stint boundaries; quantized to three significant figures so scrolling doesn't thrash React.
 */
export function cumulativeUsersAt(stints: Stint[], year: number): number {
	let total = 0;
	stints.forEach((stint, index) => {
		const reached = stint.usersReached;
		if (!reached) return;
		const [from, to] = accrualWindow(stints, index);
		if (year >= to) total += reached;
		else if (year > from) total += (reached * (year - from)) / (to - from);
	});
	if (total < 1000) return Math.round(total);
	const step = 10 ** (Math.floor(Math.log10(total)) - 2);
	return Math.round(total / step) * step;
}

/** Prior chapters' final totals; the counter is cumulative across the whole career. */
export function carriedUsersBefore(
	chapters: CityChapter[],
	index: number,
): number {
	let total = 0;
	for (let i = 0; i < index && i < chapters.length; i++) {
		total += cumulativeUsersAt(chapters[i].stints, chapters[i].span[1]);
	}
	return total;
}

const BAND: CSSProperties = { left: 0, bottom: 0, width: "100%" };
const BOTTOM = "50% 100%";

const FERRY_LEFT_PCT = 26;
const FERRY_WIDTH_PCT = 31.5;

const SEATTLE_PANORAMA: PanoramaConfig = {
	aspect: "2688 / 1792",
	mobileFocusX: 0.3,
	durVh: 0.9,
	stepVh: 0.3,
	lastStep: 10,
	vessels: [
		{
			src: "/seattle-panorama/10-ferry.webp",
			cueStep: 8.25,
			sailSeconds: 200,
			fromSide: "right",
			leftPct: FERRY_LEFT_PCT,
			widthPct: FERRY_WIDTH_PCT,
		},
	],
	layers: [
		{
			src: "/seattle-panorama/1-high-cloud-left.webp",
			style: { left: "24%", top: "6%", width: "22%" },
			step: 0,
			from: { xPercent: -80, scale: 1.7 },
			ambient: true,
			parallax: 0.04,
		},
		{
			src: "/seattle-panorama/1-high-cloud-right.webp",
			style: { left: "80%", top: "5%", width: "21.6%" },
			step: 0,
			from: { xPercent: 80, scale: 1.7 },
			ambient: true,
			parallax: 0.04,
		},
		{
			src: "/seattle-panorama/2-sky.webp",
			style: BAND,
			step: 1,
			from: { yPercent: 25 },
			parallax: 0.036,
		},
		{
			src: "/seattle-panorama/3-mountain.webp",
			style: BAND,
			step: 2,
			from: { xPercent: 12, scale: 1.2 },
			origin: BOTTOM,
			parallax: 0.032,
		},
		{
			src: "/seattle-panorama/4-low-cloud-left.webp",
			style: { left: 0, top: "8%", width: "65.5%" },
			step: 3,
			from: { xPercent: -50, scale: 1.5 },
			ambient: true,
			parallax: 0.028,
		},
		{
			src: "/seattle-panorama/4-low-cloud-right.webp",
			style: { left: "77.5%", top: "22.5%", width: "24.6%" },
			step: 3,
			from: { xPercent: 60, scale: 1.5 },
			ambient: true,
			parallax: 0.028,
		},
		{
			src: "/seattle-panorama/5-mountain-ridge.webp",
			style: BAND,
			step: 4,
			from: { yPercent: 18, xPercent: 6, scale: 1.1 },
			origin: BOTTOM,
			parallax: 0.024,
		},
		{
			src: "/seattle-panorama/6-mountain-ridge-2.webp",
			style: BAND,
			step: 5,
			from: { xPercent: -12, scale: 1.1 },
			origin: BOTTOM,
			parallax: 0.02,
		},
		{
			src: "/seattle-panorama/7-mountain-ridge-3.webp",
			style: BAND,
			step: 6,
			from: { yPercent: 20, scale: 1.2 },
			origin: BOTTOM,
			parallax: 0.016,
		},
		{
			src: "/seattle-panorama/8-water-0.webp",
			style: BAND,
			step: 7.75,
			from: { yPercent: 60 },
		},
		{
			src: "/seattle-panorama/9-city-profile-far.webp",
			style: BAND,
			step: 7,
			from: { yPercent: 15, scale: 1.15 },
			origin: BOTTOM,
		},
		{
			src: "/seattle-panorama/9-city-profile-near.webp",
			style: BAND,
			step: 8.25,
			from: { yPercent: 15, xPercent: -8, scale: 1.15 },
			origin: BOTTOM,
			parallax: -0.045,
		},
		{
			src: "/seattle-panorama/11-water-1.webp",
			style: BAND,
			step: 9.25,
			from: { yPercent: 80 },
			parallax: -0.1,
		},
		{
			src: "/seattle-panorama/12-water-2.webp",
			style: BAND,
			step: 10,
			from: { yPercent: 100 },
			parallax: -0.125,
			fill: "var(--color-pale-dune)",
		},
		{
			src: "/seattle-panorama/10-ferry.webp",
			style: {
				left: `${FERRY_LEFT_PCT}%`,
				top: "81.8%",
				width: `${FERRY_WIDTH_PCT}%`,
			},
			drift: true,
			parallax: -0.125,
		},
	],
};

// San Francisco positions were template-matched from the composed reference: the numbers are
// the composition's own, never round or "tidy" them (oddities are cataloged in the README).
const SF_BOAT_MIDDLE_LEFT_PCT = 35.43;
const SF_BOAT_NEAR_LEFT_PCT = 60.39;
const SF_BOAT_WIDTH_PCT = 12.6;
const TOWER_RISE = {
	from: { yPercent: 100 },
	ease: "back.out(1.7)",
	dur: 0.5,
	parallax: 0.012,
};

const SAN_FRANCISCO_PANORAMA: PanoramaConfig = {
	aspect: "2688 / 1792",
	mobileFocusX: 0.38,
	durVh: 0.9,
	stepVh: 0.3,
	lastStep: 13.8,
	horizonLocked: true,
	vessels: [
		{
			src: "/san-francisco-panorama/19-sailboat-middle.webp",
			cueStep: 14,
			sailSeconds: 230,
			fromSide: "left",
			leftPct: SF_BOAT_MIDDLE_LEFT_PCT,
			widthPct: SF_BOAT_WIDTH_PCT,
		},
		{
			src: "/san-francisco-panorama/21-sailboat-near.webp",
			cueStep: 14.6,
			sailSeconds: 170,
			fromSide: "right",
			leftPct: SF_BOAT_NEAR_LEFT_PCT,
			widthPct: SF_BOAT_WIDTH_PCT,
		},
	],
	layers: [
		{
			src: "/san-francisco-panorama/1-clouds-far.webp",
			style: { left: "1.05%", top: "1.57%", width: "99.03%" },
			step: 0,
			from: { xPercent: 45 },
			ambient: true,
			parallax: 0.04,
		},
		{
			src: "/san-francisco-panorama/2-clouds-near.webp",
			style: { left: 0, top: "5.92%", width: "108.52%" },
			step: 0.5,
			from: { yPercent: -140 },
			ambient: true,
			parallax: 0.028,
		},
		{
			src: "/san-francisco-panorama/3-hills-far.webp",
			style: { left: 0, top: "33.7%", width: "100%" },
			step: 1,
			from: { yPercent: 30 },
			parallax: 0.032,
		},
		{
			src: "/san-francisco-panorama/4-hills-middle.webp",
			style: { left: "-21.58%", top: "52.42%", width: "126.82%" },
			step: 1.5,
			from: { yPercent: 25 },
			parallax: 0.026,
		},
		{
			src: "/san-francisco-panorama/5-hills-near.webp",
			style: { left: "0%", top: "41.55%", width: "115.69%" },
			step: 2,
			from: { yPercent: 22 },
			parallax: 0.02,
		},
		// The Salesforce Tower: historically 2017, cued two years early for more screen time.
		{
			src: "/san-francisco-panorama/6-eight-building.webp",
			style: { left: "18.36%", top: "12.68%", width: "7.63%" },
			yearCue: 2015,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/7-sixth-building.webp",
			style: { left: "38.01%", top: "58.7%", width: "10.75%" },
			step: 13.8,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/8-fifth-building.webp",
			style: { left: "29.42%", top: "46.48%", width: "5.58%" },
			step: 13.4,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/9-seventh-building.webp",
			style: { left: "32.37%", top: "32.71%", width: "7.29%" },
			step: 13,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/10-fourth-building.webp",
			style: { left: "10.59%", top: "55.71%", width: "7.03%" },
			step: 11.2,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/11-third-building.webp",
			style: { left: "15.9%", top: "58.3%", width: "7.03%" },
			step: 10.8,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/12-second-building.webp",
			style: { left: "21.24%", top: "43.31%", width: "6.47%" },
			step: 10.4,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/13-first-building.webp",
			style: { left: "26.24%", top: "59.2%", width: "5.25%" },
			step: 10,
			...TOWER_RISE,
		},
		{
			src: "/san-francisco-panorama/14-city-bridge.webp",
			style: { left: 0, top: "46.87%", width: "100%" },
			step: 4,
			from: { yPercent: 30, xPercent: -10 },
		},
		// Sea level is water-far's top edge: city-bridge, city-front, water-far, and
		// bridge-front hold (no parallax) so the horizon never shears when the band opens.
		{
			src: "/san-francisco-panorama/15-city-front.webp",
			style: { left: "-9.16%", top: "51.9%", width: "62.72%" },
			step: 4.5,
			from: { yPercent: 40 },
		},
		{
			src: "/san-francisco-panorama/16-water-far.webp",
			style: { left: 0, top: "85.76%", width: "100%" },
			step: 5,
			from: { yPercent: 60 },
		},
		{
			src: "/san-francisco-panorama/17-bridge-front.webp",
			style: { left: "73%", top: "21.3%", width: "25.02%" },
			step: 7,
			from: { yPercent: 30, xPercent: 12 },
		},
		// Rises are authored just under the sea-level cap (85.76), staggered so the bands
		// compress toward the horizon; each boat is welded to its strip's shift.
		{
			src: "/san-francisco-panorama/18-water-middle.webp",
			style: { left: 0, top: "88.42%", width: "100%" },
			step: 7.5,
			from: { yPercent: 80 },
			parallax: -0.02,
		},
		{
			src: "/san-francisco-panorama/19-sailboat-middle.webp",
			style: {
				left: `${SF_BOAT_MIDDLE_LEFT_PCT}%`,
				top: "71.26%",
				width: `${SF_BOAT_WIDTH_PCT}%`,
			},
			drift: true,
			parallax: -0.02,
		},
		{
			src: "/san-francisco-panorama/20-water-near.webp",
			style: { left: 0, top: "92.4%", width: "100%" },
			step: 8,
			from: { yPercent: 100 },
			parallax: -0.055,
			fill: "var(--color-pale-dune)",
		},
		{
			src: "/san-francisco-panorama/21-sailboat-near.webp",
			style: {
				left: `${SF_BOAT_NEAR_LEFT_PCT}%`,
				top: "73.56%",
				width: `${SF_BOAT_WIDTH_PCT}%`,
			},
			drift: true,
			parallax: -0.055,
		},
	],
};

// Los Angeles is template-matched like San Francisco: never round or "tidy" the numbers.
// Sea level is near-city's top (57.59): it holds, haze and street-view rise, the rest sinks.
const LA_PANORAMA: PanoramaConfig = {
	aspect: "2688 / 1792",
	mobileFocusX: 0.38,
	durVh: 0.9,
	stepVh: 0.3,
	lastStep: 13,
	horizonLocked: true,
	// endLeft matches left on purpose: the center drops straight down. duskEndTop derives
	// from far-hill's crest (28.86%) plus the swollen radius; re-derive if art moves.
	sun: {
		left: 63.5,
		top: 21.5,
		size: 7,
		endLeft: 63.5,
		endTop: 38.5,
		duskEndTop: 63,
		endScale: 5.8,
		growthEase: "power2.in",
		growthStart: 0.5,
		mobile: { left: 47 },
	},
	layers: [
		{
			src: "/los-angeles-panorama/1-large-cloud.webp",
			style: { left: "-0.12%", top: "4.11%", width: "98.62%" },
			step: 0,
			from: { xPercent: -35 },
			ambient: true,
			parallax: 0.04,
		},
		{
			src: "/los-angeles-panorama/2-cloud-left.webp",
			style: { left: "20.87%", top: "10.28%", width: "34.45%" },
			step: 0.5,
			from: { xPercent: -60 },
			ambient: true,
			parallax: 0.03,
		},
		{
			src: "/los-angeles-panorama/2-cloud-right.webp",
			style: { left: "87.22%", top: "11.63%", width: "11.09%" },
			step: 1,
			from: { xPercent: 80 },
			ambient: true,
			parallax: 0.03,
		},
		{
			src: "/los-angeles-panorama/3-far-hill.webp",
			style: { left: "-0.36%", top: "19.67%", width: "100%" },
			step: 3,
			from: { yPercent: 25 },
			parallax: 0.032,
		},
		{
			src: "/los-angeles-panorama/3.5-middle-hill.webp",
			style: { left: "-0.24%", top: "24.5%", width: "100%" },
			step: 3.5,
			from: { yPercent: 22 },
			parallax: 0.026,
		},
		{
			src: "/los-angeles-panorama/4-near-hill.webp",
			style: { left: "-0.3%", top: "55.98%", width: "110.94%" },
			step: 4,
			from: { yPercent: 18 },
			parallax: 0.02,
		},
		// Same step/parallax as near-hill so they stay one plane. yPercent is the hill's 18
		// times the asset height ratio (2871/153); re-derive if either asset is re-trimmed.
		{
			src: "/los-angeles-panorama/4-hollywood-sign.webp",
			style: { left: "60.66%", top: "62.55%", width: "8.28%" },
			mobile: { left: "48.66%", top: "60.55%", width: "8.28%" },
			step: 4,
			from: { yPercent: 337.8 },
			parallax: 0.02,
		},
		// The towers rise from behind the already-landed city masses; z-order stays as authored.
		{
			src: "/los-angeles-panorama/5-building-6.webp",
			style: { left: "23%", top: "21.89%", width: "6.66%" },
			step: 9,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/5-building-7.webp",
			style: { left: "28.92%", top: "31.3%", width: "7.37%" },
			step: 9.4,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/6-building-1.webp",
			style: { left: "15.25%", top: "36.65%", width: "7.51%" },
			step: 9.8,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/5-building-8.webp",
			style: { left: "36.7%", top: "26.84%", width: "5.63%" },
			step: 11.4,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/6-building-2.webp",
			style: { left: "20.87%", top: "38.99%", width: "7.03%" },
			step: 11.8,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/6-building-3.webp",
			style: { left: "32.91%", top: "44.45%", width: "7.07%" },
			step: 12.2,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/6-building-4.webp",
			style: { left: "42.57%", top: "55.89%", width: "5.73%" },
			step: 12.6,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/6-building-5.webp",
			style: { left: "50.86%", top: "59.11%", width: "5.21%" },
			step: 13,
			...TOWER_RISE,
		},
		{
			src: "/los-angeles-panorama/7-near-city.webp",
			style: { left: "-0.12%", top: "57.59%", width: "100%" },
			step: 6,
			from: { yPercent: 30, xPercent: -10 },
		},
		{
			src: "/los-angeles-panorama/8-haze.webp",
			style: { left: "-0.18%", top: "75.37%", width: "100%" },
			step: 6.5,
			from: { yPercent: 60 },
			parallax: -0.065,
		},
		{
			src: "/los-angeles-panorama/9-street-view.webp",
			style: { left: "-0.36%", top: "34.6%", width: "100%" },
			step: 7,
			from: { yPercent: 40 },
			parallax: -0.13,
			fill: "var(--color-pale-dune)",
		},
	],
};

// The 2006-2009 Slide era's four products share one spreadsheet window, equally spaced.
export const CHAPTERS: CityChapter[] = [
	{
		id: "seattle",
		name: "Seattle",
		span: [1998, 2005],
		panorama: SEATTLE_PANORAMA,
		stints: [
			{
				company: "Microsoft",
				companyLogo: "/logos/microsoft.svg",
				role: "Software Design Engineer",
				product: "Word",
				productLogo: "/logos/word.webp",
				years: [1998, 1999],
				usersReached: 75_000_000,
			},
			{
				company: "Microsoft",
				companyLogo: "/logos/microsoft.svg",
				role: "Software Design Engineer",
				product: "Office",
				productLogo: "/logos/office.svg",
				years: [1999, 2000],
				// The balance of Microsoft's 200M: a figure here ends Word's accrual window
				// and opens one running through the rest of the Microsoft years.
				usersReached: 125_000_000,
			},
			{
				company: "Microsoft",
				companyLogo: "/logos/microsoft.svg",
				role: "Software Design Engineer in Test",
				product: "Natural Language Group",
				productLogo: "/logos/nlg-logo.webp",
				years: [2000, 2002],
			},
			{
				company: "Microsoft",
				companyLogo: "/logos/microsoft.svg",
				role: "Software Design Engineer in Test",
				product: "Natural UI",
				productLogo: "/logos/nui-logo.webp",
				years: [2002, 2004],
			},
			{
				company: "Microsoft",
				companyLogo: "/logos/microsoft.svg",
				role: "Software Design Engineer in Test",
				product: "VSTO",
				productLogo: "/logos/vsto.webp",
				years: [2004, 2005],
			},
		],
	},
	{
		id: "san-francisco",
		name: "San Francisco",
		span: [2005, 2018],
		panorama: SAN_FRANCISCO_PANORAMA,
		stints: [
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Software Design Engineer in Test",
				product: "Slide Photo Sharing App",
				productLogo: "/logos/slide-client.webp",
				years: [2005, 2006],
				usersReached: 20_000_000,
			},
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Director of Quality Assurance",
				product: "Top Friends",
				productLogo: "/logos/top-friends.webp",
				years: [2006, 2006.75],
			},
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Director of Quality Assurance",
				product: "SuperPoke",
				productLogo: "/logos/superpoke.webp",
				years: [2006.75, 2007.5],
			},
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Director of Quality Assurance",
				product: "FunWall",
				productLogo: "/logos/funwall.webp",
				years: [2007.5, 2008.25],
			},
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Director of Quality Assurance",
				product: "SuperPoke Pets",
				productLogo: "/logos/superpoke-pets.webp",
				years: [2008.25, 2009],
			},
			{
				company: "slide.com",
				companyLogo: "/logos/slide.com.webp",
				role: "Product Manager",
				product: "Superpocus",
				productLogo: "/logos/superpocus.webp",
				years: [2009, 2012],
			},
			{
				company: "Jawbone",
				companyLogo: "/logos/jawbone.svg",
				role: "Product Manager",
				product: "UP Fitness App",
				productLogo: "/logos/up.webp",
				years: [2012, 2013],
				usersReached: 200_000,
			},
			{
				company: "Jawbone",
				companyLogo: "/logos/jawbone.svg",
				role: "Sr. Engineering Program Manager",
				product: "UP24",
				productLogo: "/logos/up24.webp",
				years: [2013, 2014],
				usersReached: 400_000,
			},
			{
				company: "Jawbone",
				companyLogo: "/logos/jawbone.svg",
				role: "Sr. Engineering Program Manager",
				product: "UP 2",
				productLogo: "/logos/up2.webp",
				years: [2014, 2015],
				usersReached: 1_200_000,
			},
			{
				company: "Jawbone",
				companyLogo: "/logos/jawbone.svg",
				role: "Sr. Engineering Program Manager",
				product: "UP 3",
				productLogo: "/logos/up3.webp",
				years: [2015, 2017],
				usersReached: 1_200_000,
			},
		],
	},
	{
		id: "los-angeles",
		name: "Los Angeles",
		span: [2018, 2026],
		panorama: LA_PANORAMA,
		stints: [
			// Worked remotely from LA, so it opens this chapter though the company stayed in SF.
			{
				company: "Jawbone Health Hub",
				companyLogo: "/logos/jawbone-health.png",
				role: "Sr. Engineering Program Manager",
				product: "Jawbone Health",
				productLogo: "/logos/jawbone-health.png",
				years: [2018, 2019],
				usersReached: 0,
			},
			{
				company: "Meaning",
				companyLogo: "/logos/ponder-logo.svg",
				role: "Software Design Engineer / CTO",
				product: "Ponder team collaboration",
				productLogo: "/logos/ponder-teams.webp",
				years: [2019, 2020],
				usersReached: 3,
			},
			{
				company: "Meaning",
				companyLogo: "/logos/ponder-logo.svg",
				role: "Software Design Engineer / CTO",
				product: "Ponder blogging platform",
				productLogo: "/logos/ponder-blogs.webp",
				years: [2020, 2021],
				usersReached: 3,
			},
			{
				company: "Tartle",
				companyLogo: "/logos/tartle.svg",
				role: "Staff Software Design Engineer",
				product: "Tartle Marketplace",
				productLogo: "/logos/marketplace.webp",
				years: [2021, 2023],
				usersReached: 200_000,
			},
			{
				company: "Tartle",
				companyLogo: "/logos/tartle.svg",
				role: "Staff Software Design Engineer",
				product: "Datavault",
				productLogo: "/logos/datavault.webp",
				years: [2023, 2025],
				usersReached: 300_000,
			},
			{
				company: "Tartle",
				companyLogo: "/logos/tartle.svg",
				role: "Staff Software Engineer",
				product: "Mirror AI Health Coach",
				productLogo: "/logos/mirror.webp",
				years: [2025, 2026],
				usersReached: 0,
			},
		],
	},
];
