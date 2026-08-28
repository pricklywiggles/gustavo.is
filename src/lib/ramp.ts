/**
 * The palette for places CSS custom properties can't reach; design-tokens.test.ts keeps
 * RAMP_OKLCH in verbatim sync with globals.css and verifies each RAMP_HEX projection.
 */

/** oklch() components per token, verbatim from globals.css. */
export const RAMP_OKLCH = {
	"first-light": "0.9912 0.0069 88.64",
	"sand-haze": "0.9567 0.0333 88.06",
	"sand-line": "0.88 0.045 83",
	"pale-dune": "0.9338 0.065 89.92",
	"amber-mirage": "0.8381 0.0889 69.43",
	"horizon-blaze": "0.7537 0.1378 49.92",
	"noon-sun": "0.8803 0.1348 86.06",
	"dune-tan": "0.7891 0.0452 81.82",
	"desert-clay": "0.681 0.0587 75.53",
	"canyon-brown": "0.5665 0.0595 67.97",
	"dusk-earth": "0.4572 0.0543 59.52",
	"dusk-ink": "0.2781 0.0296 256.85",
	"warning-ember": "0.577 0.245 27.325",
	stratos: "0.36 0.09 258",
	"zenith-blue": "0.52 0.13 250",
	"day-sky": "0.8 0.075 235",
	"open-sea": "0.55 0.105 232",
	"deep-sea": "0.4 0.095 240",
} as const;

export type RampToken = keyof typeof RAMP_OKLCH;

/** The token as a CSS color string, e.g. rampColor("dusk-earth"). */
export function rampColor(token: RampToken): string {
	return `oklch(${RAMP_OKLCH[token]})`;
}

/** The token at an alpha, e.g. rampAlpha("pale-dune", "96%"). */
export function rampAlpha(token: RampToken, alpha: string): string {
	return `oklch(${RAMP_OKLCH[token]} / ${alpha})`;
}

/**
 * The token projected into sRGB, gamut-clamped (`"#6E5038"`). Warning Ember and the deep
 * cool steps fall outside sRGB, so those come back clipped and a P3 screen paints them
 * more saturated than the projection reads.
 */
export function rampHex(token: RampToken): string {
	const [L, C, Hdeg] = RAMP_OKLCH[token].split(" ").map(Number);
	const H = (Hdeg * Math.PI) / 180;
	const a = C * Math.cos(H);
	const b = C * Math.sin(H);
	const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const bytes = [
		4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
	].map((c) => {
		const v = c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055;
		return Math.round(Math.min(1, Math.max(0, v)) * 255);
	});
	return `#${bytes.map((n) => n.toString(16).padStart(2, "0")).join("")}`.toUpperCase();
}

/**
 * Exact sRGB projections of the tokens above (the hexes the set pieces shipped with);
 * GSAP color tweens interpolate hex, not oklch.
 */
export const RAMP_HEX = {
	"first-light": "#FEFCF7",
	"pale-dune": "#FAE8B8",
	"amber-mirage": "#F0C08A",
	"horizon-blaze": "#F4935A",
	"noon-sun": "#FFD166",
	"dune-tan": "#C9B89A",
	"desert-clay": "#AE9470",
	"canyon-brown": "#8E7050",
	"dusk-earth": "#6E5038",
	"dusk-ink": "#1F2937",
} as const satisfies Partial<Record<RampToken, string>>;
