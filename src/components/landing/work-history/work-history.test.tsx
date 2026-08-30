import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { spyEmptyTimelines } from "@/test/empty-timelines";
import { storyPhases } from "../story-phases";
import { CHAPTERS } from "../work-history-data";
import { WorkHistorySection } from "./work-history";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("WorkHistorySection", () => {
	// FRA-190: the pin is phase.total times the section's own h-screen box, the CSS
	// viewport its layers are sized in; innerHeight tracks iOS's toolbar instead.
	it("measures the pin against the section's box, never innerHeight", () => {
		const original = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			...original(query),
			matches: query === "(prefers-reduced-motion: no-preference)",
		})) as typeof window.matchMedia;
		const timeline = spyEmptyTimelines();
		try {
			const { container, unmount } = render(<WorkHistorySection />);
			const section = container.querySelector<HTMLElement>("section#work");
			if (!section) throw new Error("no section");
			let box = 1000;
			Object.defineProperty(section, "offsetHeight", {
				configurable: true,
				get: () => box,
			});
			const trigger = timeline.mock.calls
				.map(
					(call) =>
						(call[0] as gsap.TimelineVars | undefined)?.scrollTrigger as
							| ScrollTrigger.Vars
							| undefined,
				)
				.find((vars) => vars?.pin === true);
			const end = trigger?.end as () => string;
			const { total } = storyPhases(CHAPTERS);
			expect(end()).toBe(`+=${1000 * total}`);
			box = 800;
			expect(end()).toBe(`+=${800 * total}`);
			unmount();
		} finally {
			window.matchMedia = original;
		}
	});

	it("renders the equation terms and the rule, with no attribution", () => {
		const { container } = render(<WorkHistorySection />);
		const quote = container.querySelector("blockquote");
		// Terms weld their operator on with a non-breaking space, so compare on
		// normalized whitespace.
		const text = quote?.textContent?.replace(/\s+/g, " ");
		expect(text).toContain("Play +");
		// The equals is drawn from two hyphens (.kitora-equals): split chars carry "-",
		// the sr-only copy restoring the real "=" for assistive tech.
		expect(text).toContain("Purpose -");
		expect(text).toContain("Purpose =");
		expect(text).toContain("Work");
		expect(quote?.querySelector("[data-quote-rule]")).not.toBeNull();
		expect(container.querySelector("figcaption")).toBeNull();
	});

	// One gesture: both operands arrive together, and each later beat opens while the
	// previous is still resolving.
	it("starts both operands together, then overlaps the later beats", () => {
		const { at, len } = storyPhases(CHAPTERS);
		expect(at.line2).toBe(at.line1);
		const opensDuring = (beat: string, previous: string) => {
			expect(at[beat]).toBeGreaterThan(at[previous]);
			expect(at[beat]).toBeLessThan(at[previous] + len[previous]);
		};
		opensDuring("rule", "line1");
		opensDuring("line3", "rule");
	});

	it("renders every chapter's panorama layers in z-order", () => {
		const { container } = render(<WorkHistorySection />);
		const layers = container.querySelectorAll("[data-pano-layer]");
		// A layer is either the img itself or a wrapper animating an img.
		const srcOf = (el: Element) =>
			el.getAttribute("src") ?? el.querySelector("img")?.getAttribute("src");
		// Seattle 15 + San Francisco 21 + Los Angeles 18, scene order.
		expect(layers.length).toBe(54);
		expect(srcOf(layers[0])).toBe("/seattle-panorama/1-high-cloud-left.webp");
		// The ferry tops Seattle's stack, welded to the front strip's top edge.
		expect(srcOf(layers[14])).toBe("/seattle-panorama/10-ferry.webp");
		expect(srcOf(layers[15])).toBe("/san-francisco-panorama/1-clouds-far.webp");
		expect(srcOf(layers[36])).toBe("/los-angeles-panorama/1-large-cloud.webp");
	});

	it("renders one HUD per chapter, chapter 0 showing its first stint", () => {
		const { container } = render(<WorkHistorySection />);
		// Both marks name their subject: the logos carry the wordmarks, so alt
		// text is the only place the company and product are stated.
		expect(screen.getByAltText("Microsoft")).toBeDefined();
		expect(screen.getByAltText("Word")).toBeDefined();
		const role = container.querySelector("[data-hud-role]");
		expect(role?.textContent).toBe("Software Design Engineer");
		// Two counter homes per chapter: the bar slot (sm and up) and the
		// top-left phone instrument; CSS shows exactly one per breakpoint.
		expect(screen.getAllByText("Total users reached")).toHaveLength(6);
	});

	it("stacks a ledger after each scene and hides every HUD for reduced motion", () => {
		const { container } = render(<WorkHistorySection />);
		const section = container.querySelector("section#work");
		if (!section) throw new Error("no section");
		const children = [...section.children];
		const scenes = children.filter(
			(el) => el.getAttribute("aria-hidden") === "true",
		);
		const ledgers = children.filter((el) =>
			el.hasAttribute("data-city-ledger"),
		);
		const huds = children.filter((el) => el.querySelector("[data-hud-year]"));
		expect(scenes).toHaveLength(3);
		expect(ledgers).toHaveLength(3);
		expect(huds).toHaveLength(3);
		// Scene, ledger, scene, ledger: DOM order is the reduced reading order.
		for (const [i, ledger] of ledgers.entries()) {
			expect(ledger.previousElementSibling).toBe(scenes[i]);
			expect(ledger.className).toContain("hidden");
			expect(ledger.className).toContain("motion-reduce:block");
			// Text only: the scene's layer count and the HUD's alt-text queries stay true.
			expect(ledger.querySelector("img, [data-pano-layer]")).toBeNull();
		}
		for (const scene of scenes) {
			expect(scene.className).not.toContain("motion-reduce:hidden");
		}
		for (const hud of huds) {
			expect(hud.className).toContain("motion-reduce:hidden");
		}
		expect(
			screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
		).toEqual(CHAPTERS.map((chapter) => chapter.name));
	});

	it("keeps the #work anchor the intro's See my work link points at", () => {
		const { container } = render(<WorkHistorySection />);
		expect(container.querySelector("section#work")).not.toBeNull();
	});
});
