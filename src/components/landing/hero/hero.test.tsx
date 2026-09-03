import { render } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IOS_SCRUB_S } from "@/lib/scroll-scrub";
import {
	CARRIER_VH,
	PIN_VH,
	REVEAL_COMPLETE_VH,
	REVEAL_DELAY_VH,
	REVEAL_LENGTH_VH,
	REVEAL_TRAVEL_VH,
	SHEET_VH,
	WRAPPER_VH,
} from "../scroll-geometry";
import { ParallaxHero } from "./hero";

const iosState = { value: false };
vi.mock("@/lib/ios-device", () => ({
	isIOSDevice: () => iosState.value,
}));

afterEach(() => {
	iosState.value = false;
	vi.restoreAllMocks();
});

const allowMotion = () => {
	const original = window.matchMedia;
	window.matchMedia = ((query: string) => ({
		...original(query),
		matches: query === "(prefers-reduced-motion: no-preference)",
	})) as typeof window.matchMedia;
	return () => {
		window.matchMedia = original;
	};
};

const heroScrubs = () => {
	const to = vi.spyOn(gsap, "to");
	const timeline = vi.spyOn(gsap, "timeline");
	const { unmount } = render(
		<ParallaxHero reveal={<div data-reveal>intro</div>} />,
	);
	const scrubs = [
		...to.mock.calls.map((call) => call[1] as gsap.TweenVars),
		...timeline.mock.calls.map((call) => call[0] as gsap.TimelineVars),
	]
		.filter((vars) => vars?.scrollTrigger)
		.map((vars) => (vars.scrollTrigger as ScrollTrigger.Vars).scrub);
	unmount();
	to.mockRestore();
	timeline.mockRestore();
	return scrubs;
};

describe("ParallaxHero", () => {
	it("collapses to a one-screen curtain over the intro under reduced motion", () => {
		const { container } = render(
			<ParallaxHero reveal={<div data-reveal>intro</div>} />,
		);
		// Class literals (Tailwind scans source); the reduced track is 1vh sheet + 1vh intro.
		const track = container.querySelector('[data-motion-anchor="scrub"]');
		expect(track?.className).toContain("h-[200vh]");
		expect(track?.className).toContain("motion-safe:h-(--hero-track)");
		const wrapper = track?.querySelector('[class*="hero-pin"]');
		expect(wrapper?.className).toContain("h-screen");
		expect(wrapper?.className).toContain("motion-safe:h-(--hero-pin)");
		expect(track?.querySelector("[data-reveal]")).not.toBeNull();
	});

	it("neutralizes every entrance transform from CSS for the reduced first paint", () => {
		const { container } = render(<ParallaxHero />);
		// FRA-170: without the override a band flashes its bunched server pose when reduced.
		const posed = container.querySelectorAll<HTMLElement>(
			'[data-motion-anchor="scrub"] [style*="transform:"]',
		);
		expect(posed.length).toBeGreaterThan(0);
		for (const el of posed) {
			expect(el.className).toContain("motion-reduce:transform-none!");
		}
	});

	const holeTimeline = () => {
		const timeline = vi.spyOn(gsap, "timeline");
		const { container, unmount } = render(
			<ParallaxHero reveal={<div data-reveal>intro</div>} />,
		);
		const sheet = container.querySelector<HTMLElement>('[class*="hero-sheet"]');
		if (!sheet?.parentElement) throw new Error("no sheet");
		const carrier = sheet.parentElement;
		const trigger = timeline.mock.calls
			.map((call) => (call[0] as gsap.TimelineVars)?.scrollTrigger)
			.find(Boolean) as ScrollTrigger.Vars;
		const range = {
			start: (trigger.start as () => string)(),
			end: (trigger.end as () => string)(),
		};
		timeline.mockRestore();
		return { sheet, carrier, range, unmount };
	};
	// jsdom's viewport height, which the hero reads as `metrics.vh`.
	const VH = 768;

	it("keeps the iOS carrier's geometry tied to the reveal", () => {
		// The carrier sticks for exactly the reveal; the travelled sheet's remainder is its box.
		expect(WRAPPER_VH - CARRIER_VH).toBeCloseTo(REVEAL_COMPLETE_VH, 10);
		expect(SHEET_VH - REVEAL_TRAVEL_VH).toBeCloseTo(CARRIER_VH, 10);
		expect(CARRIER_VH * 100).toBeCloseTo(106.667, 2);
	});

	it("leaves the native sticky sheet in place off iOS", () => {
		const restore = allowMotion();
		try {
			const { sheet, carrier, range, unmount } = holeTimeline();
			expect(carrier.className).toBe("contents");
			expect(carrier.style.position).toBe("");
			expect(sheet.className).toContain("sticky");
			expect(sheet.style.position).toBe("");
			expect(sheet.style.transform).toBe("");
			expect(range).toEqual({
				start: `top+=${(PIN_VH + REVEAL_DELAY_VH) * VH} top`,
				end: `+=${REVEAL_LENGTH_VH * VH}`,
			});
			unmount();
		} finally {
			restore();
		}
	});

	it("rides the sheet on a sticky carrier through the whole reveal on iOS", () => {
		const restore = allowMotion();
		iosState.value = true;
		try {
			const { sheet, carrier, range, unmount } = holeTimeline();
			expect(carrier.style.display).toBe("block");
			expect(carrier.style.position).toBe("sticky");
			expect(carrier.style.top).toBe("0px");
			expect(parseFloat(carrier.style.height)).toBeCloseTo(CARRIER_VH * 100, 6);
			expect(carrier.style.height.endsWith("vh")).toBe(true);
			expect(sheet.style.position).toBe("absolute");
			expect(range).toEqual({
				start: `top+=${PIN_VH * VH} top`,
				end: `+=${REVEAL_TRAVEL_VH * VH}`,
			});
			// The context revert leaves no carrier styles behind for a reduced flip.
			unmount();
			expect(carrier.style.position).toBe("");
			expect(carrier.style.display).toBe("");
			expect(sheet.style.position).toBe("");
		} finally {
			restore();
		}
	});

	// FRA-185: raw scroll is the baseline; iOS gets catch-up to hide its sparse scroll reports.
	it("scrubs by raw scroll everywhere but iOS", () => {
		const restore = allowMotion();
		try {
			const raw = heroScrubs();
			expect(raw.length).toBeGreaterThan(0);
			expect(new Set(raw)).toEqual(new Set([true]));
			iosState.value = true;
			const ios = heroScrubs();
			expect(ios).toHaveLength(raw.length);
			expect(new Set(ios)).toEqual(new Set([IOS_SCRUB_S]));
		} finally {
			restore();
		}
	});
});
