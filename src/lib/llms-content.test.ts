import { describe, expect, it, vi } from "vitest";
import {
	llmsFullText,
	llmsIndexText,
	markdownPages,
	pageMarkdown,
} from "./llms-content";

vi.mock("../../.source/server", async () => ({
	blog: (await import("./source-fixture")).BLOG_FIXTURE,
}));

describe("markdown mirrors", () => {
	it("lists retrospectives and published posts, and every path resolves", async () => {
		const pages = markdownPages();
		expect(pages).toEqual([
			"/remembering/ponder",
			"/remembering/ponder-blogs",
			"/blog/new-post",
			"/blog/old-post",
		]);
		for (const path of pages) expect(await pageMarkdown(path)).not.toBeNull();
	});

	it("renders a post with its processed body", async () => {
		const md = await pageMarkdown("/blog/new-post");
		expect(md).toContain("# New\n\n> The new one.");
		expect(md).toContain("Body of New.");
	});

	it("returns null for drafts and unknown paths", async () => {
		expect(await pageMarkdown("/blog/draft-post")).toBeNull();
		expect(await pageMarkdown("/blog/nope")).toBeNull();
		expect(await pageMarkdown("/remembering/nope")).toBeNull();
	});

	it("keeps drafts out of the index and the full text", async () => {
		expect(llmsIndexText()).not.toContain("draft-post");
		const full = await llmsFullText();
		expect(full).not.toContain("Body of Draft.");
		expect(full).toContain("Body of New.");
		expect(full).toContain("Body of Old.");
		expect(full).toContain("# Ponder, a group blogging platform");
	});
});
