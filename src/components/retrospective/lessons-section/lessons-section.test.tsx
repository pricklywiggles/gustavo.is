import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PONDER } from "../retrospective-data";
import { LessonsSection } from "./lessons-section";

function contentFor(button: HTMLElement) {
	const id = button.getAttribute("aria-controls");
	expect(id).toBeTruthy();
	return document.getElementById(id as string) as HTMLElement;
}

describe("LessonsSection", () => {
	it("keeps collapsed lesson bodies out of the accessibility tree", () => {
		const { getAllByRole } = render(
			<LessonsSection lessons={PONDER.lessons} />,
		);
		for (const button of getAllByRole("button")) {
			expect(button.getAttribute("aria-expanded")).toBe("false");
			const content = contentFor(button);
			expect(content.getAttribute("aria-hidden")).toBe("true");
			expect(content.hasAttribute("inert")).toBe(true);
		}
	});

	it("opens one drawer at a time and restores semantics on it", () => {
		const { getAllByRole } = render(
			<LessonsSection lessons={PONDER.lessons} />,
		);
		const buttons = getAllByRole("button");
		const first = buttons[0] as HTMLElement;
		const third = buttons[2] as HTMLElement;

		fireEvent.click(first);
		expect(first.getAttribute("aria-expanded")).toBe("true");
		expect(contentFor(first).getAttribute("aria-hidden")).toBeNull();
		expect(contentFor(first).hasAttribute("inert")).toBe(false);

		fireEvent.click(third);
		expect(third.getAttribute("aria-expanded")).toBe("true");
		expect(first.getAttribute("aria-expanded")).toBe("false");
		expect(contentFor(first).getAttribute("aria-hidden")).toBe("true");
	});
});
