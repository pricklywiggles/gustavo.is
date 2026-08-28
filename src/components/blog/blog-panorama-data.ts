/**
 * The blog hero's LA panorama, template-matched from the owner's two reference mockups
 * (initial: full composition; settled: compressed upward). Positions are in vw; never
 * round or "tidy" them. Array order is z-order, back to front.
 */

import { RAMP_HEX } from "@/lib/ramp";

export type BlogPanoramaLayer = {
	src: string;
	/** Settled position, vw from the hero's top-left. */
	left: number;
	top: number;
	width: number;
	/** Entrance offset: the initial mockup's position minus the settled one. */
	dx: number;
	dy: number;
	/**
	 * Responsive candidates for large layers: native width plus the generated variants
	 * (scripts/generate-panorama-small-variants.mjs); small sprites omit this.
	 */
	srcWidths?: { native: number; variants: number[] };
};

/** Hero heights, vw: the initial full composition and the settled strip. */
export const BLOG_PANO_INITIAL_VW = 67.26;
export const BLOG_PANO_SETTLED_VW = 34.92;

/** The canvas sky, identical to the landing hero's zenith band. */
export const BLOG_PANO_SKY = RAMP_HEX["pale-dune"];

const DIR = "/los-angeles-panorama-small";

export const BLOG_PANO_LAYERS: BlogPanoramaLayer[] = [
	{
		src: `${DIR}/1-large-cloud.webp`,
		left: 0.2,
		top: 0.2,
		width: 45.54,
		dx: 0,
		dy: 7.44,
		srcWidths: { native: 1837, variants: [459, 919] },
	},
	{
		src: `${DIR}/2-cloud-right.webp`,
		left: 75.1,
		top: 3.77,
		width: 11.11,
		dx: -0.3,
		dy: 16.47,
	},
	{
		src: `${DIR}/3-far-hill.webp`,
		left: -0.4,
		top: 3.77,
		width: 100,
		dx: 0.4,
		dy: 13.29,
		srcWidths: { native: 4032, variants: [1008, 2016] },
	},
	{
		src: `${DIR}/3.2-cloud-left.webp`,
		left: 45.73,
		top: 11.01,
		width: 34.42,
		dx: 0,
		dy: 18.45,
		srcWidths: { native: 1389, variants: [347, 695] },
	},
	{
		src: `${DIR}/3.5-middle-hill.webp`,
		left: -0.79,
		top: 4.76,
		width: 100,
		dx: 0.4,
		dy: 16.07,
		srcWidths: { native: 4032, variants: [1008, 2016] },
	},
	{
		src: `${DIR}/4-near-hill.webp`,
		left: -0.4,
		top: 18.06,
		width: 110.91,
		dx: 0.4,
		dy: 19.35,
		srcWidths: { native: 4473, variants: [1118, 2237] },
	},
	{
		src: `${DIR}/4-hollywood-sign.webp`,
		left: 21.92,
		top: 23.12,
		width: 8.33,
		dx: 0.4,
		dy: 19.35,
	},
	{
		src: `${DIR}/4-observatory.webp`,
		left: 50.2,
		top: 18.45,
		width: 6.45,
		dx: 0.3,
		dy: 19.35,
	},
	{
		src: `${DIR}/5-building-6.webp`,
		left: 89.0,
		top: 10.12,
		width: 3.87,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/5-building-7.webp`,
		left: 78.67,
		top: 11.9,
		width: 4.66,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/5-building-8.webp`,
		left: 74.8,
		top: 9.42,
		width: 3.47,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/6-building-1.webp`,
		left: 78.08,
		top: 15.97,
		width: 4.86,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/6-building-2.webp`,
		left: 84.03,
		top: 15.18,
		width: 4.46,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/6-building-3.webp`,
		left: 76.39,
		top: 17.46,
		width: 4.46,
		dx: -1.79,
		dy: 22.52,
	},
	{
		src: `${DIR}/6-building-4.webp`,
		left: 71.03,
		top: 22.32,
		width: 3.67,
		dx: -1.69,
		dy: 22.52,
	},
	{
		src: `${DIR}/6-building-5.webp`,
		left: 65.87,
		top: 17.96,
		width: 4.27,
		dx: -1.69,
		dy: 22.52,
	},
	{
		src: `${DIR}/7-near-city.webp`,
		left: -0.1,
		top: 22.32,
		width: 100,
		dx: 0,
		dy: 23.21,
		srcWidths: { native: 4032, variants: [1008, 2016] },
	},
	{
		src: `${DIR}/8-haze.webp`,
		left: -0.4,
		top: 22.82,
		width: 100.69,
		dx: -0.1,
		dy: 27.88,
		srcWidths: { native: 4060, variants: [1015, 2030] },
	},
	{
		src: `${DIR}/9-street-view.webp`,
		left: -0.1,
		top: 1.59,
		width: 100,
		dx: 0,
		dy: 32.04,
		srcWidths: { native: 4032, variants: [1008, 2016] },
	},
	// Authored to spec, not matched. Feet flush with the visible bottom (34.92 - 8.26);
	// same dy as street-view so it stays glued to the ground through the entrance.
	{
		src: `${DIR}/walking-kiwi.webp`,
		left: 35.14,
		top: 26.66,
		width: 9.73,
		dx: 0,
		dy: 32.04,
	},
];
