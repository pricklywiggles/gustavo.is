"use client";

import { useLayoutEffect } from "react";
import { consumeScrollReset } from "@/components/curtain-link";

/**
 * Pre-paint scroll-to-top, but only for arrivals CurtainLink minted a token
 * for: the curtained push happens outside Next's usual scroll handling,
 * while back/forward must keep the browser's own restoration untouched.
 */
export function ScrollReset() {
	useLayoutEffect(() => {
		if (!consumeScrollReset(window.location.pathname)) return;
		// behavior instant: the page's smooth scrolling would turn this into
		// an animated scroll that the covered swap cancels.
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, []);
	return null;
}
