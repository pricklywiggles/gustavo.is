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
