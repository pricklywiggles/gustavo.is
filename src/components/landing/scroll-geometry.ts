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
