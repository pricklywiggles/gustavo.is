import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PONDER } from "@/components/retrospective/retrospective-data";
import {
	OG_IMAGES,
	pageMetadata,
	retrospectiveMetadata,
} from "./site-metadata";

describe("OG_IMAGES", () => {
	it("names files that exist under public/", () => {
		for (const { url } of Object.values(OG_IMAGES)) {
			expect(existsSync(join(process.cwd(), "public", url))).toBe(true);
		}
	});
});

describe("pageMetadata", () => {
	it("builds a website page with canonical, feed link, and the default card", () => {
		const meta = pageMetadata({ path: "/contact", title: "Say hello" });
		expect(meta.title).toBe("Say hello");
		expect(meta.alternates).toEqual({
			canonical: "/contact",
			types: { "application/rss+xml": "/feed.xml" },
		});
		expect(meta.openGraph).toMatchObject({
			type: "website",
			url: "/contact",
			images: [{ url: "/og/default.jpg", width: 1200, height: 630 }],
		});
	});

	it("builds an article with dates, tags, and a markdown alternate", () => {
		const meta = pageMetadata({
			path: "/blog/x",
			title: "X",
			description: "D",
			image: "blog",
			article: { publishedTime: "2026-01-01", tags: ["a"] },
			markdown: true,
		});
		expect(meta.alternates?.types).toEqual({
			"application/rss+xml": "/feed.xml",
			"text/markdown": "/llms.mdx/blog/x",
		});
		expect(meta.openGraph).toMatchObject({
			type: "article",
			publishedTime: "2026-01-01",
			tags: ["a"],
			authors: ["https://gustavo.is"],
			images: [{ url: "/og/blog.jpg" }],
		});
	});

	it("passes a page's own image through untouched", () => {
		const meta = pageMetadata({
			path: "/blog/y",
			title: "Y",
			image: { url: "/pics/y.jpg", alt: "Y" },
		});
		expect(meta.openGraph?.images).toEqual([{ url: "/pics/y.jpg", alt: "Y" }]);
	});

	it("lets the landing escape the title template", () => {
		expect(
			pageMetadata({ path: "/", title: "G", absoluteTitle: true }).title,
		).toEqual({ absolute: "G" });
	});

	it("gives a retrospective its own card and mirror", () => {
		const meta = retrospectiveMetadata(PONDER);
		expect(meta.alternates?.canonical).toBe("/remembering/ponder");
		expect(meta.alternates?.types).toHaveProperty(
			"text/markdown",
			"/llms.mdx/remembering/ponder",
		);
		expect(meta.openGraph).toMatchObject({
			type: "article",
			images: [{ url: "/og/ponder.png" }],
		});
	});
});
