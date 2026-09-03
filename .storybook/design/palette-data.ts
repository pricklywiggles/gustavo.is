import type { RampToken } from "@/lib/ramp";

/** DESIGN.md's Colors subsections. */
export type TokenGroup = "core" | "neutral" | "mid" | "extended" | "cool";

export type PaletteEntry = {
	slug: RampToken;
	name: string;
	group: TokenGroup;
	/** The role name DESIGN.md gives the token, not a colour description. */
	label: string;
	role: string;
};

/** design-tokens.test.ts fails when this list and src/lib/ramp.ts disagree on tokens. */
export const PALETTE: PaletteEntry[] = [
	{
		slug: "dusk-earth",
		name: "Dusk Earth",
		group: "core",
		label: "Primary",
		role: "The deep warm-brown anchor. Primary buttons, dark section grounds, the darkest text allowed on a light surface, and the ground every page closes on before handing off to the footer.",
	},
	{
		slug: "pale-dune",
		name: "Pale Dune",
		group: "core",
		label: "Secondary",
		role: "The palest gold in the sky band. Secondary button fills, sunlit section backgrounds, body copy on dark ground, and the label colour on every dark bar.",
	},
	{
		slug: "amber-mirage",
		name: "Amber Mirage",
		group: "core",
		label: "Tertiary",
		role: "Warm peach-amber, the mid-sky tone. Hover fills, active nav states, the light-ground link swipe, and function names in code.",
	},

	{
		slug: "first-light",
		name: "First Light",
		group: "neutral",
		label: "Base surface",
		role: "The page background, and the type colour in code. A barely-there warm off-white, never a stark white.",
	},
	{
		slug: "sand-haze",
		name: "Sand Haze",
		group: "neutral",
		label: "Raised surface",
		role: "One step warmer than First Light. Cards and muted surfaces that separate from the page without a hard edge.",
	},
	{
		slug: "sand-line",
		name: "Sand Line",
		group: "neutral",
		label: "Stroke",
		role: "Borders, dividers, input strokes, and the default border colour every element inherits from the base layer.",
	},
	{
		slug: "dusk-ink",
		name: "Dusk Ink",
		group: "neutral",
		label: "Body text",
		role: "Body copy on light ground, the site's darkest surface (code blocks, inline chips, the 404 sky), and the one hue that leans cool. Deliberate: text should never fight the palette for attention.",
	},

	{
		slug: "dune-tan",
		name: "Dune Tan",
		group: "mid",
		label: "Mid ramp",
		role: "Prose bullets on dark ground (3.77:1, a glyph role, not text), the code block's header strip, a GroundStrata seam, and the hero's first ground band.",
	},
	{
		slug: "desert-clay",
		name: "Desert Clay",
		group: "mid",
		label: "Mid ramp",
		role: "Code comments, the code tab's hover fill, a GroundStrata seam, and the hero's second ground band.",
	},

	{
		slug: "horizon-blaze",
		name: "Horizon Blaze",
		group: "extended",
		label: "Focus and data",
		role: "The near-horizon orange: the dark-ground focus ring, code keywords, chart lines, rare accents. It cannot hold a ring on light warm ground, where even opaque it measures 1.89:1 on Pale Dune.",
	},
	{
		slug: "noon-sun",
		name: "Noon Sun",
		group: "extended",
		label: "Scene and dark-ground accent",
		role: "The hero's sun disc first. On the reading page it carries the whole dark-ground accent role: links, list counters, the h2 period, the horizon rule's dot, the play disc, and error text where Warning Ember cannot go.",
	},
	{
		slug: "canyon-brown",
		name: "Canyon Brown",
		group: "extended",
		label: "Ground band and light-ground ring",
		role: "The step above Dusk Earth. The focus ring on every light warm surface, the hover pill on dark bars, and the vista bluff's return to the warm ramp.",
	},
	{
		slug: "warning-ember",
		name: "Warning Ember",
		group: "extended",
		label: "Signal",
		role: "Errors and destructive actions on light ground. The one colour allowed off the warm family, because an error has to read as urgent rather than on-brand. On dark ground it reaches 1.54:1 and Noon Sun takes over.",
	},

	{
		slug: "stratos",
		name: "Stratos",
		group: "cool",
		label: "Upper air",
		role: "The first step out of Dusk Ink's space, where the descent picks up atmosphere.",
	},
	{
		slug: "zenith-blue",
		name: "Zenith Blue",
		group: "cool",
		label: "Zenith",
		role: "Daytime zenith in the landfall vista, directly overhead.",
	},
	{
		slug: "day-sky",
		name: "Day Sky",
		group: "cool",
		label: "Sky surface",
		role: "The vista's daytime sky. The only cool token that declares its own data-surface bar theme.",
	},
	{
		slug: "open-sea",
		name: "Open Sea",
		group: "cool",
		label: "Water",
		role: "The Pacific's lit water, nearer the horizon.",
	},
	{
		slug: "deep-sea",
		name: "Deep Sea",
		group: "cool",
		label: "Water",
		role: "The Pacific's deep water, farthest from the light.",
	},
];

/** Grounds the site actually paints text on, left to right palest first. */
export const CONTRAST_SURFACES = [
	"first-light",
	"sand-haze",
	"pale-dune",
	"dune-tan",
	"dusk-earth",
	"dusk-ink",
	"day-sky",
	"deep-sea",
] as const satisfies readonly RampToken[];

/** Tokens that carry text or a stroke on those grounds. */
export const CONTRAST_INKS = [
	"dusk-ink",
	"dusk-earth",
	"canyon-brown",
	"desert-clay",
	"first-light",
	"pale-dune",
	"sand-haze",
	"noon-sun",
	"horizon-blaze",
	"warning-ember",
] as const satisfies readonly RampToken[];
