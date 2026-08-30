import { afterEach, describe, expect, it, vi } from "vitest";
import { IOS_SCRUB_S, scrollScrub } from "./scroll-scrub";

const iosState = { value: false };
vi.mock("@/lib/ios-device", () => ({
	isIOSDevice: () => iosState.value,
}));

afterEach(() => {
	iosState.value = false;
});

// FRA-185: raw scroll on desktop and Android; iOS devices get the catch-up that hides
// their sparse scroll reports.
describe("scrollScrub", () => {
	it("keeps the raw scroll sample off iOS", () => {
		expect(scrollScrub()).toBe(true);
	});

	it("gives iOS devices the catch-up", () => {
		iosState.value = true;
		expect(scrollScrub()).toBe(IOS_SCRUB_S);
	});
});
