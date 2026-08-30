/**
 * Landing scroll choreography in viewport-heights: the sheet pins for PIN_VH, the hole
 * scrubs from REVEAL_DELAY_VH over REVEAL_LENGTH_VH, and SHEET_VH keeps the trailing
 * edge out until the hole ends at REVEAL_COMPLETE_VH; the intro then holds for
 * TEXT_REVEAL_VH, which the headline scrub and body fade must both fit inside.
 */
export const PIN_VH = 1;
export const REVEAL_DELAY_VH = 1 / 3;
export const REVEAL_LENGTH_VH = 1;
export const SHEET_VH = 2.4;
export const WRAPPER_VH = PIN_VH + SHEET_VH;
export const REVEAL_COMPLETE_VH = PIN_VH + REVEAL_DELAY_VH + REVEAL_LENGTH_VH;
export const TEXT_REVEAL_VH = 1;
export const HEADLINE_REVEAL_VH = 0.5;
/** The sheet's travel between its release and the reveal's completion. */
export const REVEAL_TRAVEL_VH = REVEAL_DELAY_VH + REVEAL_LENGTH_VH;
/**
 * iOS only (FRA-185): the sticky carrier the sheet rides through the reveal. Sized so
 * its stick distance inside the wrapper is exactly REVEAL_COMPLETE_VH, and so its box
 * coincides with the sheet's remainder once the sheet has travelled REVEAL_TRAVEL_VH.
 */
export const CARRIER_VH = WRAPPER_VH - REVEAL_COMPLETE_VH;

/** Each hero band's travel in viewport-heights over the first viewport of scroll. */
export const HERO_PARALLAX = {
	sky1: 0.02,
	sky2: 0.05,
	sky3: 0.08,
	sun: 0.06,
	ground1: 0.15,
	ground2: 0.25,
	ground3: 0.35,
	ground4: 0.45,
	character: 0.35, // matches ground3 so character stands on that band
};

// Scroll progress at which the ground bands have collapsed to the horizon:
// (g4 top - horizon) / ground4 factor = 23.4 / 45, about 0.52.
export const CONVERGENCE_PROGRESS = 0.55;
/** From convergence, the sun swells and the character shrinks over this much scroll. */
export const CONVERGENCE_SPAN_VH = 0.9;
export const SUN_CONVERGENCE_SCALE = 1.3;
export const CHARACTER_SHRINK_SCALE = 0.1;
/** The sun's box is a square of this many vw or vh, whichever is smaller. */
export const HERO_SUN_SIZE = 38;

// The hole's growth (scale in vh) across the reveal, durations as fractions of it: a
// pinhole, a slow creep, then it swallows the screen.
export const HOLE_STAGES = [
	{ s: 0.1, duration: 0.06, ease: "power2.out" },
	{ s: 0.13, duration: 0.24, ease: "none" },
	{ s: 0.5, duration: 0.4, ease: "power1.in" },
	{ s: 2.6, duration: 0.3, ease: "power3.in" },
];
