import localFont from "next/font/local";

// Production faces only; the dev font lab's candidates live in components/font-lab-faces.ts.

export const wotfard = localFont({
	src: [
		{ path: "../fonts/wotfard-thin.woff2", weight: "100", style: "normal" },
		{
			path: "../fonts/wotfard-extralight.woff2",
			weight: "200",
			style: "normal",
		},
		{ path: "../fonts/wotfard-light.woff2", weight: "300", style: "normal" },
		{ path: "../fonts/wotfard-regular.woff2", weight: "400", style: "normal" },
		{ path: "../fonts/wotfard-medium.woff2", weight: "500", style: "normal" },
		{ path: "../fonts/wotfard-semibold.woff2", weight: "600", style: "normal" },
		{ path: "../fonts/wotfard-bold.woff2", weight: "700", style: "normal" },
	],
	variable: "--font-wotfard",
	display: "swap",
	adjustFontFallback: "Arial",
});

// Latin-subset WOFF2 via fonttools (140KB OTF to 24KB); a real Bold cut, so weight 700.
export const kitora = localFont({
	src: "../fonts/Kitora-Bold.woff2",
	weight: "700",
	variable: "--font-kitora",
	display: "swap",
	adjustFontFallback: "Arial",
});

/** Goes on <html>. */
export const fontVariables = `${wotfard.variable} ${kitora.variable}`;
