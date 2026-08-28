import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CHAPTERS, type CityChapter } from "../work-history-data";
import { CityLedger } from "./city-ledger";

const chapter = (id: CityChapter["id"]) => {
	const found = CHAPTERS.find((c) => c.id === id);
	if (!found) throw new Error(`no chapter ${id}`);
	return found;
};

const rowsOf = (container: HTMLElement) =>
	[...container.querySelectorAll("ol > li")].map((row) => ({
		company: row.querySelector("h3")?.textContent,
		roles: [...(row.querySelectorAll("ul")[0]?.children ?? [])].map(
			(li) => li.textContent,
		),
		products: [...(row.querySelectorAll("ul")[1]?.children ?? [])].map(
			(li) => li.textContent,
		),
		years: row.querySelector("p")?.textContent,
	}));

describe("CityLedger", () => {
	it("is a reduced-motion-only block headed by the city", () => {
		const { container, getByRole } = render(
			<CityLedger chapter={chapter("seattle")} />,
		);
		const root = container.firstElementChild;
		expect(root?.className).toContain("hidden");
		expect(root?.className).toContain("motion-reduce:block");
		expect(getByRole("heading", { level: 2, name: "Seattle" })).toBeTruthy();
		expect(root?.textContent).toContain("1998 to 2005");
	});

	it("collapses Seattle's stints into one employer with every title and product", () => {
		const { container } = render(<CityLedger chapter={chapter("seattle")} />);
		const [microsoft, ...rest] = rowsOf(container);
		expect(rest).toHaveLength(0);
		expect(microsoft.company).toBe("Microsoft");
		expect(microsoft.roles).toEqual([
			"Software Design Engineer",
			"Software Design Engineer in Test",
		]);
		expect(microsoft.products).toHaveLength(chapter("seattle").stints.length);
		expect(microsoft.products).toContain("Word");
		expect(microsoft.years).toContain("1998 to 2005");
	});

	it("keeps each city to its own employers", () => {
		const { container } = render(
			<CityLedger chapter={chapter("san-francisco")} />,
		);
		const companies = rowsOf(container).map((row) => row.company);
		expect(companies).toEqual(["slide.com", "Jawbone"]);
	});

	it("reads the current employer as present, city span included", () => {
		const { container } = render(
			<CityLedger chapter={chapter("los-angeles")} />,
		);
		const rows = rowsOf(container);
		expect(rows.map((row) => row.company)).toEqual([
			"Jawbone Health Hub",
			"Meaning",
			"Tartle",
		]);
		expect(rows.at(-1)?.years).toContain("to present");
		expect(container.querySelector("h2 + p")?.textContent).toBe(
			"2018 to present",
		);
	});
});
