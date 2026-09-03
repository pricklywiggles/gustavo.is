/**
 * backdrop-blur belongs only to translucent recipes: an opaque bar would pay continuous
 * compositing for nothing. `text` unions per `tone`, so no light labels on a light ring.
 */
export type BarTheme = {
	bar: string;
	hoverPill: string;
} & (
	| { tone: "dark"; text: "text-pale-dune" }
	| { tone: "light"; text: "text-dusk-ink" | "text-dusk-earth" }
);

export type Surface =
	| "first-light"
	| "pale-dune"
	| "dusk-ink"
	| "dusk-earth"
	| "day-sky";

// A light bar measured 1.06:1 over bright surfaces; dark gives 4.83:1 bar, 5.72:1 labels.
export const DARK_BAR: BarTheme = {
	bar: "border-dusk-earth/60 bg-dusk-earth/90 backdrop-blur-md",
	text: "text-pale-dune",
	hoverPill: "hover:bg-canyon-brown",
	tone: "dark",
};

/** The landing hero's zenith band; the blog's sticky bar wears it to stay in that palette. */
export const SKY_BAR: BarTheme = {
	bar: "border-sand-line/60 bg-pale-dune",
	text: "text-dusk-ink",
	hoverPill: "hover:bg-amber-mirage",
	tone: "light",
};

export const SURFACE_THEMES: Record<Surface, BarTheme> = {
	"first-light": {
		bar: "border-sand-line/60 bg-sand-haze/90 backdrop-blur-md",
		// Light bars carry the darkest earth (never ink-black): 6.4:1 here.
		text: "text-dusk-earth",
		hoverPill: "hover:bg-pale-dune",
		tone: "light",
	},
	"pale-dune": DARK_BAR,
	"dusk-ink": DARK_BAR,
	"dusk-earth": DARK_BAR,
	// The vista's daytime sky: a warm light bar would clash with the cool surface.
	"day-sky": {
		bar: "border-dusk-ink/40 bg-dusk-ink/80 backdrop-blur-md",
		text: "text-pale-dune",
		hoverPill: "hover:bg-dusk-earth",
		tone: "dark",
	},
};
