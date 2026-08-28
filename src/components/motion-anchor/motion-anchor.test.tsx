import { describe, expect, it } from "vitest";
import {
	compensatedScroll,
	resizeScroll,
	resolveAnchorIndex,
	scrubFraction,
	scrubScroll,
} from "./motion-anchor";

describe("resolveAnchorIndex", () => {
	const tops = [0, 1000, 3000, 8000];

	it("picks the last anchor at or above the scroll position", () => {
		expect(resolveAnchorIndex(tops, 500)).toBe(0);
		expect(resolveAnchorIndex(tops, 1000)).toBe(1);
		expect(resolveAnchorIndex(tops, 7999)).toBe(2);
		expect(resolveAnchorIndex(tops, 20000)).toBe(3);
	});

	it("ignores range overlap: only tops decide", () => {
		// The landfall pull-up makes the descent's range overlap the projects
		// section; the descent top still wins once scrolled past it.
		expect(resolveAnchorIndex([0, 5000, 4000 + 1000], 5200)).toBe(2);
	});

	it("returns null above the first anchor", () => {
		expect(resolveAnchorIndex([100, 900], 50)).toBeNull();
		expect(resolveAnchorIndex([], 50)).toBeNull();
	});
});

describe("compensatedScroll", () => {
	it("preserves the pixel offset inside a stable anchor", () => {
		expect(compensatedScroll(250, { top: 4000, height: 2000 }, 900)).toBe(4250);
		// Past height minus viewport is still a real position (content below
		// the anchor fills the frame): no clamp.
		expect(compensatedScroll(388, { top: 4000, height: 1146 }, 900)).toBe(4388);
	});

	it("clamps into a collapsed anchor's new extent", () => {
		// Deep in the motion descent (975vh of it gone): park at the static
		// frame, not 9000px past it into the vista.
		expect(compensatedScroll(9000, { top: 4000, height: 900 }, 900)).toBe(4000);
		expect(compensatedScroll(9000, { top: 4000, height: 1400 }, 900)).toBe(
			4500,
		);
	});

	it("floors negative offsets at the anchor top", () => {
		expect(compensatedScroll(-40, { top: 4000, height: 2000 }, 900)).toBe(4000);
	});
});

describe("scrubFraction", () => {
	it("measures normalized progress through the old scrollable extent", () => {
		// 29700px pin region (33 x 900vh-viewports) at top 4000: halfway
		// through its 28800px extent.
		expect(scrubFraction(4000 + 14400, { top: 4000, height: 29700 }, 900)).toBe(
			0.5,
		);
		expect(scrubFraction(4000, { top: 4000, height: 29700 }, 900)).toBe(0);
	});

	it("clamps at 0 above the anchor and 1 past its extent", () => {
		expect(scrubFraction(3000, { top: 4000, height: 29700 }, 900)).toBe(0);
		expect(scrubFraction(99999, { top: 4000, height: 29700 }, 900)).toBe(1);
	});

	it("floors the denominator at 1 for shorter-than-viewport anchors", () => {
		// height minus viewport is negative; without the floor this divides
		// by a negative and inverts the clamp.
		expect(scrubFraction(4000, { top: 4000, height: 500 }, 900)).toBe(0);
		expect(scrubFraction(4400, { top: 4000, height: 500 }, 900)).toBe(1);
	});
});

describe("scrubScroll", () => {
	it("restores the fraction against the new geometry", () => {
		// The same 33-viewport region after 900 to 700 viewport shrink.
		expect(scrubScroll(0.5, { top: 4000, height: 23100 }, 700)).toBe(
			4000 + 0.5 * 22400,
		);
		expect(scrubScroll(1, { top: 4000, height: 23100 }, 700)).toBe(26400);
	});

	it("floors at the new top when the region collapsed", () => {
		expect(scrubScroll(0.8, { top: 3000, height: 500 }, 900)).toBe(3000);
	});
});

describe("resizeScroll", () => {
	const next = { top: 4000, height: 23100 };

	it("scrub mode restores normalized progress, ignoring the offset", () => {
		expect(
			resizeScroll({ mode: "scrub", offset: 14400, fraction: 0.5 }, next, 700),
		).toBe(4000 + 0.5 * 22400);
	});

	it("flow mode preserves the pixel offset, ignoring the fraction", () => {
		expect(
			resizeScroll({ mode: "flow", offset: 250, fraction: 0.9 }, next, 700),
		).toBe(4250);
	});

	it("round-trips a scrub region across shrink and restore", () => {
		const before = { top: 4000, height: 29700 };
		const fraction = scrubFraction(4000 + 14400, before, 900);
		const shrunk = resizeScroll(
			{ mode: "scrub", offset: 14400, fraction },
			next,
			700,
		);
		const back = resizeScroll(
			{
				mode: "scrub",
				offset: shrunk - next.top,
				fraction: scrubFraction(shrunk, next, 700),
			},
			before,
			900,
		);
		expect(back).toBe(4000 + 14400);
	});
});
