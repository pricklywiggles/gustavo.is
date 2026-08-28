import { describe, expect, it, vi } from "vitest";
import { blogSource, coverOf, publishedPosts } from "./source";

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

describe("coverOf", () => {
	it("reads the bundled cover's src and size from the MDX exports", () => {
		const page = blogSource.getPage(["new-post"]);
		expect(page && coverOf(page)).toEqual({
			src: "/_next/static/media/new.abc123.webp",
			width: 1200,
			height: 630,
		});
	});

	it("is undefined for a post without an image", () => {
		const page = blogSource.getPage(["old-post"]);
		expect(page && coverOf(page)).toBeUndefined();
	});
});
