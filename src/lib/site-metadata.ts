import type { Metadata } from "next";
import type { Retrospective } from "@/components/retrospective/retrospective-data";
import { FEED_PATH, markdownPath, SITE_NAME, SITE_URL } from "./site";

// No content hash on public/ URLs: a redesigned card needs a new file name.
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

/** The files in public/og must actually be this size. */
export const OG_SIZE = { width: 1200, height: 630 } as const;

export function ogImage(key: OgImage) {
	return { ...OG_IMAGES[key], ...OG_SIZE };
}

/** Width and height only when the bundler knows them. */
export type CustomImage = {
	url: string;
	alt: string;
	width?: number;
	height?: number;
};

type PageMetadataInput = {
	path: string;
	title: string;
	/** Skips the "%s | gustavo.is" template, as the landing does. */
	absoluteTitle?: boolean;
	description?: string;
	image?: OgImage | CustomImage;
	/** Present means og:type article, even when empty. */
	article?: { publishedTime?: string; tags?: string[] };
	markdown?: boolean;
};

/** Next replaces a parent's `alternates` and `openGraph` wholesale, so each page restates them. */
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
