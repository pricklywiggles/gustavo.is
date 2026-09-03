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

/** Tailwind's md as px: md: is rem-based, and the px value is the shipped behavior. */
export const BELOW_MD = "(max-width: 767px)";

/**
 * Server snapshot is false: branch DOM only where a first-frame mismatch is harmless.
 * Pass module-constant queries; the cache never evicts, so a per-render string leaks a list.
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
