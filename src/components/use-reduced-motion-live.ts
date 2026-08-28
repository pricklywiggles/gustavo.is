"use client";

import { useMediaQuery } from "@/components/use-media-query";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * Hydration-safe AND live: motion/react's useReducedMotion is a mount-time snapshot
 * (no subscription) whose SSR false diverges from a reduced client's first render.
 * useMediaQuery renders the server snapshot through hydration, then stays subscribed.
 */
export function useReducedMotionLive(): boolean {
	return useMediaQuery(QUERY);
}
