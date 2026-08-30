import gsap from "gsap";
import { vi } from "vitest";

/**
 * Spies `gsap.timeline` so every timeline keeps its vars (its ScrollTrigger included) but
 * adds no tweens. A section's full build and its revert run thousands of jsdom style
 * writes (work history: 5s, the landfall scrubs: 0.4s alone and 7s under load); the
 * tests using this only read the captured vars.
 */
export function spyEmptyTimelines() {
	return vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
		const tl = new gsap.core.Timeline(vars);
		for (const method of ["to", "from", "fromTo", "set"] as const) {
			tl[method] = () => tl;
		}
		return tl;
	});
}
