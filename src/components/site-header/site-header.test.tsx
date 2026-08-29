import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DARK_BAR } from "@/components/bar-themes";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import { headerHeld, SiteHeader, surfaceFromStack } from "./site-header";

// The dialog arrives through next/dynamic; loading its chunk here keeps Vite's transform
// time (seconds on a loaded machine) out of the open assertions' windows.
beforeAll(async () => {
	await import("@/components/contact-dialog");
});

const usePathname = vi.hoisted(() => vi.fn(() => "/"));
vi.mock("next/navigation", () => ({
	usePathname,
	useRouter: () => ({ push: () => {} }),
}));

describe("SiteHeader", () => {
	it("renders the wordmark and all nav links", () => {
		render(<SiteHeader />);
		expect(screen.getByRole("link", { name: "gustavo.is" })).toBeDefined();
		for (const label of ["Blog", "LinkedIn", "Bluesky", "GitHub"]) {
			expect(screen.getByRole("link", { name: label })).toBeDefined();
		}
		// Contact triggers a dialog instead of navigating
		expect(screen.getByRole("button", { name: "Contact" })).toBeDefined();
	});

	it("opens the contact dialog from the mail button", async () => {
		render(<SiteHeader />);
		const trigger = screen.getByRole("button", { name: "Contact" });
		expect(trigger.getAttribute("aria-expanded")).toBe("false");

		fireEvent.click(trigger);
		expect(
			await screen.findByRole("dialog", { name: /say hello/i }),
		).toBeDefined();
		expect(screen.getByLabelText("Message")).toBeDefined();
		expect(trigger.getAttribute("aria-expanded")).toBe("true");
	});

	it("closes the contact dialog from Cancel", async () => {
		render(<SiteHeader />);
		const trigger = screen.getByRole("button", { name: "Contact" });

		fireEvent.click(trigger);
		await screen.findByRole("dialog", { name: /say hello/i });

		fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
		expect(trigger.getAttribute("aria-expanded")).toBe("false");
		await waitFor(() =>
			expect(screen.queryByRole("dialog", { name: /say hello/i })).toBeNull(),
		);
	});

	it("opens the mobile menu from the hamburger and closes on Escape", async () => {
		render(<SiteHeader />);
		const toggle = screen.getByRole("button", { name: "Open menu" });
		expect(toggle.getAttribute("aria-expanded")).toBe("false");

		// The menu covers the bar rather than moving it, so the same toggle
		// node persists across open and close.
		fireEvent.click(toggle);
		expect(toggle.getAttribute("aria-expanded")).toBe("true");
		expect(
			screen.getByRole("dialog", { name: "Navigation menu" }),
		).toBeDefined();

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() =>
			expect(toggle.getAttribute("aria-expanded")).toBe("false"),
		);
	});

	it("opens social links in a new tab without a referrer", () => {
		render(<SiteHeader />);
		for (const label of ["LinkedIn", "Bluesky", "GitHub"]) {
			const link = screen.getByRole("link", { name: label });
			expect(link.getAttribute("target")).toBe("_blank");
			expect(link.getAttribute("rel")).toBe("noreferrer");
		}
	});

	it("marks the active route with aria-current, including nested paths", () => {
		usePathname.mockReturnValue("/blog/some-post");
		render(<SiteHeader />);
		expect(
			screen.getByRole("link", { name: "Blog" }).getAttribute("aria-current"),
		).toBe("page");
		expect(
			screen
				.getByRole("link", { name: "LinkedIn" })
				.getAttribute("aria-current"),
		).toBeNull();
	});

	it("flips the riding bar to light labels when onDarkSurface is set", () => {
		usePathname.mockReturnValue("/no-such-page");
		render(<SiteHeader onDarkSurface />);
		expect(
			screen.getByRole("link", { name: "gustavo.is" }).className,
		).toContain("text-pale-dune");
	});

	it("gives the dark riding bar the return bar's Canyon Brown pill, with no bar behind it", () => {
		usePathname.mockReturnValue("/remembering/ponder");
		render(<SiteHeader />);
		const link = screen.getByRole("link", { name: "Blog" }).className;
		expect(link).toContain("text-pale-dune");
		expect(link).toContain(DARK_BAR.hoverPill);
		expect(link).not.toContain("hover:bg-dusk-earth");
		expect(document.querySelector(".bg-dusk-earth\\/90")).toBeNull();
	});

	it("picks the wordmark's focus ring from the bar's ground", () => {
		usePathname.mockReturnValue("/");
		const { unmount } = render(<SiteHeader />);
		const light = screen.getByRole("link", { name: "gustavo.is" }).className;
		expect(light).toContain(FOCUS_OUTLINE.light);
		expect(light).not.toContain(FOCUS_OUTLINE.dark);
		unmount();

		usePathname.mockReturnValue("/no-such-page");
		render(<SiteHeader onDarkSurface />);
		const dark = screen.getByRole("link", { name: "gustavo.is" }).className;
		expect(dark).toContain(FOCUS_OUTLINE.dark);
		expect(dark).not.toContain(FOCUS_OUTLINE.light);
	});
});

describe("surfaceFromStack", () => {
	function stackFrom(html: string, selectors: string[]) {
		document.body.innerHTML = html;
		return selectors.map((s) => {
			const el = document.querySelector(s);
			if (!el) throw new Error(`missing ${s}`);
			return el;
		});
	}

	it("returns the first declaring element from the top of the stack", () => {
		const stack = stackFrom(
			`<div data-surface="day-sky"><span id="a"></span></div>
			 <div data-surface="dusk-ink"><span id="b"></span></div>`,
			["#a", "#b"],
		);
		expect(surfaceFromStack(stack)).toBe("day-sky");
	});

	it("skips elements with no declaring ancestor (the fixed bar itself)", () => {
		const stack = stackFrom(
			`<header><span id="bar"></span></header>
			 <div data-surface="dusk-ink"><span id="b"></span></div>`,
			["#bar", "#b"],
		);
		expect(surfaceFromStack(stack)).toBe("dusk-ink");
	});

	it("stops at an unknown surface with the fallback, never adopting a deeper theme", () => {
		const stack = stackFrom(
			`<div data-surface="not-a-theme"><span id="a"></span></div>
			 <div data-surface="dusk-ink"><span id="b"></span></div>`,
			["#a", "#b"],
		);
		expect(surfaceFromStack(stack)).toBe("first-light");
	});

	it("falls back to first-light for an empty or undeclared stack", () => {
		expect(surfaceFromStack([])).toBe("first-light");
		const stack = stackFrom(`<main><span id="a"></span></main>`, ["#a"]);
		expect(surfaceFromStack(stack)).toBe("first-light");
	});
});

describe("headerHeld", () => {
	const rect = (top: number, bottom: number) => ({ top, bottom }) as DOMRect;

	it("holds while the section fills the viewport", () => {
		expect(headerHeld(rect(0, 900), 900, false)).toBe(true);
		expect(headerHeld(rect(1, 899), 900, false)).toBe(true);
	});

	it("releases once the section no longer covers the top edge or the bottom", () => {
		expect(headerHeld(rect(2, 900), 900, false)).toBe(false);
		expect(headerHeld(rect(0, 898), 900, false)).toBe(false);
		expect(headerHeld(undefined, 900, false)).toBe(false);
	});

	it("never holds under reduced motion, where no readout needs protecting", () => {
		expect(headerHeld(rect(0, 900), 900, true)).toBe(false);
	});
});
