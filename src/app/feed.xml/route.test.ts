import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

vi.mock("../../../.source/server", async () => ({
	blog: (await import("@/lib/source-fixture")).BLOG_FIXTURE,
}));

describe("feed.xml", () => {
	it("serves RSS 2.0 with published posts only and no item-level author", async () => {
		const response = GET();
		expect(response.headers.get("content-type")).toBe(
			"application/rss+xml; charset=utf-8",
		);
		const xml = await response.text();
		expect(xml).toContain('<rss version="2.0"');
		expect(xml).toContain("<link>https://gustavo.is/blog/new-post</link>");
		expect(xml).toContain("<link>https://gustavo.is/blog/old-post</link>");
		expect(xml).not.toContain("draft-post");
		expect(xml).not.toContain("<author>");
		expect(xml).toContain('rel="self" type="application/rss+xml"');
	});
});
