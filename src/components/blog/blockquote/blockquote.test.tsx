import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Blockquote } from "./blockquote";

describe("Blockquote", () => {
	it("leads with the default quote mark and keeps it out of the a11y tree", () => {
		const { container, getByText } = render(
			<Blockquote>
				<p>Quoted words.</p>
			</Blockquote>,
		);
		expect(getByText("Quoted words.")).toBeTruthy();
		const mark = container.querySelector("[aria-hidden='true']");
		expect(mark?.querySelector("svg")).toBeTruthy();
	});

	it("renders a custom icon instead of the default mark", () => {
		const { container, getByText } = render(
			<Blockquote icon="🎧">
				<p>Quoted words.</p>
			</Blockquote>,
		);
		expect(getByText("🎧")).toBeTruthy();
		expect(container.querySelector("svg")).toBeNull();
	});
});
