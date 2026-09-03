import { isIOSDevice } from "@/lib/ios-device";

/** iOS reports scroll sparsely, so a raw scrub steps; a short catch-up interpolates it. */
export const IOS_SCRUB_S = 0.25;

export function scrollScrub(): true | number {
	return isIOSDevice() ? IOS_SCRUB_S : true;
}
