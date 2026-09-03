import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { spyEmptyTimelines } from "@/test/empty-timelines";
import { CLOUD_SLOTS, DESCENT_PHASE } from "../landfall-geometry";
import { SKY_CLOUDS } from "../landfall-vista";
import { LandfallSection } from "./landfall";

// Covered in scroll-scrub.test.ts; a motion render of this section costs seconds.
const { SCRUB_SENTINEL } = vi.hoisted(() => ({ SCRUB_SENTINEL: 0.123 }));
vi.mock("@/lib/scroll-scrub", () => ({
	scrollScrub: () => SCRUB_SENTINEL,
}));

afterEach(() => {
	vi.restoreAllMocks();
});

const descentScrubs = () => {
	const original = window.matchMedia;
	window.matchMedia = ((query: string) => ({
		...original(query),
		matches: query === "(prefers-reduced-motion: no-preference)",
	})) as typeof window.matchMedia;
	const timeline = spyEmptyTimelines();
	try {
		const { unmount } = render(<LandfallSection />);
		unmount();
	} finally {
		window.matchMedia = original;
	}
	// The vista's headline reveal is a trigger-mode timeline with no scrub at all.
	const scrubs = timeline.mock.calls
		.map((call) => (call[0] as gsap.TimelineVars)?.scrollTrigger)
		.filter((trigger): trigger is ScrollTrigger.Vars =>
			Boolean(trigger && "scrub" in (trigger as object)),
		)
		.map((trigger) => trigger.scrub);
	timeline.mockRestore();
	return scrubs;
};

// jsdom has no IntersectionObserver: the warm-up fallback would import the real chunk and leak.
vi.mock("@/components/lazy-contact-dialog", async (importOriginal) => {
	const actual =
		await importOriginal<typeof import("@/components/lazy-contact-dialog")>();
	return {
		...actual,
		ContactDialog: () => null,
		warmContactDialog: () => {},
	};
});

describe("LandfallSection", () => {
	it("scrubs the descent and the vista through scrollScrub()", () => {
		expect(descentScrubs()).toEqual([SCRUB_SENTINEL, SCRUB_SENTINEL]);
	});

	it("sizes the descent scrub from the phase map", () => {
		// The height class is a literal (Tailwind scans source); this pins its arithmetic.
		expect((DESCENT_PHASE.total + 1) * 100).toBe(1150);
		const { container } = render(<LandfallSection />);
		expect(container.querySelector("[data-descent]")?.className).toContain(
			"motion-safe:h-[1150vh]",
		);
		// fade + hold cover the 200vh pull-up over the projects section's tail.
		expect(DESCENT_PHASE.len.fade + DESCENT_PHASE.len.hold).toBe(2);
		expect(container.querySelector("section")?.className).toContain(
			"-mt-[200vh]",
		);
	});

	it("keeps the descent stage decorative and the CTA semantic", () => {
		const { container, getByRole } = render(<LandfallSection />);
		const stage = container.querySelector("[data-descent-stage]");
		expect(stage).not.toBeNull();
		expect(stage?.querySelectorAll("[data-star-layer]")).toHaveLength(3);
		expect(stage?.querySelectorAll("[data-cloud-slot]")).toHaveLength(
			CLOUD_SLOTS.length,
		);
		// SiteFooter owns the footer landmark; nested in <main> it demotes to role generic.
		expect(
			getByRole("heading", {
				level: 2,
				name: "Let's build something together",
			}),
		).toBeTruthy();
		expect(container.querySelector("footer")).toBeNull();
	});

	it("keeps the cloud deck inside the clouds window with rising speeds", () => {
		// Slots share a fixed end at settle, so later starts read faster; *2 is a 2:1 viewport.
		const window = DESCENT_PHASE.at.settle - DESCENT_PHASE.at.clouds;
		let lastAt = -1;
		let lastSpeed = 0;
		for (const slot of CLOUD_SLOTS) {
			expect(slot.at).toBeGreaterThan(lastAt);
			expect(slot.at).toBeLessThan(window);
			const heightVh = Number.parseFloat(slot.width) * (slot.h / slot.w) * 2;
			const speed = (105 + heightVh) / (window - slot.at);
			expect(speed).toBeGreaterThan(lastSpeed);
			lastAt = slot.at;
			lastSpeed = speed;
		}
	});

	it("lays one atmosphere still after the stage, inside the descent, for reduced motion", () => {
		const { container } = render(<LandfallSection />);
		const descent = container.querySelector("[data-descent]");
		const stage = descent?.querySelector("[data-descent-stage]");
		const still = stage?.nextElementSibling;
		expect(still?.hasAttribute("data-descent-still")).toBe(true);
		expect(still?.className).toContain("hidden");
		expect(still?.className).toContain("motion-reduce:block");
		// A sibling scrub anchor sorted after the tucked vista and hijacked flips.
		expect(still?.getAttribute("data-motion-anchor")).toBeNull();
		expect(descent?.className).toContain("h-auto");
		expect(descent?.className).toContain("motion-safe:h-[1150vh]");
		// static drops the stage as containing block: station, earth and clouds go unclipped.
		expect(stage?.className).toContain("motion-reduce:relative");
		expect(descent?.nextElementSibling?.getAttribute("data-surface")).toBe(
			"day-sky",
		);
		// The timeline's selectors span the whole section, so no scrub target may live inside.
		expect(
			still?.querySelector(
				"[data-star-layer], [data-descent-station], [data-descent-earth], [data-descent-veil-entry], [data-descent-veil-day], [data-cloud-slot], [data-motion-anchor]",
			),
		).toBeNull();
	});

	it("gives the landfall dialog trigger its own morph target", () => {
		const { getByRole } = render(<LandfallSection />);
		expect(getByRole("button", { name: "Say hello" })).toBeTruthy();
	});

	it("keeps every vista cloud mobileBox gated to max-sm", () => {
		// A bare utility in mobileBox would silently reposition the desktop cloud too.
		for (const cloud of SKY_CLOUDS) {
			for (const token of cloud.mobileBox.split(/\s+/).filter(Boolean)) {
				expect(token, `${cloud.src}: ${token}`).toMatch(/^max-sm:/);
			}
		}
	});
});
