import { render } from "@testing-library/react";
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
		const { getAllByRole, getByRole, getByText } = render(
			<ProjectShowcase projects={PROJECTS} activeIndex={5} />,
		);
		expect(getByRole("heading", { level: 3, name: "Ponder" })).toBeTruthy();
		expect(getByText("retrospective")).toBeTruthy();
		expect(getAllByRole("link").map((el) => el.getAttribute("href"))).toEqual([
			"/remembering/ponder",
			"/remembering/ponder-blogs",
		]);
		for (const link of getAllByRole("link")) {
			expect(link.getAttribute("target")).toBeNull();
		}
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
