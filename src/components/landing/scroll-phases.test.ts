import { describe, expect, it } from "vitest";
import { resolvePhases } from "./scroll-phases";

describe("resolvePhases", () => {
	it("chains sequential phases and totals their span", () => {
		const map = resolvePhases([
			{ id: "a", len: 1 },
			{ id: "b", len: 0.5 },
			{ id: "c", len: 2 },
		]);
		expect(map.at).toEqual({ a: 0, b: 1, c: 1.5 });
		expect(map.total).toBe(3.5);
	});

	it("anchors overlapping phases without advancing the cursor past them", () => {
		const map = resolvePhases([
			{ id: "build", len: 2 },
			{ id: "exit", len: 0.5, with: "build" },
			{ id: "shift", len: 0.5, with: "build", offset: 1.8 },
			{ id: "tail", len: 0.4 },
		]);
		expect(map.at.exit).toBe(0);
		expect(map.at.shift).toBe(1.8);
		// The tail starts after the furthest end so far: shift's 2.3, not build's 2.0.
		expect(map.at.tail).toBeCloseTo(2.3);
		expect(map.total).toBeCloseTo(2.7);
	});

	it("rejects duplicate ids and unknown anchors", () => {
		expect(() =>
			resolvePhases([
				{ id: "a", len: 1 },
				{ id: "a", len: 1 },
			]),
		).toThrow(/duplicate/);
		expect(() => resolvePhases([{ id: "a", len: 1, with: "ghost" }])).toThrow(
			/unknown anchor/,
		);
	});
});
