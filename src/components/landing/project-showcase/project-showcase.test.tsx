import { render, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { PROJECTS } from "../projects-data";
import { ProjectShowcase } from "./project-showcase";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: () => {} }),
}));

describe("ProjectShowcase", () => {
	it("marks the active project and stages its details", () => {
		const sanumIndex = PROJECTS.findIndex((p) => p.name === "Sanum");
		const { getByRole } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={sanumIndex} />,
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
		// Scoped to the live article: the hidden projects repeat the chip text.
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

	it("keeps every project mounted, the inactive ones hidden and out of flow from md", () => {
		const { container, getByRole } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={0} />,
		);
		const articles = Array.from(container.querySelectorAll("article"));
		expect(articles).toHaveLength(PROJECTS.length);
		const active = getByRole("article");
		expect(active.className).toContain("col-start-1 row-start-1");
		expect(active.className).not.toContain("md:absolute");
		expect(active.hasAttribute("inert")).toBe(false);
		for (const article of articles.filter((a) => a !== active)) {
			expect(article.getAttribute("aria-hidden")).toBe("true");
			expect(article.hasAttribute("inert")).toBe(true);
			expect(article.className).toContain("pointer-events-none");
			// Below md the stack sizes the cell to the tallest project (FRA-189); from md the
			// hidden ones leave the flow so the min-h floor sizes it instead.
			expect(article.className).toContain("col-start-1 row-start-1");
			expect(article.className).toContain("md:absolute");
		}
		for (const project of PROJECTS) {
			expect(
				articles.filter((a) => a.textContent?.includes(project.description)),
			).toHaveLength(1);
		}
		// A remounted img refetches; every screenshot stays mounted and loads as the section nears.
		const imgs = Array.from(container.querySelectorAll("img"));
		expect(imgs).toHaveLength(PROJECTS.filter((p) => p.image).length);
		for (const img of imgs) expect(img.getAttribute("loading")).toBe("lazy");
		expect(active.parentElement?.className).toContain("grid");
		expect(active.parentElement?.className).toContain("items-start");
		expect(active.parentElement?.className).toContain("overflow-x-clip");
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
