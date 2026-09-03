import { cleanup } from "@testing-library/react";
// Safe above the matchMedia polyfill: ScrollTrigger touches the window only at registration.
import { ScrollTrigger as StaticScrollTrigger } from "gsap/ScrollTrigger";
import { afterAll, afterEach } from "vitest";

// @testing-library/react 16.3.2 has no /vitest auto-cleanup entrypoint.
afterEach(() => {
	cleanup();
});

// ScrollTrigger's 250ms sync interval outlives jsdom and crashes the run; stop it early.
// isTouch is only set inside enable(), so it probes registration (a blind disable() throws).
// vi.resetModules() can leave two instances live: the static import and a fresh dynamic one.
afterAll(async () => {
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	for (const instance of new Set([StaticScrollTrigger, ScrollTrigger])) {
		if (instance.isTouch !== undefined) instance.disable();
	}
});

// ScrollTrigger calls matchMedia at module load; this stub answers false for every query.
if (typeof window !== "undefined" && !window.matchMedia) {
	window.matchMedia = (query: string) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	});
}
