import { render } from "@testing-library/react";
import gsap from "gsap";
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
