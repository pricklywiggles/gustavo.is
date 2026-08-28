import { afterEach, describe, expect, it, vi } from "vitest";
import {
	fetchYoutubeTitle,
	youtubeThumbnailUrl,
	youtubeVideoId,
	youtubeWatchUrl,
} from "./youtube";

const ID = "aqz-KE-bpKQ";

describe("youtubeVideoId", () => {
	it.each([
		`https://www.youtube.com/watch?v=${ID}`,
		`https://youtube.com/watch?v=${ID}&t=30s`,
		`https://m.youtube.com/watch?v=${ID}`,
		`https://youtu.be/${ID}`,
		`https://youtu.be/${ID}?si=abc`,
		`https://www.youtube.com/shorts/${ID}`,
		`https://www.youtube.com/embed/${ID}`,
		`https://www.youtube-nocookie.com/embed/${ID}`,
		`https://www.youtube.com/live/${ID}`,
	])("parses %s", (url) => {
		expect(youtubeVideoId(url)).toBe(ID);
	});

	it.each([
		"not a url",
		"https://example.com/watch?v=aqz-KE-bpKQ",
		"https://www.youtube.com/watch",
		"https://www.youtube.com/playlist?list=PL123",
		"https://youtu.be/too-short",
	])("throws on %s so a bad URL fails the build", (url) => {
		expect(() => youtubeVideoId(url)).toThrow();
	});
});

describe("url builders", () => {
	it("builds the watch url", () => {
		expect(youtubeWatchUrl(ID)).toBe(`https://www.youtube.com/watch?v=${ID}`);
	});

	it("builds i.ytimg.com thumbnail urls", () => {
		expect(youtubeThumbnailUrl(ID, "maxresdefault")).toBe(
			`https://i.ytimg.com/vi/${ID}/maxresdefault.jpg`,
		);
		expect(youtubeThumbnailUrl(ID, "hqdefault")).toBe(
			`https://i.ytimg.com/vi/${ID}/hqdefault.jpg`,
		);
	});
});

describe("fetchYoutubeTitle", () => {
	afterEach(() => {
		vi.unstubAllGlobals();
	});

	it("returns the oEmbed title", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ title: "Big Buck Bunny" }),
			}),
		);
		await expect(fetchYoutubeTitle(youtubeWatchUrl(ID))).resolves.toBe(
			"Big Buck Bunny",
		);
	});

	it("returns null on a non-200 response", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({ ok: false, json: async () => ({}) }),
		);
		await expect(fetchYoutubeTitle(youtubeWatchUrl(ID))).resolves.toBeNull();
	});

	it("returns null when the network is unreachable, never throws", async () => {
		vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
		await expect(fetchYoutubeTitle(youtubeWatchUrl(ID))).resolves.toBeNull();
	});

	it("returns null on an unexpected payload shape", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue({
				ok: true,
				json: async () => ({ nope: true }),
			}),
		);
		await expect(fetchYoutubeTitle(youtubeWatchUrl(ID))).resolves.toBeNull();
	});
});
