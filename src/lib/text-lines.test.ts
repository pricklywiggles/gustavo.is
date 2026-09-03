import { describe, expect, it } from "vitest";
import { groupIntoLines } from "./text-lines";

// jsdom has no layout, so these stand-ins carry the two fields the grouping reads.
function char(offsetTop: number, offsetHeight = 20): HTMLElement {
	return { offsetTop, offsetHeight } as unknown as HTMLElement;
}

describe("groupIntoLines", () => {
	it("groups characters sharing a top into one line", () => {
		const chars = [char(0), char(0), char(0)];
		expect(groupIntoLines(chars)).toHaveLength(1);
	});

	it("starts a new line when the top drops past the tolerance", () => {
		const chars = [char(0), char(0), char(24), char(24), char(48)];
		const lines = groupIntoLines(chars);
		expect(lines.map((line) => line.length)).toEqual([2, 2, 1]);
	});

	it("ignores sub-pixel drift within a line", () => {
		const chars = [char(0), char(0.3), char(0.6)];
		expect(groupIntoLines(chars)).toHaveLength(1);
	});

	it("preserves reading order within each line", () => {
		const a = char(0);
		const b = char(0);
		const c = char(30);
		const lines = groupIntoLines([a, b, c]);
		expect(lines[0]).toEqual([a, b]);
		expect(lines[1]).toEqual([c]);
	});

	it("returns an empty array for no characters", () => {
		expect(groupIntoLines([])).toEqual([]);
	});

	it("falls back to a fixed tolerance when heights are unmeasurable", () => {
		const chars = [char(0, 0), char(2, 0), char(10, 0)];
		expect(groupIntoLines(chars).map((line) => line.length)).toEqual([2, 1]);
	});
});
