import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { frontmatter } from "fumadocs-core/content/md/frontmatter";
import { describe, expect, it } from "vitest";

// Reads the raw files on purpose: the loader keys pages by slug with Map.set, so a
// duplicate slug silently replaces the earlier post and is invisible through blogSource.
const BLOG_DIR = resolve("content/blog");

const posts = readdirSync(BLOG_DIR, { recursive: true, encoding: "utf8" })
	.filter((name) => name.endsWith(".mdx"))
	.map((name) => {
		const file = join(BLOG_DIR, name);
		const data = frontmatter(readFileSync(file, "utf8")).data as {
			slug?: string;
			image?: string;
		};
		return { file, ...data };
	});

describe("content/blog", () => {
	it("has posts to check", () => {
		expect(posts.length).toBeGreaterThan(0);
	});

	it("gives every post a unique slug", () => {
		const slugs = posts.map((post) => post.slug);
		const duplicates = slugs.filter((slug, i) => slugs.indexOf(slug) !== i);
		expect(duplicates).toEqual([]);
	});

	it("keeps every cover inside its own post's folder", () => {
		for (const { file, image } of posts) {
			if (!image) continue;
			expect(image, file).toMatch(/^\.\//);
			expect(
				existsSync(resolve(dirname(file), image)),
				`${file}: ${image}`,
			).toBe(true);
		}
	});
});
