import {
	act,
	fireEvent,
	render,
	screen,
	waitFor,
	within,
} from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { INNER_TEXT_LINKS } from "@/lib/site-links";
import { SURFACE_THEMES } from "../bar-themes";
import { BarHost } from "./bar-host";

const usePathname = vi.hoisted(() => vi.fn(() => "/blog"));
vi.mock("next/navigation", () => ({
	usePathname,
	useRouter: () => ({ push: () => {} }),
}));

function renderHost() {
	return render(
		<BarHost links={INNER_TEXT_LINKS} showContact>
			{(bar) => (
				<div data-testid="shell">{bar(SURFACE_THEMES["first-light"])}</div>
			)}
		</BarHost>,
	);
}

const dialog = () => screen.getByRole("dialog", { name: "Navigation menu" });
const queryDialog = () =>
	screen.queryByRole("dialog", { name: "Navigation menu" });

function mockToggleRect(top: number, left = 340) {
	const toggle = screen.getByRole("button", { name: "Open menu" });
	vi.spyOn(toggle, "getBoundingClientRect").mockReturnValue({
		top,
		left,
		right: left + 38,
		bottom: top + 38,
		width: 38,
		height: 38,
		x: left,
		y: top,
		toJSON: () => ({}),
	} as DOMRect);
	return toggle;
}

describe("BarHost", () => {
	it("opens the menu immediately and never moves the page bar", () => {
		renderHost();
		const shell = screen.getByTestId("shell");
		const frame = shell.firstElementChild;
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		expect(dialog()).toBeDefined();
		expect(shell.firstElementChild).toBe(frame);
		expect(shell.querySelector(".fixed")).toBeNull();
	});

	it("blooms from the toggle's measured center, both axes", () => {
		renderHost();
		mockToggleRect(150, 340);
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		expect(dialog().style.clipPath).toContain("359px 169px");
	});

	it("carries its own header: logo home link and a working close button", async () => {
		renderHost();
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		const menu = within(dialog());
		expect(menu.getByRole("link", { name: "gustavo.is" })).toBeDefined();

		fireEvent.click(menu.getByRole("button", { name: "Close menu" }));
		await waitFor(() => expect(queryDialog()).toBeNull());
	});

	it("restores focus to the page toggle on close", async () => {
		renderHost();
		const toggle = screen.getByRole("button", { name: "Open menu" });
		toggle.focus();
		fireEvent.click(toggle);
		expect(dialog().contains(document.activeElement)).toBe(true);

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => expect(document.activeElement).toBe(toggle));
	});

	it("blocks touch scrolling while open, and only while open", async () => {
		renderHost();

		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		const touch = new Event("touchmove", { cancelable: true, bubbles: true });
		document.dispatchEvent(touch);
		expect(touch.defaultPrevented).toBe(true);
		// No overflow lock: it would re-root the scroll container and un-stick sticky bars.
		expect(document.body.style.overflow).toBe("");
		expect(document.documentElement.style.overflow).toBe("");

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => {
			const after = new Event("touchmove", {
				cancelable: true,
				bubbles: true,
			});
			document.dispatchEvent(after);
			expect(after.defaultPrevented).toBe(false);
		});
	});

	it("closes immediately when the menu opens at or above the md breakpoint", async () => {
		const orig = window.matchMedia;
		window.matchMedia = ((query: string) => {
			const mql = orig(query);
			if (query !== "(min-width: 768px)") return mql;
			return {
				...mql,
				matches: true,
				addEventListener: () => {},
				removeEventListener: () => {},
			} as unknown as MediaQueryList;
		}) as typeof window.matchMedia;

		try {
			renderHost();
			fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
			// The md:hidden overlay would be invisible; arrival closes it.
			expect(screen.getByRole("button", { name: "Open menu" })).toBeDefined();
			await waitFor(() => expect(queryDialog()).toBeNull());
		} finally {
			window.matchMedia = orig;
		}
	});

	it("keeps the gesture block through a navigation-triggered close", async () => {
		usePathname.mockReturnValue("/blog");
		const view = renderHost();
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		expect(dialog()).toBeDefined();

		usePathname.mockReturnValue("/");
		view.rerender(
			<BarHost links={INNER_TEXT_LINKS} showContact>
				{(bar) => (
					<div data-testid="shell">{bar(SURFACE_THEMES["first-light"])}</div>
				)}
			</BarHost>,
		);

		const during = new Event("touchmove", { cancelable: true, bubbles: true });
		document.dispatchEvent(during);
		expect(during.defaultPrevented).toBe(true);
		expect(screen.getByTestId("shell").hasAttribute("inert")).toBe(true);

		await waitFor(
			() => {
				const after = new Event("touchmove", {
					cancelable: true,
					bubbles: true,
				});
				document.dispatchEvent(after);
				expect(after.defaultPrevented).toBe(false);
			},
			{ timeout: 4000 },
		);
		expect(queryDialog()).toBeNull();
		expect(screen.getByTestId("shell").hasAttribute("inert")).toBe(false);
		usePathname.mockReturnValue("/blog");
	});

	it("inerts everything outside the menu while open and releases it after the exit", async () => {
		renderHost();
		const shell = screen.getByTestId("shell");
		expect(shell.hasAttribute("inert")).toBe(false);

		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		expect(shell.hasAttribute("inert")).toBe(true);
		expect(dialog().hasAttribute("inert")).toBe(false);

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => expect(queryDialog()).toBeNull(), { timeout: 4000 });
		expect(shell.hasAttribute("inert")).toBe(false);
	});

	it("holds inert through the exit bloom", async () => {
		renderHost();
		const shell = screen.getByTestId("shell");
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));

		fireEvent.keyDown(document, { key: "Escape" });
		expect(queryDialog()).not.toBeNull();
		expect(shell.hasAttribute("inert")).toBe(true);
		await waitFor(() => expect(queryDialog()).toBeNull(), { timeout: 4000 });
	});

	it("keeps the hold across a reopen during the exit bloom, then releases", async () => {
		renderHost();
		const shell = screen.getByTestId("shell");
		const toggle = screen.getByRole("button", { name: "Open menu" });
		fireEvent.click(toggle);
		fireEvent.keyDown(document, { key: "Escape" });
		expect(queryDialog()).not.toBeNull();

		// jsdom ignores inert on the toggle, so the mid-exit reopen goes through.
		fireEvent.click(toggle);
		expect(dialog()).toBeDefined();
		expect(shell.hasAttribute("inert")).toBe(true);

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => expect(queryDialog()).toBeNull(), { timeout: 4000 });
		expect(shell.hasAttribute("inert")).toBe(false);
	});

	it("releases inert when the host unmounts while the menu is open", () => {
		const plain = document.createElement("div");
		document.body.append(plain);
		try {
			const view = renderHost();
			fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
			expect(plain.hasAttribute("inert")).toBe(true);
			view.unmount();
			expect(plain.hasAttribute("inert")).toBe(false);
		} finally {
			plain.remove();
		}
	});

	it("releases inert before restoring focus", async () => {
		renderHost();
		const shell = screen.getByTestId("shell");
		const toggle = screen.getByRole("button", { name: "Open menu" });
		toggle.focus();
		fireEvent.click(toggle);

		// jsdom focuses inert elements anyway; only the release order is testable.
		const inertAtRestore: boolean[] = [];
		vi.spyOn(toggle, "focus").mockImplementation(function (this: HTMLElement) {
			inertAtRestore.push(shell.hasAttribute("inert"));
			HTMLElement.prototype.focus.call(this);
		});

		fireEvent.keyDown(document, { key: "Escape" });
		await waitFor(() => expect(document.activeElement).toBe(toggle), {
			timeout: 4000,
		});
		expect(inertAtRestore).toEqual([false]);
	});

	it("never inerts Next's route announcer or scripts, only ordinary siblings", async () => {
		const announcer = document.createElement("next-route-announcer");
		const script = document.createElement("script");
		const plain = document.createElement("div");
		document.body.append(announcer, script, plain);

		try {
			renderHost();
			fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
			expect(announcer.hasAttribute("inert")).toBe(false);
			expect(script.hasAttribute("inert")).toBe(false);
			expect(plain.hasAttribute("inert")).toBe(true);

			fireEvent.keyDown(document, { key: "Escape" });
			await waitFor(() => expect(queryDialog()).toBeNull(), { timeout: 4000 });
			expect(plain.hasAttribute("inert")).toBe(false);
		} finally {
			announcer.remove();
			script.remove();
			plain.remove();
		}
	});

	it("holds the focus trap through the exit bloom", async () => {
		renderHost();
		fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
		const menu = within(dialog());
		const closeButton = menu.getByRole("button", { name: "Close menu" });
		closeButton.focus();

		fireEvent.keyDown(document, { key: "Escape" });
		const exiting = queryDialog();
		if (exiting) {
			fireEvent.keyDown(document, { key: "Tab" });
			expect(exiting.contains(document.activeElement)).toBe(true);
		}
		await waitFor(() => expect(queryDialog()).toBeNull(), { timeout: 4000 });
	});

	it("closes the menu when the viewport crosses the md breakpoint", async () => {
		const listeners: ((e: MediaQueryListEvent) => void)[] = [];
		const orig = window.matchMedia;
		window.matchMedia = ((query: string) => {
			const mql = orig(query);
			if (query !== "(min-width: 768px)") return mql;
			return {
				...mql,
				matches: false,
				addEventListener: (
					_type: string,
					fn: (e: MediaQueryListEvent) => void,
				) => listeners.push(fn),
				removeEventListener: () => {},
			} as unknown as MediaQueryList;
		}) as typeof window.matchMedia;

		try {
			renderHost();
			fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
			expect(dialog()).toBeDefined();
			expect(listeners.length).toBeGreaterThan(0);

			act(() => {
				for (const fn of listeners)
					fn({ matches: true } as MediaQueryListEvent);
			});
			await waitFor(() => expect(queryDialog()).toBeNull());
		} finally {
			window.matchMedia = orig;
		}
	});
});
