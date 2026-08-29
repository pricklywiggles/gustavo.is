import { cleanup } from "@testing-library/react";
// Safe before the matchMedia polyfill below: ScrollTrigger only touches the window when a
// component registers it, never at import.
import { ScrollTrigger as StaticScrollTrigger } from "gsap/ScrollTrigger";
import { afterAll, afterEach } from "vitest";

// @testing-library/react 16.3.2 has no /vitest auto-cleanup entrypoint; register cleanup
// explicitly so DOM from one test doesn't leak into the next.
afterEach(() => {
	cleanup();
});

// ScrollTrigger registration starts a 250ms sync interval that can outlive jsdom and
// crash the run ("requestAnimationFrame is not defined"); stop it while jsdom still
// exists. isTouch is only assigned inside enable(), so it doubles as the
// did-anything-register probe (a blind disable() throws). Two instances can exist: the
// one the test file imported statically, and a fresh one after `vi.resetModules()`
// (src/test/hydrate-reduced.tsx re-imports the component, which registers again). The
// dynamic import resolves to whichever is current; the static one is held here.
afterAll(async () => {
	const { ScrollTrigger } = await import("gsap/ScrollTrigger");
	for (const instance of new Set([StaticScrollTrigger, ScrollTrigger])) {
		if (instance.isTouch !== undefined) instance.disable();
	}
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
