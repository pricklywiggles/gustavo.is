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
