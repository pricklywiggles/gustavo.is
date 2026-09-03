"use client";

import { useEffect } from "react";
import { EVENTS, track } from "@/lib/analytics";

/** Plausible's 404 goal; path is what makes it a broken-link list. */
export function NotFoundBeacon() {
	useEffect(() => {
		track(EVENTS.notFound, { path: window.location.pathname });
	}, []);
	return null;
}
