import { describe, expect, it } from "vitest";
import type { CityChapter } from "@/components/landing/work-history-data";
import { employmentHistory } from "./career";

const chapter = (
	name: string,
	span: [number, number],
	stints: CityChapter["stints"],
): CityChapter => ({ id: "seattle", name, span, stints }) as CityChapter;

describe("employmentHistory", () => {
	it("collapses consecutive same-company stints, keeping per-title dates", () => {
		const history = employmentHistory([
			chapter(
				"Seattle",
				[2000, 2005],
				[
					{
						company: "Acme",
						role: "Engineer",
						product: "A",
						years: [2000, 2002],
					},
					{
						company: "Acme",
						role: "Engineer",
						product: "B",
						years: [2002, 2003.5],
					},
					{
						company: "Acme",
						role: "Lead",
						product: "C",
						years: [2003.5, 2005],
					},
				],
			),
			chapter(
				"Los Angeles",
				[2005, 2030],
				[
					{
						company: "Bolt",
						role: "CTO",
						product: "D",
						years: [2005.25, 2007],
					},
					{
						company: "Acme",
						role: "Advisor",
						product: "E",
						years: [2007, 2008],
					},
				],
			),
		]);
		expect(history).toEqual([
			{
				company: "Acme",
				city: "Seattle",
				roles: [
					{ title: "Engineer", start: 2000, end: 2004 },
					{ title: "Lead", start: 2003, end: 2005 },
				],
				products: ["A", "B", "C"],
				start: 2000,
				end: 2005,
			},
			{
				company: "Bolt",
				city: "Los Angeles",
				roles: [{ title: "CTO", start: 2005, end: 2007 }],
				products: ["D"],
				start: 2005,
				end: 2007,
			},
			{
				company: "Acme",
				city: "Los Angeles",
				roles: [{ title: "Advisor", start: 2007, end: 2008 }],
				products: ["E"],
				start: 2007,
				end: 2008,
			},
		]);
	});

	it("marks a stint reaching the last chapter's span end as ongoing", () => {
		const [job] = employmentHistory([
			chapter(
				"LA",
				[2020, 2026],
				[
					{ company: "Now", role: "Dev", product: "P", years: [2020, 2024] },
					{ company: "Now", role: "Lead", product: "Q", years: [2024, 2026] },
				],
			),
		]);
		expect(job.end).toBeNull();
		expect(job.roles).toEqual([
			{ title: "Dev", start: 2020, end: 2024 },
			{ title: "Lead", start: 2024, end: null },
		]);
	});

	it("reads the real chapters in order, Microsoft first, current job open", () => {
		const history = employmentHistory();
		expect(history[0].company).toBe("Microsoft");
		expect(history.at(-1)?.end).toBeNull();
		for (const job of history) {
			if (job.end !== null) expect(job.end).toBeGreaterThanOrEqual(job.start);
		}
		expect(history.map((e) => e.start)).toEqual(
			[...history.map((e) => e.start)].sort((a, b) => a - b),
		);
	});
});
