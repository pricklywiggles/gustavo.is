import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import gsap from "gsap";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import { IOS_SCRUB_S } from "@/lib/scroll-scrub";
import { IntroSection } from "./intro";

// The dialog arrives through next/dynamic; loading its chunk here keeps Vite's transform
// time (seconds on a loaded machine) out of the open assertion's window.
beforeAll(async () => {
	await import("@/components/contact-dialog");
});

const reducedState = { value: false };
vi.mock("@/components/use-reduced-motion-live", () => ({
	useReducedMotionLive: () => reducedState.value,
}));
const iosState = { value: false };
vi.mock("@/lib/ios-device", () => ({
	isIOSDevice: () => iosState.value,
}));

afterEach(() => {
	reducedState.value = false;
	iosState.value = false;
	vi.restoreAllMocks();
});

// The setup stub answers every query false, which skips the motion-only GSAP paths.
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

// Exactly one build: the headline's start/end callbacks must keep their identity
// across the intro's re-renders, or AnimatedLines rebuilds its trigger each time.
const headlineScrub = async () => {
	const timeline = vi.spyOn(gsap, "timeline");
	const { unmount } = render(<IntroSection />);
	await waitFor(() => expect(timeline).toHaveBeenCalled());
	// Anything the effect chain still has in flight lands before the count is read.
	await new Promise((resolve) => setTimeout(resolve, 50));
	expect(timeline).toHaveBeenCalledTimes(1);
	const scrub = (
		(timeline.mock.calls[0][0] as gsap.TimelineVars).scrollTrigger as
			| ScrollTrigger.Vars
			| undefined
	)?.scrub;
	unmount();
	timeline.mockRestore();
	return scrub;
};

const DURATION = 5.084;
const LAST_FRAME = DURATION - 0.05;

// jsdom never loads media: `duration` and `currentTime` are stubbed on the element, and
// readyState is 0 unless a test raises it.
const instrument = (
	video: HTMLVideoElement,
	readyState = 0,
	duration = DURATION,
) => {
	const seeks: number[] = [];
	// jsdom's pause() is a not-implemented stub; a seek mid-play must pause first.
	video.pause = () => {
		seeks.push(Number.NaN);
	};
	Object.defineProperty(video, "duration", { value: duration });
	Object.defineProperty(video, "readyState", { value: readyState });
	Object.defineProperty(video, "currentTime", {
		get: () => seeks.at(-1) ?? 0,
		set: (time: number) => {
			seeks.push(time);
		},
	});
	return seeks;
};

describe("IntroSection scene video under reduced motion", () => {
	it("seeks to the last frame once metadata arrives, and rewinds on unmount", () => {
		reducedState.value = true;
		const { container, unmount } = render(<IntroSection />);
		const video = container.querySelector("video");
		if (!video) throw new Error("no video");
		const seeks = instrument(video);
		expect(seeks).toEqual([]);
		fireEvent(video, new Event("loadedmetadata"));
		// NaN marks a pause() call: always before a seek.
		expect(seeks).toHaveLength(2);
		expect(seeks[0]).toBeNaN();
		expect(seeks[1]).toBeCloseTo(LAST_FRAME, 6);
		unmount();
		expect(seeks.slice(-2)).toEqual([Number.NaN, 0]);
	});

	it("seeks at once when metadata is already in, and rewinds on a flip to motion", () => {
		const { container, rerender } = render(<IntroSection />);
		const video = container.querySelector("video");
		if (!video) throw new Error("no video");
		const seeks = instrument(video, HTMLMediaElement.HAVE_METADATA);
		reducedState.value = true;
		rerender(<IntroSection />);
		expect(seeks).toHaveLength(2);
		expect(seeks[1]).toBeCloseTo(LAST_FRAME, 6);
		reducedState.value = false;
		rerender(<IntroSection />);
		expect(seeks.slice(-2)).toEqual([Number.NaN, 0]);
		// The listener went with the cleanup: late metadata must not seek again.
		fireEvent(video, new Event("loadedmetadata"));
		expect(seeks).toHaveLength(4);
	});

	it("leaves a video with no finite duration alone", () => {
		reducedState.value = true;
		const { container } = render(<IntroSection />);
		const video = container.querySelector("video");
		if (!video) throw new Error("no video");
		const seeks = instrument(video, 0, Number.POSITIVE_INFINITY);
		fireEvent(video, new Event("loadedmetadata"));
		expect(seeks).toEqual([]);
	});
});

describe("IntroSection", () => {
	it("renders the title, body, and scene video", () => {
		const { container } = render(<IntroSection />);
		expect(
			screen.getByRole("heading", { name: "Hi, I'm Gustavo" }),
		).toBeDefined();
		expect(screen.getByText(/pair programming with my dog Kiwi/)).toBeDefined();
		const video = container.querySelector("video");
		expect(video?.hasAttribute("controls")).toBe(false);
		// No <source> list: a file named in the markup gets fetched by whichever engine
		// claims it at parse time, before the mount effect can choose.
		expect(video?.querySelector("source")).toBeNull();
	});

	it("picks the WebM on mount for a non-WebKit engine", () => {
		// jsdom has no webkitPresentationMode, so it stands in for Firefox and Chromium.
		const { container } = render(<IntroSection />);
		expect(container.querySelector("video")?.getAttribute("src")).toBe(
			"/scene_home.webm",
		);
	});

	it("picks the HEVC file on mount for WebKit", () => {
		Object.defineProperty(
			HTMLVideoElement.prototype,
			"webkitPresentationMode",
			{
				value: "inline",
				configurable: true,
			},
		);
		try {
			const { container } = render(<IntroSection />);
			expect(container.querySelector("video")?.getAttribute("src")).toBe(
				"/scene_home.mov",
			);
		} finally {
			delete (
				HTMLVideoElement.prototype as { webkitPresentationMode?: unknown }
			).webkitPresentationMode;
		}
	});

	// FRA-185: desktop and Android keep the shadow and the raw scroll; only iOS devices
	// (Safari and Chrome alike) trade them for a stutter-free reveal.
	it("keeps the scene's drop shadow off iOS devices", () => {
		const { container, unmount } = render(<IntroSection />);
		expect(container.querySelector("video")?.style.filter).toContain(
			"drop-shadow",
		);
		unmount();
		iosState.value = true;
		const ios = render(<IntroSection />);
		expect(ios.container.querySelector("video")?.style.filter).toBe("none");
	});

	it("paces the headline by raw scroll, with a catch-up only on iOS", async () => {
		const restore = allowMotion();
		try {
			expect(await headlineScrub()).toBe(true);
			iosState.value = true;
			expect(await headlineScrub()).toBe(IOS_SCRUB_S);
		} finally {
			restore();
		}
	});

	it("renders both calls to action", () => {
		render(<IntroSection />);
		expect(screen.getByRole("button", { name: /say hello/i })).toBeDefined();
		expect(screen.getByRole("link", { name: /see my work/i })).toBeDefined();
	});

	it("opens the say-hello dialog with the contact form", async () => {
		render(<IntroSection />);
		fireEvent.click(screen.getByRole("button", { name: /say hello/i }));
		expect(await screen.findByRole("dialog")).toBeDefined();
		expect(screen.getByLabelText("Name")).toBeDefined();
		expect(screen.getByLabelText("Message")).toBeDefined();
	});
});
