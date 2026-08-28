"use client";

import { useSyncExternalStore } from "react";

const subscribeNever = () => () => {};

/** False through SSR and hydration, true from the next render: gates client-only DOM. */
export function useMounted(): boolean {
	return useSyncExternalStore(
		subscribeNever,
		() => true,
		() => false,
	);
}
