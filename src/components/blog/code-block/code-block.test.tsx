import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeBlock } from "./code-block";

function stubClipboard(writeText: (text: string) => Promise<void>) {
	Object.defineProperty(navigator, "clipboard", {
		value: { writeText },
		configurable: true,
	});
}

afterEach(() => {
	delete (navigator as { clipboard?: unknown }).clipboard;
});

describe("CodeBlock", () => {
	it("copies the code text and confirms transiently", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		stubClipboard(writeText);
		const { getByRole } = render(
			<CodeBlock>
				<code>const verified = true;</code>
			</CodeBlock>,
		);

		fireEvent.click(getByRole("button", { name: "Copy code" }));
		await waitFor(() => {
			expect(getByRole("button", { name: "Copied" })).toBeTruthy();
		});
		expect(writeText).toHaveBeenCalledWith("const verified = true;");
	});

	it("stays in the resting state when the clipboard is unavailable", async () => {
		const writeText = vi.fn().mockRejectedValue(new Error("denied"));
		stubClipboard(writeText);
		const { getByRole, queryByRole } = render(
			<CodeBlock>
				<code>text</code>
			</CodeBlock>,
		);

		fireEvent.click(getByRole("button", { name: "Copy code" }));
		await waitFor(() => {
			expect(writeText).toHaveBeenCalled();
		});
		expect(queryByRole("button", { name: "Copied" })).toBeNull();
		expect(getByRole("button", { name: "Copy code" })).toBeTruthy();
	});

	it("hides the copy button when the fence carries noCopy", () => {
		const { queryByRole } = render(
			<CodeBlock allowCopy="false">
				<code>secret setup</code>
			</CodeBlock>,
		);
		expect(queryByRole("button")).toBeNull();
	});

	it("renders the title strip only when a title meta arrives", () => {
		const { getByText, rerender, container } = render(
			<CodeBlock title="verify.ts">
				<code>code</code>
			</CodeBlock>,
		);
		expect(getByText("verify.ts")).toBeTruthy();

		rerender(
			<CodeBlock>
				<code>code</code>
			</CodeBlock>,
		);
		expect(container.querySelector("figcaption")).toBeNull();
	});
});
