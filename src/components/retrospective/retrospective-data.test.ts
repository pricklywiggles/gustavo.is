import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { OG_IMAGES } from "@/lib/site-metadata";
import {
	PONDER,
	PONDER_BLOGS,
	paragraphText,
	RETROSPECTIVES,
	type Retrospective,
} from "./retrospective-data";

function copyStrings(retrospective: Retrospective): string[] {
	return [
		retrospective.tagline,
		retrospective.contributions,
		retrospective.metaTitle,
		retrospective.metaDescription,
		...retrospective.purpose.flatMap((paragraph) =>
			paragraph.map((run) => (typeof run === "string" ? run : run.text)),
		),
		...retrospective.lessons.flatMap((lesson) => [
			lesson.title,
			paragraphText(lesson.body),
		]),
		...retrospective.technologies.flatMap((tech) => [
			tech.name,
			tech.type,
			...tech.highlights,
		]),
		...retrospective.features.flatMap((feature) => [
			feature.name,
			feature.videoTitle,
			...feature.highlights,
		]),
	];
}

describe("retrospective content", () => {
	it("imports both products at the routes that render them", () => {
		expect(RETROSPECTIVES.map((r) => r.slug)).toEqual([
			"ponder",
			"ponder-blogs",
		]);
	});

	// The sitemap and mirrors fan out from RETROSPECTIVES; the pages are hand-written files.
	it("registers exactly the retrospectives that have a page", () => {
		const pages = readdirSync(
			join(process.cwd(), "src/app/(with-header)/remembering"),
		).sort();
		const slugs = RETROSPECTIVES.map((r) => r.slug);
		expect(new Set(slugs).size).toBe(slugs.length);
		expect([...slugs].sort()).toEqual(pages);
		for (const r of RETROSPECTIVES) expect(OG_IMAGES).toHaveProperty(r.ogImage);
	});

	it("carries every section the old pages had", () => {
		expect(PONDER.lessons).toHaveLength(6);
		expect(PONDER.technologies).toHaveLength(8);
		expect(PONDER.features).toHaveLength(5);
		expect(PONDER_BLOGS.lessons).toHaveLength(5);
		expect(PONDER_BLOGS.technologies).toHaveLength(5);
		expect(PONDER_BLOGS.features).toHaveLength(2);
	});

	// Escaped, not literal: the ban covers this file too.
	const LONG_DASHES = /[\u2013\u2014]/;

	it("never lets an em or en dash into the copy", () => {
		for (const retrospective of RETROSPECTIVES) {
			for (const text of copyStrings(retrospective)) {
				expect(text).not.toMatch(LONG_DASHES);
			}
		}
	});

	it("plays every walkthrough from the Vimeo player origin", () => {
		for (const retrospective of RETROSPECTIVES) {
			for (const feature of retrospective.features) {
				expect(feature.videoUrl).toMatch(
					/^https:\/\/player\.vimeo\.com\/video\/\d+$/,
				);
				expect(feature.videoTitle.length).toBeGreaterThan(0);
				expect(feature.highlights.length).toBeGreaterThan(0);
			}
		}
	});

	it("gives every lesson and technology real content", () => {
		for (const retrospective of RETROSPECTIVES) {
			const ids = retrospective.lessons.map((lesson) => lesson.id);
			expect(new Set(ids).size).toBe(ids.length);
			for (const lesson of retrospective.lessons) {
				expect(lesson.title.length).toBeGreaterThan(10);
				expect(paragraphText(lesson.body).length).toBeGreaterThan(100);
			}
			for (const tech of retrospective.technologies) {
				expect(tech.highlights.length).toBeGreaterThan(0);
			}
		}
	});

	it("points both murals at the converted assets", () => {
		expect(PONDER.mural).toBe("/retrospectives/ponder-mural.webp");
		expect(PONDER_BLOGS.mural).toBe("/retrospectives/ponder-blogs-mural.webp");
	});
});
