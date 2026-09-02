import gsap from "gsap";
import { vi } from "vitest";

export type TimelineCall = {
	method: "to" | "from" | "fromTo" | "set";
	args: unknown[];
};

/**
 * Keeps each timeline's vars (its ScrollTrigger included) but drops its tweens: a real
 * section build plus revert is thousands of jsdom style writes (work history: 5s).
 * Pass `record` to capture the dropped calls' targets and vars for assertions.
 */
export function spyEmptyTimelines(record?: TimelineCall[]) {
	return vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
		const tl = new gsap.core.Timeline(vars);
		for (const method of ["to", "from", "fromTo", "set"] as const) {
			tl[method] = (...args: unknown[]) => {
				record?.push({ method, args });
				return tl;
			};
		}
		return tl;
	});
}
