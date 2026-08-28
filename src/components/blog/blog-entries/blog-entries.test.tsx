import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlogEntries, type BlogEntry } from "./blog-entries";

vi.mock("next/navigation", () => ({
	usePathname: () => "/blog",
	useRouter: () => ({ push: () => {} }),
}));

const ENTRIES: BlogEntry[] = [
	{
		url: "/blog/first",
		title: "First post",
		description: "A description.",
		dateTime: "2026-07-16",
		dateLabel: "Jul 16, 2026",
	},
	{
		url: "/blog/second",
		title: "Second post",
		dateTime: "2026-08-01",
		dateLabel: "Aug 1, 2026",
	},
];

describe("BlogEntries", () => {
	it("renders every entry visible at rest (no JS-gated opacity)", () => {
		render(<BlogEntries entries={ENTRIES} />);
		for (const item of screen.getAllByRole("listitem")) {
			// The resting state is authored visible; an inline opacity would blank the list
			// for no-JS visitors and failed hydrations.
			expect(item.style.opacity).not.toBe("0");
		}
	});

	it("renders each title as a heading inside one whole-entry link", () => {
		render(<BlogEntries entries={ENTRIES} />);
		const links = screen.getAllByRole("link");
		expect(links.map((l) => l.getAttribute("href"))).toEqual([
			"/blog/first",
			"/blog/second",
		]);
		const heading = screen.getByRole("heading", {
			level: 2,
			name: "First post",
		});
		expect(links[0].contains(heading)).toBe(true);
		// Optional description stays optional.
		expect(links[1].querySelector("p")).toBeNull();
	});

	it("keeps dates as machine-readable time elements", () => {
		render(<BlogEntries entries={ENTRIES} />);
		const time = screen.getByText("Jul 16, 2026");
		expect(time.tagName).toBe("TIME");
		expect(time.getAttribute("datetime")).toBe("2026-07-16");
	});
});
