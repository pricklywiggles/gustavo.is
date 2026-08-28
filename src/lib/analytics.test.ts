import type { PlausibleConfig } from "@plausible-analytics/tracker";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const tracker = vi.hoisted(() => ({ init: vi.fn(), track: vi.fn() }));
vi.mock("@plausible-analytics/tracker", () => tracker);

describe("analytics", () => {
	beforeEach(() => {
		// The module keeps a ready flag; each case starts from a fresh copy.
		vi.resetModules();
		tracker.init.mockClear();
		tracker.track.mockClear();
	});
	afterEach(() => {
		vi.unstubAllEnvs();
	});

	it("stays inert off production deploys", async () => {
		vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "preview");
		const { EVENTS, initAnalytics, track } = await import("./analytics");
		initAnalytics();
		track(EVENTS.notFound, { path: "/missing" });
		expect(tracker.init).not.toHaveBeenCalled();
		expect(tracker.track).not.toHaveBeenCalled();
	});

	it("proxies through /api/pa and tags every event with the motion edition", async () => {
		vi.stubEnv("NEXT_PUBLIC_VERCEL_ENV", "production");
		const { EVENTS, initAnalytics, track } = await import("./analytics");
		initAnalytics();
		initAnalytics();
		expect(tracker.init).toHaveBeenCalledTimes(1);

		const config = tracker.init.mock.calls[0]?.[0] as PlausibleConfig;
		expect(config).toMatchObject({
			domain: "gustavo.is",
			endpoint: "/api/pa",
			outboundLinks: true,
		});
		const custom =
			typeof config.customProperties === "function"
				? config.customProperties("pageview")
				: config.customProperties;
		// The vitest matchMedia polyfill answers false for every query.
		expect(custom).toEqual({ motion: "full" });

		track(EVENTS.contactSent, { source: "intro" });
		expect(tracker.track).toHaveBeenCalledWith(EVENTS.contactSent, {
			props: { source: "intro" },
		});
	});
});
