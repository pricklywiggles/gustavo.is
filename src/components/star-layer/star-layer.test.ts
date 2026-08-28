import { describe, expect, it } from "vitest";
import { starField, starRandom } from "./star-layer";

describe("starRandom", () => {
	it("is deterministic for a given seed", () => {
		const a = starRandom(42);
		const b = starRandom(42);
		expect([a(), a(), a()]).toEqual([b(), b(), b()]);
	});

	it("stays in [0, 1)", () => {
		const rand = starRandom(7);
		for (let i = 0; i < 1000; i++) {
			const v = rand();
			expect(v).toBeGreaterThanOrEqual(0);
			expect(v).toBeLessThan(1);
		}
	});
});

describe("starField", () => {
	it("renders the same scatter on every call (SSR must match hydration)", () => {
		expect(starField(23, 40, 0.5, 2)).toEqual(starField(23, 40, 0.5, 2));
	});

	it("respects count and bounds", () => {
		const stars = starField(11, 60, 0.5, 2);
		expect(stars).toHaveLength(60);
		for (const star of stars) {
			expect(star.x).toBeGreaterThanOrEqual(0);
			expect(star.x).toBeLessThan(100);
			expect(star.y).toBeGreaterThanOrEqual(0);
			expect(star.y).toBeLessThan(100);
			expect(star.r).toBeGreaterThanOrEqual(0.5);
			expect(star.r).toBeLessThanOrEqual(2);
			expect(star.opacity).toBeGreaterThan(0);
			expect(star.opacity).toBeLessThanOrEqual(1);
		}
	});
});
