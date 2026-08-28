import { fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FOCUS_RING } from "@/lib/focus-ring";
import { ContactForm } from "./contact-form";

afterEach(() => {
	vi.unstubAllGlobals();
});

describe("ContactForm", () => {
	it("shows validation errors and does not submit when required fields are empty", async () => {
		const fetchSpy = vi.fn();
		vi.stubGlobal("fetch", fetchSpy);
		render(<ContactForm tone="light" source="page" />);

		fireEvent.click(screen.getByRole("button", { name: "Send" }));

		expect(await screen.findByText("Name is required")).toBeDefined();
		expect(screen.getByText("Message is required")).toBeDefined();
		expect(fetchSpy).not.toHaveBeenCalled();
	});

	it("submits real data to /api/contact", async () => {
		const fetchSpy = vi
			.fn()
			.mockResolvedValue(
				new Response(JSON.stringify({ ok: true }), { status: 200 }),
			);
		vi.stubGlobal("fetch", fetchSpy);

		render(<ContactForm tone="light" source="page" />);

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
		expect(fetchSpy).toHaveBeenCalledWith(
			"/api/contact",
			expect.objectContaining({ method: "POST" }),
		);
	});

	it("notifies onSuccess once the message is delivered", async () => {
		vi.stubGlobal(
			"fetch",
			vi
				.fn()
				.mockResolvedValue(
					new Response(JSON.stringify({ ok: true }), { status: 200 }),
				),
		);
		const onSuccess = vi.fn();

		render(<ContactForm tone="light" source="page" onSuccess={onSuccess} />);

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
		expect(onSuccess).toHaveBeenCalledTimes(1);
	});

	it("keeps field ids unique and labels scoped when two forms mount", () => {
		const { container } = render(
			<>
				<ContactForm tone="light" source="page" />
				<ContactForm tone="dark" source="header" />
			</>,
		);

		const ids = Array.from(container.querySelectorAll("[id]"), (el) => el.id);
		expect(new Set(ids).size).toBe(ids.length);

		const forms = Array.from(container.querySelectorAll("form"));
		expect(forms).toHaveLength(2);
		for (const form of forms) {
			for (const labelText of [
				"Name",
				"Email",
				"Message",
				"Leave this field empty",
			]) {
				const field = within(form).getByLabelText(labelText);
				expect(form.contains(field)).toBe(true);
			}
			for (const name of ["name", "email", "message", "website"]) {
				expect(form.querySelectorAll(`[name="${name}"]`)).toHaveLength(1);
			}
		}
	});

	// Each field carries its ring by hand, so a forgotten one has no focus treatment at all.
	it.each([
		["light", FOCUS_RING.light, FOCUS_RING.dark],
		["dark", FOCUS_RING.dark, FOCUS_RING.light],
	] as const)("gives every control the %s-ground ring", (tone, ring, other) => {
		const { container } = render(
			<ContactForm tone={tone} source="header" onCancel={() => {}} />,
		);
		const form = container.querySelector("form") as HTMLFormElement;
		const controls = [
			...["Name", "Email", "Message"].map((label) =>
				within(form).getByLabelText(label),
			),
			within(form).getByRole("button", { name: /send/i }),
			within(form).getByRole("button", { name: /cancel/i }),
		];
		for (const control of controls) {
			expect(control.className).toContain(ring);
			expect(control.className).not.toContain(other);
		}
	});
});
