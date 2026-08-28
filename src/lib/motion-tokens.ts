/**
 * The shared Motion vocabulary (GSAP eases stay strings at their call
 * sites). Import these instead of re-typing the curves so the house feel
 * stays one definition.
 */

/** easeOutExpo, the house entrance curve: fast arrival, long settle. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/**
 * The sun-crest pop: a disc springs up over a horizon with a slight
 * overshoot. Callers add their own delay; the mobile menu's miniature
 * slows visualDuration.
 */
export const SUN_CREST_SPRING = {
	type: "spring",
	bounce: 0.28,
	visualDuration: 0.6,
} as const;
