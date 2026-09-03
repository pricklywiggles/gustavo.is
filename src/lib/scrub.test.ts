import { describe, expect, it } from "vitest";
import { scrubIndex, scrubJumpTarget } from "./scrub";

describe("scrubIndex", () => {
	it("walks every index across the range", () => {
		expect(scrubIndex(0, 6)).toBe(0);
		expect(scrubIndex(0.5, 6)).toBe(3);
		expect(scrubIndex(0.999, 6)).toBe(5);
	});

	it("clamps progress 1 to the last index", () => {
		expect(scrubIndex(1, 6)).toBe(5);
	});
});

describe("scrubJumpTarget", () => {
	it("lands mid-slice so the quantizer reads back the same index", () => {
		const range = { start: 1000, end: 8000 };
		for (let i = 0; i < 6; i++) {
			const top = scrubJumpTarget(range, i, 6);
			const progress = (top - range.start) / (range.end - range.start);
			expect(scrubIndex(progress, 6)).toBe(i);
		}
	});
});
