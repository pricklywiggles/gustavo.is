/**
 * The site bar's themes in one table. `bar` classes are applied by HostedBar, never the
 * positioning shells; backdrop-blur belongs only to translucent recipes, since an opaque
 * bar must not pay continuous backdrop-filter compositing for an invisible effect.
 * `tone` is the bar's own ground and picks its focus ring; `text` is narrowed per ground
 * so a theme can't pair light labels with a light ring.
 */
export type BarTheme = {
	bar: string;
	hoverPill: string;
} & (
	| { tone: "dark"; text: "text-pale-dune" }
	| { tone: "light"; text: "text-dusk-ink" | "text-dusk-earth" }
);

/**
 * Themes for the return header floating over declared data-surface values; first-light
 * is the fallback. Add an entry when a new section introduces a new background.
 */
export type Surface =
	| "first-light"
	| "pale-dune"
	| "dusk-ink"
	| "dusk-earth"
	| "day-sky";

// Dark on purpose: a light bar measured 1.06:1 over bright surfaces and backdrop blur
// smeared the headline through it; Dusk Earth gives 4.83:1 bar and 5.72:1 labels.
export const DARK_BAR: BarTheme = {
	bar: "border-dusk-earth/60 bg-dusk-earth/90 backdrop-blur-md",
	text: "text-pale-dune",
	hoverPill: "hover:bg-canyon-brown",
	tone: "dark",
};

/**
 * The landing hero's zenith band as a solid bar; the blog's sticky bar wears it so the
 * page stays in the hero's palette.
 */
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
	// The vista's daytime sky: a warm light bar would clash with the cool
	// surface, so the bar goes dark and keeps the warm-ramp pill below it.
	"day-sky": {
		bar: "border-dusk-ink/40 bg-dusk-ink/80 backdrop-blur-md",
		text: "text-pale-dune",
		hoverPill: "hover:bg-dusk-earth",
		tone: "dark",
	},
};
