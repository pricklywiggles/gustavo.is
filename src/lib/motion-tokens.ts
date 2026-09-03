// GSAP eases stay strings at their call sites; only Motion curves live here.

/** The house entrance curve: fast arrival, long settle. */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

/** A disc cresting a horizon with a slight overshoot; callers add their own delay. */
export const SUN_CREST_SPRING = {
	type: "spring",
	bounce: 0.28,
	visualDuration: 0.6,
} as const;
