import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ParallaxHero } from "./hero";

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
});
