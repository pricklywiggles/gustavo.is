import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { IntroSection } from "./intro";

const reducedState = { value: false };
vi.mock("@/components/use-reduced-motion-live", () => ({
	useReducedMotionLive: () => reducedState.value,
}));

afterEach(() => {
	reducedState.value = false;
});

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
		expect(video?.getAttribute("src")).toBe("/scene_home.webm");
		expect(video?.hasAttribute("controls")).toBe(false);
	});

	it("renders both calls to action", () => {
		render(<IntroSection />);
		expect(screen.getByRole("button", { name: /say hello/i })).toBeDefined();
		expect(screen.getByRole("link", { name: /see my work/i })).toBeDefined();
	});

	it("opens the say-hello dialog with the contact form", async () => {
		render(<IntroSection />);
		fireEvent.click(screen.getByRole("button", { name: /say hello/i }));
		// The dialog chunk loads through next/dynamic; a parallel run can pass 1s.
		expect(
			await screen.findByRole("dialog", {}, { timeout: 4000 }),
		).toBeDefined();
		expect(screen.getByLabelText("Name")).toBeDefined();
		expect(screen.getByLabelText("Message")).toBeDefined();
	});
});
