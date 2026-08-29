import { render } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IOS_SCRUB_S } from "@/lib/scroll-scrub";
import { ParallaxHero } from "./hero";

const iosState = { value: false };
vi.mock("@/lib/ios-device", () => ({
	isIOSDevice: () => iosState.value,
}));

afterEach(() => {
	iosState.value = false;
	vi.restoreAllMocks();
});

// The setup stub answers every query false, which skips the motion-only GSAP path.
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

// Every scrub the hero builds: the parallax bands, the sun, the character, the hole.
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
		// Class literals, since Tailwind scans source: the reduced track is exactly the
		// sheet scrolling away (1vh) plus the revealed intro (1vh), and the sheet's
		// wrapper has no stick distance, so nothing sits still before it moves.
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
		// The server HTML carries the bunched-pose inline transforms (FRA-170); a band
		// without the override flashes bunched on a reduced client.
		const posed = container.querySelectorAll<HTMLElement>(
			'[data-motion-anchor="scrub"] [style*="transform:"]',
		);
		expect(posed.length).toBeGreaterThan(0);
		for (const el of posed) {
			expect(el.className).toContain("motion-reduce:transform-none!");
		}
	});

	// FRA-185: the raw sample is the baseline feel on desktop and Android; only iOS
	// devices get the catch-up that hides their sparse scroll reports.
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
