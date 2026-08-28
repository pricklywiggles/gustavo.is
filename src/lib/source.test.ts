import { describe, expect, it, vi } from "vitest";
import { blogSource, publishedPosts } from "./source";

vi.mock("../../.source/server", async () => ({
	blog: (await import("./source-fixture")).BLOG_FIXTURE,
}));

describe("publishedPosts", () => {
	it("drops drafts and sorts newest first", () => {
		expect(publishedPosts().map((p) => p.url)).toEqual([
			"/blog/new-post",
			"/blog/old-post",
		]);
	});

	it("routes by frontmatter slug, not file name", () => {
		expect(blogSource.getPage(["new-post"])?.data.title).toBe("New");
		expect(blogSource.getPage(["new"])).toBeUndefined();
	});
});
