import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactScene } from "./contact-scene";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("ContactScene", () => {
	it("names the section with an accessible heading", () => {
		render(<ContactScene />);
		// The name comes from AnimatedLines' sr-only text, not the aria-hidden split glyphs.
		const heading = screen.getByRole("heading", { name: "Say hello" });
		expect(heading.tagName).toBe("H1");
		expect(screen.getByRole("region", { name: "Say hello" })).toBeDefined();
	});

	it("declares its surface so the return header can theme against it", () => {
		const { container } = render(<ContactScene />);
		expect(container.querySelector("section")?.dataset.surface).toBe(
			"pale-dune",
		);
	});

	it("renders the contact form", () => {
		render(<ContactScene />);
		expect(screen.getByLabelText("Name")).toBeDefined();
		expect(screen.getByLabelText("Email")).toBeDefined();
		expect(screen.getByLabelText("Message")).toBeDefined();
		expect(screen.getByRole("button", { name: "Send" })).toBeDefined();
	});

	it("swaps the card to the sent confirmation on a successful send", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					new Response(JSON.stringify({ ok: true }), { status: 200 }),
				),
		);
		render(<ContactScene />);

		fireEvent.change(screen.getByLabelText("Name"), {
			target: { value: "Ada" },
		});
		fireEvent.change(screen.getByLabelText("Email"), {
			target: { value: "ada@example.com" },
		});
		fireEvent.change(screen.getByLabelText("Message"), {
			target: { value: "Hello" },
		});
		fireEvent.click(screen.getByRole("button", { name: "Send" }));

		expect(await screen.findByTestId("contact-success")).toBeDefined();
	});
});
