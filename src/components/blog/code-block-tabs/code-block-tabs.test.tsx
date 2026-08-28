import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeBlock } from "../code-block";
import {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
} from "./code-block-tabs";

/** The exact shape remarkCodeTab emits for two tab="..." fences. */
function TwoTabs() {
	return (
		<CodeBlockTabs defaultValue="TypeScript">
			<CodeBlockTabsList>
				<CodeBlockTabsTrigger value="TypeScript">
					TypeScript
				</CodeBlockTabsTrigger>
				<CodeBlockTabsTrigger value="JavaScript">
					JavaScript
				</CodeBlockTabsTrigger>
			</CodeBlockTabsList>
			<CodeBlockTab value="TypeScript">
				<CodeBlock>
					<code>const lang: string = "ts";</code>
				</CodeBlock>
			</CodeBlockTab>
			<CodeBlockTab value="JavaScript">
				<CodeBlock>
					<code>const lang = "js";</code>
				</CodeBlock>
			</CodeBlockTab>
		</CodeBlockTabs>
	);
}

describe("CodeBlockTabs", () => {
	it("renders both triggers and opens on the default tab", () => {
		const { getAllByRole, getByRole } = render(<TwoTabs />);
		expect(getAllByRole("tab")).toHaveLength(2);
		expect(getByRole("tabpanel").textContent).toContain('"ts"');
	});

	it("keeps every tab's code in the DOM for the prerendered page", () => {
		const { container } = render(<TwoTabs />);
		expect(container.textContent).toContain('"ts"');
		expect(container.textContent).toContain('"js"');
	});

	it("switches panels on trigger click", () => {
		const { getByRole } = render(<TwoTabs />);
		fireEvent.click(getByRole("tab", { name: "JavaScript" }));
		expect(getByRole("tabpanel").textContent).toContain('"js"');
		expect(getByRole("tabpanel").textContent).not.toContain('"ts"');
	});

	it("renders the inner blocks frameless: the tabs frame owns the chrome", () => {
		const { container, getByRole } = render(<TwoTabs />);
		const inner = getByRole("tabpanel").querySelector("figure");
		expect(inner?.className).not.toContain("rounded-xl");
		const { container: standalone } = render(
			<CodeBlock>
				<code>alone</code>
			</CodeBlock>,
		);
		expect(standalone.querySelector("figure")?.className).toContain(
			"rounded-xl",
		);
		expect(container).toBeTruthy();
	});
});
