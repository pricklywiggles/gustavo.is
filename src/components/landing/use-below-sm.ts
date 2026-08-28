"use client";

import { useMediaQuery } from "@/components/use-media-query";

/** Tailwind's sm breakpoint, as the media query the mobile HUD keys off. */
export const BELOW_SM = "(width < 40rem)";

// Server snapshot says desktop: a phone briefly mounts the sm-and-up branch on the
// first hydrated frame, corrected post-hydration (below the fold for every consumer).
export function useBelowSm(): boolean {
	return useMediaQuery(BELOW_SM);
}
