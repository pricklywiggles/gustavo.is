/**
 * Lengths in viewport-heights. SHEET_VH keeps the sheet's trailing edge out until the hole ends
 * at REVEAL_COMPLETE_VH; the headline scrub and body fade must both fit inside TEXT_REVEAL_VH.
 */
export const PIN_VH = 1;
export const REVEAL_DELAY_VH = 1 / 3;
export const REVEAL_LENGTH_VH = 1;
export const SHEET_VH = 2.4;
export const WRAPPER_VH = PIN_VH + SHEET_VH;
export const REVEAL_COMPLETE_VH = PIN_VH + REVEAL_DELAY_VH + REVEAL_LENGTH_VH;
export const TEXT_REVEAL_VH = 1;
export const HEADLINE_REVEAL_VH = 0.5;
export const REVEAL_TRAVEL_VH = REVEAL_DELAY_VH + REVEAL_LENGTH_VH;
/**
 * iOS only (FRA-185): stick distance inside the wrapper is exactly REVEAL_COMPLETE_VH, and the
 * carrier's box coincides with the sheet's remainder after REVEAL_TRAVEL_VH of travel.
 */
export const CARRIER_VH = WRAPPER_VH - REVEAL_COMPLETE_VH;

/** Each hero band's travel over the first viewport of scroll. */
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

// Fraction of the first viewport at which the ground bands meet the horizon.
export const CONVERGENCE_PROGRESS = 0.55;
export const CONVERGENCE_SPAN_VH = 0.9;
export const SUN_CONVERGENCE_SCALE = 1.3;
export const CHARACTER_SHRINK_SCALE = 0.1;
/** The sun's box is a square of this many vw or vh, whichever is smaller. */
export const HERO_SUN_SIZE = 38;

// The hole's growth: `s` is scale in vh, `duration` a fraction of the reveal's length.
export const HOLE_STAGES = [
	{ s: 0.1, duration: 0.06, ease: "power2.out" },
	{ s: 0.13, duration: 0.24, ease: "none" },
	{ s: 0.5, duration: 0.4, ease: "power1.in" },
	{ s: 2.6, duration: 0.3, ease: "power3.in" },
];
