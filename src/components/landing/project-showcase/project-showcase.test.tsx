import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PROJECTS } from "../projects-data";
import { ProjectShowcase } from "./project-showcase";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: () => {} }),
}));

describe("ProjectShowcase", () => {
	it("marks the active project and stages its details", () => {
		const { getByRole } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={1} />,
		);
		const activeItem = getByRole("button", { name: "Sanum" });
		expect(activeItem.getAttribute("aria-current")).toBe("true");
		expect(getByRole("heading", { level: 3, name: "Sanum" })).toBeTruthy();
		const link = getByRole("link", { name: /visit project/i });
		expect(link.getAttribute("href")).toBe("https://sanum.app");
		expect(link.getAttribute("target")).toBe("_blank");
		expect(link.getAttribute("rel")).toContain("noopener");
	});

	it("renders Ponder with its retrospective chip and same-tab routes", () => {
		const { getAllByRole, getByRole } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={5} />,
		);
		expect(getByRole("heading", { level: 3, name: "Ponder" })).toBeTruthy();
		// Scoped to the live article: the measuring copies repeat the chip text.
		expect(
			within(getByRole("article")).getByText("retrospective"),
		).toBeTruthy();
		expect(getAllByRole("link").map((el) => el.getAttribute("href"))).toEqual([
			"/remembering/ponder",
			"/remembering/ponder-blogs",
		]);
		for (const link of getAllByRole("link")) {
			expect(link.getAttribute("target")).toBeNull();
		}
	});

	it("sizes the panel to the tallest project with invisible, inert copies", () => {
		const { container, getByRole } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={0} />,
		);
		const copies = Array.from(
			container.querySelectorAll("[data-project-measure]"),
		);
		expect(copies).toHaveLength(PROJECTS.length);
		for (const copy of copies) {
			expect(copy.getAttribute("aria-hidden")).toBe("true");
			expect(copy.hasAttribute("inert")).toBe(true);
			expect(copy.className).toContain("invisible");
			expect(copy.className).toContain("col-start-1 row-start-1");
			// The stack only applies below md; md+ keeps its min-h floor (FRA-189).
			expect(copy.className).toContain("md:hidden");
			expect(copy.querySelector("img, a, button, h3")).toBeNull();
		}
		for (const project of PROJECTS) {
			expect(
				copies.filter((copy) =>
					copy.textContent?.includes(project.description),
				),
			).toHaveLength(1);
		}
		const article = getByRole("article");
		expect(article.className).toContain("col-start-1 row-start-1");
		expect(article.parentElement?.className).toContain("grid");
		expect(article.parentElement?.className).toContain("items-start");
	});

	it("reports list selections through onSelect", () => {
		const onSelect = vi.fn();
		const { getByRole } = render(
			<ProjectShowcase
				projects={PROJECTS}
				activeIndex={0}
				onSelect={onSelect}
			/>,
		);
		getByRole("button", { name: "Niamos" }).click();
		expect(onSelect).toHaveBeenCalledWith(2);
	});
});
