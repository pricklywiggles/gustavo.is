/** The ground a control sits on (DESIGN.md: The Ground Picks the Ring Rule). */
export type Tone = "dark" | "light";

/** Opaque blaze reads 6.41:1 on Dusk Ink and 3.20:1 on Dusk Earth (the old /50 tint: 2.63, 1.87);
 * Canyon Brown clears the 3:1 non-text floor on the light grounds. */
export const FOCUS_RING: Record<Tone, string> = {
	dark: "focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-horizon-blaze",
	light:
		"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-canyon-brown",
};

/** Outline for bare text and glyphs: a ring hugs the letters and needs a ground-matched offset. */
export const FOCUS_OUTLINE: Record<Tone, string> = {
	dark: "focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-horizon-blaze",
	light:
		"focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-canyon-brown",
};
