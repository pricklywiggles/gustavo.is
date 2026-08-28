"use client";

import { useCallback, useSyncExternalStore } from "react";

// Module-cached so the render-path snapshot never re-allocates a list.
const lists = new Map<string, MediaQueryList>();
const listFor = (query: string) => {
	let mql = lists.get(query);
	if (!mql) {
		mql = window.matchMedia(query);
		lists.set(query, mql);
	}
	return mql;
};

/**
 * Below Tailwind's md breakpoint in the px form the stacked layouts have always keyed
 * off; md: itself is rem-based, and keeping the px value is the shipped behavior.
 */
export const BELOW_MD = "(max-width: 767px)";

/**
 * Hydration-safe live media-query state: the server snapshot is false, so branch DOM
 * only where the first-frame mismatch is harmless. Pass module-constant query strings:
 * the cache never evicts, so a per-render string pins one MediaQueryList per value.
 */
export function useMediaQuery(query: string): boolean {
	const subscribe = useCallback(
		(onChange: () => void) => {
			const mql = listFor(query);
			mql.addEventListener("change", onChange);
			return () => mql.removeEventListener("change", onChange);
		},
		[query],
	);
	return useSyncExternalStore(
		subscribe,
		() => listFor(query).matches,
		() => false,
	);
}
