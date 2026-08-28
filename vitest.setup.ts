import { cleanup } from "@testing-library/react";
import { afterAll, afterEach } from "vitest";

// @testing-library/react 16.3.2 has no /vitest auto-cleanup entrypoint; register cleanup
// explicitly so DOM from one test doesn't leak into the next.
afterEach(() => {
	cleanup();
});

// ScrollTrigger registration starts a 250ms sync interval that can outlive jsdom and
// crash the run; stop it while jsdom still exists. isTouch is only assigned inside
// enable(), so it doubles as the did-anything-register probe (a blind disable() throws).
afterAll(async () => {
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	if (ScrollTrigger.isTouch !== undefined) ScrollTrigger.disable();
});

// jsdom lacks window.matchMedia and ScrollTrigger calls it at plugin-registration time
// (module load), so anything importing a scroll component throws without this.
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
