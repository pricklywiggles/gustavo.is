"use client";

import { useMediaQuery } from "@/components/use-media-query";

/** Tailwind's sm breakpoint. */
export const BELOW_SM = "(width < 40rem)";

// Server snapshot is desktop: a phone paints the sm-and-up branch for one frame, below the fold.
export function useBelowSm(): boolean {
	return useMediaQuery(BELOW_SM);
}
