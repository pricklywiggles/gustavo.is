import gsap from "gsap";
import { vi } from "vitest";

/**
 * Keeps each timeline's vars (its ScrollTrigger included) but drops its tweens: a real
 * section build plus revert is thousands of jsdom style writes (work history: 5s).
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
