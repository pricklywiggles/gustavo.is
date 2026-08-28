import type { Metadata } from "next";
import type { Retrospective } from "@/components/retrospective/retrospective-data";
import { FEED_PATH, markdownPath, SITE_NAME, SITE_URL } from "./site";

// Public URLs carry no content hash, so a redesigned card needs a new file name or
// social scrapers keep serving the old one.
export const OG_IMAGES = {
	default: {
		url: "/og/default.jpg",
		alt: "Lego Gustavo watching the sun set over a striped desert horizon",
	},
	blog: {
		url: "/og/blog.jpg",
		alt: "Lego Gustavo walking his dog Kiwi beneath the Hollywood sign and the Los Angeles skyline at dusk",
	},
	ponder: {
		url: "/og/ponder.png",
		alt: "Pondering Ponder, with three doodled thinking faces",
	},
	"ponder-blogs": {
		url: "/og/ponder-blogs.png",
		alt: "Lessons I learned building Ponder Blogs, with the Ponder P mark",
	},
} as const;

export type OgImage = keyof typeof OG_IMAGES;

/** Every card in OG_IMAGES is authored at this size. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogImage(key: OgImage) {
	return { ...OG_IMAGES[key], ...OG_SIZE };
}

/** A page's own picture, dimensions unknown, e.g. a post's frontmatter image. */
export type CustomImage = { url: string; alt: string };

type PageMetadataInput = {
	path: string;
	title: string;
	/** Skip the "%s | gustavo.is" title template, as the landing does with the bare name. */
	absoluteTitle?: boolean;
	description?: string;
	image?: OgImage | CustomImage;
	/** Present means og:type article; empty when nothing dated applies. */
	article?: { publishedTime?: string; tags?: string[] };
	/** The page has a markdown mirror under /llms.mdx. */
	markdown?: boolean;
};

/**
 * Every page's canonical, feed link, and Open Graph card in one shape. Next replaces a
 * parent's `alternates` and `openGraph` wholesale, so each page must restate them.
 */
export function pageMetadata({
	path,
	title,
	absoluteTitle,
	description,
	image = "default",
	article,
	markdown,
}: PageMetadataInput): Metadata {
	const openGraph = {
		url: path,
		siteName: SITE_NAME,
		locale: "en_US",
		title,
		description,
		images: [typeof image === "string" ? ogImage(image) : image],
	};
	return {
		title: absoluteTitle ? { absolute: title } : title,
		description,
		alternates: {
			canonical: path,
			types: {
				"application/rss+xml": FEED_PATH,
				...(markdown ? { "text/markdown": markdownPath(path) } : {}),
			},
		},
		openGraph: article
			? {
					...openGraph,
					type: "article",
					publishedTime: article.publishedTime,
					authors: [SITE_URL],
					tags: article.tags,
				}
			: { ...openGraph, type: "website" },
	};
}

export function retrospectiveMetadata(retrospective: Retrospective): Metadata {
	return pageMetadata({
		path: `/remembering/${retrospective.slug}`,
		title: retrospective.metaTitle,
		description: retrospective.metaDescription,
		image: retrospective.ogImage,
		article: {},
		markdown: true,
	});
}
