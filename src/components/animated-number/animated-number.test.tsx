import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AnimatedNumber } from "./animated-number";

describe("AnimatedNumber", () => {
	it("hides the library markup and carries the value as text", () => {
		render(
			<AnimatedNumber data-testid="year" format={{ useGrouping: false }}>
				{1998}
			</AnimatedNumber>,
		);
		const reels = screen.getByTestId("year");
		expect(reels.getAttribute("aria-hidden")).toBe("true");
		// The prohibited label lives on a role-less span the library renders; hidden, axe skips it.
		expect(reels.querySelector("[aria-label]")).not.toBeNull();
		const text = screen.getByText("1998");
		expect(text.className).toContain("sr-only");
		expect(reels.contains(text)).toBe(false);
	});

	it("formats the text copy the way the reels are formatted", () => {
		render(
			<AnimatedNumber prefix="$" suffix="k" locales="en-US">
				{1234}
			</AnimatedNumber>,
		);
		expect(screen.getByText("$1,234k").className).toContain("sr-only");
	});
});
