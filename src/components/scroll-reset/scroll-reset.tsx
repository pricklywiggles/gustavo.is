"use client";

import { useLayoutEffect } from "react";
import { consumeScrollReset } from "@/components/curtain-link";

/** Curtained arrivals only: the push bypasses Next's scrolling, back/forward the browser's. */
export function ScrollReset() {
	useLayoutEffect(() => {
		if (!consumeScrollReset(window.location.pathname)) return;
		// behavior instant: the page's smooth scrolling would animate this, and the swap cancels it.
		window.scrollTo({ top: 0, left: 0, behavior: "instant" });
	}, []);
	return null;
}
