import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BELOW_SM } from "../use-below-sm";
import { CHAPTERS, type Stint } from "../work-history-data";

// use-below-sm caches its MediaQueryList at first use, so each side needs a fresh module graph.
const mountHud = async (belowSm: boolean) => {
	vi.resetModules();
	vi.stubGlobal("matchMedia", (query: string) => ({
		matches: belowSm && query === BELOW_SM,
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	}));
	const { WorkHistoryHud } = await import("./work-history-hud");
	const chapter = CHAPTERS[0];
	const hud = (stint: Stint) => (
		<WorkHistoryHud
			span={chapter.span}
			stints={chapter.stints}
			year={chapter.span[0]}
			stint={stint}
			usersTotal={0}
		/>
	);
	const view = render(hud(chapter.stints[0]));
	return {
		container: view.container,
		show: (stint: Stint) => view.rerender(hud(stint)),
	};
};
const renderHudAt = async (belowSm: boolean) =>
	(await mountHud(belowSm)).container;

const odometers = (container: HTMLElement) => ({
	bar:
		(container.querySelector("[data-hud-bar] dl dd")?.childElementCount ?? 0) >
		0,
	mobile:
		(container.querySelector("[data-hud-counter] dd")?.childElementCount ?? 0) >
		0,
});

afterEach(() => vi.unstubAllGlobals());

describe("WorkHistoryHud counter homes", () => {
	it("mounts only the top-left odometer below sm, shells stay put", async () => {
		const container = await renderHudAt(true);
		expect(odometers(container)).toEqual({ bar: false, mobile: true });
		// Both shells exist regardless: they are stable GSAP targets.
		expect(container.querySelector("[data-hud-bar] dl")).not.toBeNull();
		expect(container.querySelector("[data-hud-counter]")).not.toBeNull();
	});

	it("mounts only the bar odometer at sm and up", async () => {
		const container = await renderHudAt(false);
		expect(odometers(container)).toEqual({ bar: true, mobile: false });
	});
});

// FRA-194: readers were not looking at the bar, so the product mark took the center.
describe("WorkHistoryHud marks", () => {
	const first = CHAPTERS[0].stints[0];

	it("centers the product mark outside the bar, after the year in reading order", async () => {
		const container = await renderHudAt(false);
		const product = container.querySelector("[data-hud-product]");
		if (!product) throw new Error("no product layer");
		expect(
			product
				.querySelector('img:not([aria-hidden="true"])')
				?.getAttribute("alt"),
		).toBe(first.product);
		expect(
			container.querySelectorAll(`img[alt="${first.product}"]`),
		).toHaveLength(1);
		expect(
			container.querySelector("[data-hud-bar] [data-hud-product]"),
		).toBeNull();
		expect(container.querySelector("[data-hud-divider]")).toBeNull();
		// The img alt is the product's accessible name under motion.
		expect(product.hasAttribute("aria-hidden")).toBe(false);
		const year = container.querySelector("[data-hud-year]");
		if (!year) throw new Error("no year");
		expect(
			year.compareDocumentPosition(product) & Node.DOCUMENT_POSITION_FOLLOWING,
		).toBeTruthy();
	});

	// A remounted img refetches its file and pops with no pixels (Gecko paints the alt
	// text in that gap), so every distinct mark stays mounted and only toggles.
	it("keeps every distinct mark mounted and swaps stints without remounting", async () => {
		const { container, show } = await mountHud(false);
		const stints = CHAPTERS[0].stints;
		const product = container.querySelector("[data-hud-product]");
		const slot = container.querySelector("[data-hud-bar] [data-hud-slot]");
		if (!product || !slot) throw new Error("no mark boxes");
		const distinct = (pick: (stint: Stint) => string) =>
			new Set(stints.map(pick)).size;
		expect(product.querySelectorAll("img, span")).toHaveLength(
			distinct((stint) => stint.productLogo ?? stint.product),
		);
		expect(slot.querySelectorAll("img, span")).toHaveLength(
			distinct((stint) => stint.companyLogo?.src ?? stint.company),
		);
		const activeMarks = (box: Element) =>
			box.querySelectorAll(
				'img:not([aria-hidden="true"]), span:not([aria-hidden="true"])',
			);
		const before = product.querySelector(`img[alt="${first.product}"]`);
		expect(before?.getAttribute("aria-hidden")).toBeNull();

		show(stints[1]);
		expect(stints[1].product).not.toBe(first.product);
		expect(product.querySelector(`img[alt="${first.product}"]`)).toBe(before);
		expect(before?.getAttribute("aria-hidden")).toBe("true");
		expect(activeMarks(product)).toHaveLength(1);
		expect(activeMarks(product)[0].getAttribute("alt")).toBe(stints[1].product);
		expect(activeMarks(slot)).toHaveLength(1);
		expect(activeMarks(slot)[0].getAttribute("alt")).toBe(stints[1].company);
	});

	it("frosts a plate in the band's surface color behind the product mark", async () => {
		const container = await renderHudAt(false);
		const mark = container.querySelector("[data-hud-product] img");
		const plate = mark?.closest(".backdrop-blur-md");
		if (!plate) throw new Error("no plate");
		expect(plate.closest("[data-hud-product]")).not.toBeNull();
		for (const cls of ["bg-pale-dune/60", "rounded-[2.5rem]", "ring-1"]) {
			expect(plate.classList.contains(cls)).toBe(true);
		}
	});

	it("pops both marks from the box center", async () => {
		const container = await renderHudAt(false);
		const marks = container.querySelectorAll<HTMLImageElement>(
			'[data-hud-product] img:not([aria-hidden="true"]), [data-hud-bar] img:not([aria-hidden="true"])',
		);
		expect(marks).toHaveLength(2);
		for (const mark of marks) {
			expect(mark.style.transformOrigin).toBe("");
			expect(mark.className).not.toMatch(/\bobject-(left|right)\b/);
		}
	});

	it("sizes the company mark from its intrinsic ratio inside the larger slot", async () => {
		const container = await renderHudAt(false);
		const slot = container.querySelector("[data-hud-bar] [data-hud-slot]");
		for (const cls of ["h-13.75", "w-40", "sm:w-50"]) {
			expect(slot?.className).toContain(cls);
		}
		const mark = slot?.querySelector('img:not([aria-hidden="true"])');
		expect(mark?.getAttribute("alt")).toBe(first.company);
		expect(Number(mark?.getAttribute("width"))).toBeGreaterThan(0);
		expect(Number(mark?.getAttribute("height"))).toBeGreaterThan(0);
		for (const cls of ["h-full", "w-auto", "max-w-full"]) {
			expect(mark?.className).toContain(cls);
		}
	});
});
