import { act, render } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IOS_SCRUB_S } from "@/lib/scroll-scrub";
import { OtherProjectsSection } from "./other-projects";

const iosState = { value: false };
vi.mock("@/lib/ios-device", () => ({
	isIOSDevice: () => iosState.value,
}));

afterEach(() => {
	iosState.value = false;
	vi.restoreAllMocks();
});

// A matchMedia whose reduced-motion answer can flip live, notifying its listeners.
const liveReducedMotion = () => {
	const original = window.matchMedia;
	const listeners = new Set<() => void>();
	const state = { reduced: false };
	window.matchMedia = ((query: string) => ({
		...original(query),
		get matches() {
			return state.reduced && query.includes("reduce");
		},
		addEventListener: (_type: string, listener: () => void) => {
			listeners.add(listener);
		},
		removeEventListener: (_type: string, listener: () => void) => {
			listeners.delete(listener);
		},
	})) as typeof window.matchMedia;
	return {
		flip(reduced: boolean) {
			state.reduced = reduced;
			act(() => {
				for (const listener of listeners) listener();
			});
		},
		restore() {
			window.matchMedia = original;
		},
	};
};

// The rail tweens live under width queries the setup stub answers false; match them
// both so each orientation's pair builds. jsdom has no 2d context either way.
const railScrubs = () => {
	const original = window.matchMedia;
	window.matchMedia = ((query: string) => ({
		...original(query),
		matches: /width/.test(query),
	})) as typeof window.matchMedia;
	const fromTo = vi.spyOn(gsap, "fromTo");
	try {
		const { unmount } = render(<OtherProjectsSection />);
		unmount();
	} finally {
		window.matchMedia = original;
	}
	const scrubs = fromTo.mock.calls.map(
		(call) =>
			((call[2] as gsap.TweenVars).scrollTrigger as ScrollTrigger.Vars).scrub,
	);
	fromTo.mockRestore();
	return scrubs;
};

describe("OtherProjectsSection", () => {
	it("renders the accessible heading over the warp stage", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container, getByRole } = render(<OtherProjectsSection />);
		expect(
			getByRole("heading", { level: 2, name: "Other Tools & Projects" }),
		).toBeTruthy();
		expect(container.querySelector("canvas")).not.toBeNull();
		// The visual headline is decorative; the h2 carries the semantics.
		expect(
			container
				.querySelector("[data-warp-word]")
				?.closest("[aria-hidden='true']"),
		).not.toBeNull();
		getContext.mockRestore();
	});

	it("drops the lock spacer under reduced motion, where nothing locks", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container } = render(<OtherProjectsSection />);
		const spacer = container.querySelector(
			"[data-projects-scrub]",
		)?.previousElementSibling;
		expect(spacer?.className).toContain("h-[225vh]");
		expect(spacer?.className).toContain("motion-reduce:h-0");
		getContext.mockRestore();
	});

	it("lays the settled scene on its own track after the stage, under the showcase", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		const { container } = render(<OtherProjectsSection />);
		const stage = container.querySelector("canvas")?.closest(".sticky");
		const track = container.querySelector("[data-warp-overlay-track]");
		expect(stage?.nextElementSibling).toBe(track);
		expect(track?.querySelector("[data-warp-word]")).not.toBeNull();
		// The canvas stage no longer carries any of the settled pieces.
		expect(stage?.querySelector("[data-warp-word]")).toBeNull();
		expect(stage?.querySelector("[data-scroll-hint]")).toBeNull();
	});

	// FRA-185: the starfield writes inline styles into the overlay, so a live
	// reduced-motion flip must give both a pristine DOM, not just the canvas.
	it("remounts the starfield and its overlay together on a live reduced-motion flip", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		const media = liveReducedMotion();
		try {
			const { container } = render(<OtherProjectsSection />);
			const canvas = container.querySelector("canvas");
			const track = container.querySelector("[data-warp-overlay-track]");
			media.flip(true);
			expect(container.querySelector("canvas")).not.toBe(canvas);
			expect(container.querySelector("[data-warp-overlay-track]")).not.toBe(
				track,
			);
			// The fresh overlay is wired: the no-context fallback settled its words.
			expect(
				container.querySelector<HTMLElement>("[data-warp-word]")?.style.opacity,
			).toBe("1");
		} finally {
			media.restore();
		}
	});

	it("releases an engaged theater lock on a flip to reduced motion", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		const scrollTo = vi.fn();
		vi.stubGlobal("scrollTo", scrollTo);
		const media = liveReducedMotion();
		let scrollY = 0;
		for (const key of ["pageYOffset", "scrollY"]) {
			Object.defineProperty(window, key, {
				configurable: true,
				get: () => scrollY,
			});
		}
		const touchmove = () => {
			const event = new Event("touchmove", { cancelable: true });
			window.dispatchEvent(event);
			return event.defaultPrevented;
		};
		try {
			render(<OtherProjectsSection />);
			// jsdom rects are zero, so the seed trigger measured at mount spans 0 to two
			// viewports (a refresh now would re-base it on the new scroll); past its end
			// the trigger reads progress 1 and engages the lock there.
			scrollY = window.innerHeight * 3;
			ScrollTrigger.update();
			expect(scrollTo).toHaveBeenCalledWith({
				top: window.innerHeight * 2,
				behavior: "instant",
			});
			expect(touchmove()).toBe(true);
			media.flip(true);
			expect(touchmove()).toBe(false);
		} finally {
			media.restore();
			vi.unstubAllGlobals();
		}
	});

	// FRA-185: the rail follows the raw scroll on desktop and Android; iOS devices get
	// the catch-up that hides their sparse scroll reports.
	it("scrubs the rail by raw scroll everywhere but iOS", () => {
		vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null);
		const raw = railScrubs();
		expect(raw).toHaveLength(4);
		expect(new Set(raw)).toEqual(new Set([true]));
		iosState.value = true;
		expect(new Set(railScrubs())).toEqual(new Set([IOS_SCRUB_S]));
	});
});
