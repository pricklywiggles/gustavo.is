import { describe, expect, it } from "vitest";
import { employmentHistory } from "@/lib/career";
import {
	CHAPTERS,
	carriedUsersBefore,
	cumulativeUsersAt,
	stintIndexAt,
} from "./work-history-data";

const seattle = CHAPTERS[0].stints;
const sanFrancisco = CHAPTERS[1].stints;
const losAngeles = CHAPTERS[2].stints;

describe("stintIndexAt", () => {
	it("opens every chapter on its first stint", () => {
		expect(stintIndexAt(seattle, 1998)).toBe(0);
		expect(stintIndexAt(seattle, 1900)).toBe(0);
	});

	it("switches exactly on a stint's first year", () => {
		// Six slide.com products, one per whole year after the photo app's two.
		expect(sanFrancisco[1].product).toBe("Top Friends");
		expect(sanFrancisco[2].product).toBe("SuperPoke");
		expect(stintIndexAt(sanFrancisco, 2007.99)).toBe(1);
		expect(stintIndexAt(sanFrancisco, 2008)).toBe(2);
	});

	it("holds the previous stint across a gap between jobs", () => {
		// Nothing in the data covers 2017-2018; the bar keeps UP 3 through
		// San Francisco's tail. Jawbone Health then opens Los Angeles.
		expect(sanFrancisco[9].product).toBe("UP 3");
		expect(stintIndexAt(sanFrancisco, 2017.5)).toBe(9);
		expect(stintIndexAt(sanFrancisco, 2018)).toBe(9);
		expect(losAngeles[0].product).toBe("Jawbone Health");
		expect(stintIndexAt(losAngeles, 2018)).toBe(0);
	});
});

describe("cumulativeUsersAt", () => {
	it("starts a chapter at zero and completes a figure at its window end", () => {
		expect(cumulativeUsersAt(seattle, 1998)).toBe(0);
		// Word's 75M accrues over 1998-1999 only, because Office carries its
		// own figure and therefore closes Word's window.
		expect(cumulativeUsersAt(seattle, 1999)).toBe(75_000_000);
	});

	it("spreads a company-wide figure across the stints that share it", () => {
		// Office's 125M covers Office through VSTO (no later Microsoft stint
		// has a figure), so 2001 sits 2 years into that 6-year window.
		expect(cumulativeUsersAt(seattle, 2001)).toBe(117_000_000);
		expect(cumulativeUsersAt(seattle, 2005)).toBe(200_000_000);
	});

	it("runs slide.com's single figure through its whole 2005-2012 tenure", () => {
		expect(cumulativeUsersAt(sanFrancisco, 2008.5)).toBe(10_000_000);
		expect(cumulativeUsersAt(sanFrancisco, 2012)).toBe(20_000_000);
	});

	it("keeps small totals exact instead of quantizing them", () => {
		// Both Meaning stints close by 2021: three users each, delivered in
		// full and never rounded away.
		expect(cumulativeUsersAt(losAngeles, 2021)).toBe(6);
	});

	it("quantizes large totals to three significant figures", () => {
		const midYear = cumulativeUsersAt(seattle, 2001.37);
		expect(midYear % 1_000_000).toBe(0);
	});
});

describe("carriedUsersBefore", () => {
	it("carries each chapter's final total into the next", () => {
		expect(carriedUsersBefore(CHAPTERS, 0)).toBe(0);
		// Seattle's 200M opens San Francisco.
		expect(carriedUsersBefore(CHAPTERS, 1)).toBe(200_000_000);
		// Plus SF's 20M slide.com run and 3M of Jawbone devices opens LA.
		expect(carriedUsersBefore(CHAPTERS, 2)).toBe(223_000_000);
	});
});

describe("CHAPTERS invariants", () => {
	it("joins adjacent chapter spans with no gap or overlap", () => {
		for (let i = 0; i < CHAPTERS.length - 1; i++) {
			expect(CHAPTERS[i].span[1]).toBe(CHAPTERS[i + 1].span[0]);
		}
	});

	it("keeps every stint forward-running and inside its chapter's span", () => {
		// Containment only: gaps between stints (SF's 2017-2018 tail) are the
		// designed gap-hold semantics, so coverage is deliberately unasserted.
		for (const { span, stints } of CHAPTERS) {
			for (const stint of stints) {
				expect(stint.years[0]).toBeLessThan(stint.years[1]);
				expect(stint.years[0]).toBeGreaterThanOrEqual(span[0]);
				expect(stint.years[1]).toBeLessThanOrEqual(span[1]);
			}
		}
	});

	it("carries an intrinsic size with every company logo", () => {
		// The HUD's shrink-to-fit img reads its ratio from these before the file loads.
		for (const { stints } of CHAPTERS) {
			for (const { companyLogo } of stints) {
				if (!companyLogo) continue;
				expect(companyLogo.width).toBeGreaterThan(0);
				expect(companyLogo.height).toBeGreaterThan(0);
			}
		}
	});

	it("keeps stints sorted by start year", () => {
		// stintIndexAt scans backwards and silently misbehaves on unsorted data.
		for (const { stints } of CHAPTERS) {
			for (let i = 1; i < stints.length; i++) {
				expect(stints[i].years[0]).toBeGreaterThanOrEqual(
					stints[i - 1].years[0],
				);
			}
		}
	});
});

describe("slide.com years (FRA-190)", () => {
	it("gives each product a whole year after the photo app's two", () => {
		const slide = sanFrancisco
			.filter((stint) => stint.company === "slide.com")
			.map((stint) => [stint.product, stint.years]);
		expect(slide).toEqual([
			["Slide Photo Sharing App", [2005, 2007]],
			["Top Friends", [2007, 2008]],
			["SuperPoke", [2008, 2009]],
			["FunWall", [2009, 2010]],
			["SuperPoke Pets", [2010, 2011]],
			["Superpocus", [2011, 2012]],
		]);
	});

	it("merges into three dated roles for the JSON-LD", () => {
		const slide = employmentHistory(CHAPTERS).find(
			(employment) => employment.company === "slide.com",
		);
		expect(slide?.roles).toEqual([
			{ title: "Software Design Engineer in Test", start: 2005, end: 2007 },
			{ title: "Director of Quality Assurance", start: 2007, end: 2011 },
			{ title: "Product Manager", start: 2011, end: 2012 },
		]);
	});
});
