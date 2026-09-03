import gsap from "gsap";
import { vi } from "vitest";

export type TimelineCall = {
	method: "to" | "from" | "fromTo" | "set";
	args: unknown[];
};

/** Keeps each timeline's vars, drops its tweens: a real build plus revert costs seconds in jsdom. */
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
