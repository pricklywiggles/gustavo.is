/** The ground a control sits on. Picks its focus ring (DESIGN.md: The Ground Picks the Ring Rule). */
export type Tone = "dark" | "light";

/** Opaque blaze reads 6.41:1 on Dusk Ink and 3.20:1 on Dusk Earth (the old /50 tint fell to 2.63
 * and 1.87); Canyon Brown clears the 3:1 non-text floor on Pale Dune, Sand Haze, and First Light. */
export const FOCUS_RING: Record<Tone, string> = {
	dark: "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-horizon-blaze",
	light:
		"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-canyon-brown",
};

/** Same colours for bare text and glyphs (footer links, menu links, tabs, the logo), where
 * a hugging ring crowds the letters. An outline steps 3px out without needing the ground colour. */
export const FOCUS_OUTLINE: Record<Tone, string> = {
	dark: "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-horizon-blaze",
	light:
		"focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-canyon-brown",
};
