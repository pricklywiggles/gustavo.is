import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SKY_CLOUDS } from "../landfall-vista";
import { CLOUD_SLOTS, DESCENT_PHASE, LandfallSection } from "./landfall";

// jsdom has no IntersectionObserver, so the vista's warm-up fallback would fire the real
// chunk import on every render and leak past environment teardown (flaky CI).
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
	it("sizes the descent scrub from the phase map", () => {
		// The motion-safe height class is a literal (Tailwind scans source); this pins
		// its arithmetic so a phase change tells you which class to update.
		expect((DESCENT_PHASE.total + 1) * 100).toBe(1075);
		const { container } = render(<LandfallSection />);
		expect(container.querySelector("[data-descent]")?.className).toContain(
			"motion-safe:h-[1075vh]",
		);
		// The overlap contract: fade + hold cover the 200vh pull-up over the
		// projects section's tail (stage release + showcase exit windows).
		expect(DESCENT_PHASE.len.fade + DESCENT_PHASE.len.hold).toBe(2);
		expect(container.querySelector("section")?.className).toContain(
			"-mt-[200vh]",
		);
	});

	it("keeps the descent stage decorative and the CTA semantic", () => {
		const { container, getByRole } = render(<LandfallSection />);
		// The whole stage is aria-hidden scenery.
		const stage = container.querySelector("[data-descent-stage]");
		expect(stage).not.toBeNull();
		expect(stage?.querySelectorAll("[data-star-layer]")).toHaveLength(3);
		expect(stage?.querySelectorAll("[data-cloud-slot]")).toHaveLength(
			CLOUD_SLOTS.length,
		);
		// The vista carries the CTA; the footer landmark lives in SiteFooter,
		// outside <main> (nesting it here would demote it to role generic).
		expect(
			getByRole("heading", {
				level: 2,
				name: "Let's build something together",
			}),
		).toBeTruthy();
		expect(container.querySelector("footer")).toBeNull();
	});

	it("keeps the cloud deck inside the clouds window with rising speeds", () => {
		// All slots share a fixed end at the settle boundary, so later starts must read
		// nearer (faster); the nominal check here uses a 2:1 viewport aspect.
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
		// Inside the descent so its scrub anchor spans both reduced screens; a sibling
		// anchor sorted after the tucked vista and hijacked flips. Reduced motion lets
		// the descent size to its content, with the stage in flow.
		expect(still?.getAttribute("data-motion-anchor")).toBeNull();
		expect(descent?.className).toContain("h-auto");
		expect(descent?.className).toContain("motion-safe:h-[1075vh]");
		// relative, never static: static drops the stage as containing block and the
		// station, earth and clouds resolve against the two-screen descent, unclipped.
		expect(stage?.className).toContain("motion-reduce:relative");
		expect(descent?.nextElementSibling?.getAttribute("data-surface")).toBe(
			"day-sky",
		);
		// None of the scrub's targets may live inside it: the timeline's selectors span
		// the whole section.
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
		// A bare utility in mobileBox would silently reposition a DESKTOP
		// cloud: the whole point of the field is below-sm-only tuning.
		for (const cloud of SKY_CLOUDS) {
			for (const token of cloud.mobileBox.split(/\s+/).filter(Boolean)) {
				expect(token, `${cloud.src}: ${token}`).toMatch(/^max-sm:/);
			}
		}
	});
});
