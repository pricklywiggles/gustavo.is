import { afterEach, describe, expect, it, vi } from "vitest";
import { isIOSDevice, isIOSDeviceFrom } from "./ios-device";

const IPHONE_SAFARI =
	"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1";
const IPHONE_CHROME =
	"Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.6723.37 Mobile/15E148 Safari/604.1";
// iPadOS 13+ and macOS Safari send the same string; only the touch count differs.
const MACINTOSH_SAFARI =
	"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15";
const ANDROID_CHROME =
	"Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
const WINDOWS_CHROME =
	"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36";

describe("isIOSDeviceFrom", () => {
	it.each([
		["iPhone Safari", IPHONE_SAFARI, 5, true],
		["iPhone Chrome", IPHONE_CHROME, 5, true],
		["iPad Safari", MACINTOSH_SAFARI, 5, true],
		["macOS Safari", MACINTOSH_SAFARI, 0, false],
		["Android Chrome", ANDROID_CHROME, 5, false],
		["desktop Chrome", WINDOWS_CHROME, 0, false],
		["desktop Chrome on a touch screen", WINDOWS_CHROME, 10, false],
		[
			"an iPhone user agent with no touch (devtools override)",
			IPHONE_SAFARI,
			0,
			false,
		],
	])("%s", (_name, userAgent, maxTouchPoints, expected) => {
		expect(isIOSDeviceFrom({ userAgent, maxTouchPoints })).toBe(expected);
	});
});

describe("isIOSDevice", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("reads the live navigator", () => {
		vi.stubGlobal("navigator", {
			userAgent: IPHONE_SAFARI,
			maxTouchPoints: 5,
		});
		expect(isIOSDevice()).toBe(true);
		vi.stubGlobal("navigator", { userAgent: WINDOWS_CHROME });
		expect(isIOSDevice()).toBe(false);
	});

	it("is false where there is no navigator (server render)", () => {
		vi.stubGlobal("navigator", undefined);
		expect(isIOSDevice()).toBe(false);
	});
});
