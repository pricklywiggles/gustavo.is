"use client";

import { useMediaQuery } from "@/components/use-media-query";

const QUERY = "(prefers-reduced-motion: reduce)";

/** motion/react's useReducedMotion is a mount-time snapshot that diverges on a reduced client. */
export function useReducedMotionLive(): boolean {
	return useMediaQuery(QUERY);
}
