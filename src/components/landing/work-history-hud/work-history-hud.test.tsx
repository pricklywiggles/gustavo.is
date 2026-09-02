import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BELOW_SM } from "../use-below-sm";
import { CHAPTERS } from "../work-history-data";

// use-below-sm caches its MediaQueryList at first use, so each side of the
// breakpoint needs a fresh module graph with the stub already in place.
const renderHudAt = async (belowSm: boolean) => {
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
	return render(
		<WorkHistoryHud
			span={chapter.span}
			year={chapter.span[0]}
			stint={chapter.stints[0]}
			usersTotal={0}
		/>,
	).container;
};

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
		expect(product.querySelector("img")?.getAttribute("alt")).toBe(
			first.product,
		);
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

	it("pops both marks from the box center", async () => {
		const container = await renderHudAt(false);
		const marks = container.querySelectorAll<HTMLImageElement>(
			"[data-hud-product] img, [data-hud-bar] img",
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
		const mark = slot?.querySelector("img");
		expect(mark?.getAttribute("alt")).toBe(first.company);
		expect(Number(mark?.getAttribute("width"))).toBeGreaterThan(0);
		expect(Number(mark?.getAttribute("height"))).toBeGreaterThan(0);
		for (const cls of ["h-full", "w-auto", "max-w-full"]) {
			expect(mark?.className).toContain(cls);
		}
	});
});
