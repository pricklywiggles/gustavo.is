import { isIOSDevice } from "@/lib/ios-device";

/**
 * Catch-up seconds for scrubbed tweens on iOS devices. iOS reports scroll positions
 * sparsely and sometimes wrongly (the touchmove bug ScrollTrigger works around), so a
 * raw sample paints as a step where a short catch-up interpolates. Every other platform
 * keeps the raw sample (`scrub: true`), which is the baseline feel.
 */
export const IOS_SCRUB_S = 0.25;

/** The `scrub` for a scroll-driven tween on this device. */
export function scrollScrub(): true | number {
	return isIOSDevice() ? IOS_SCRUB_S : true;
}
