import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { blog } from "../../.source/server";
import type { PostCover } from "./post-cover";

export const blogSource = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(blog, []),
	slugs(file) {
		return [file.data.slug];
	},
});

/** The one ordering the index, sitemap, feed, and llms routes share. */
export function publishedPosts() {
	return blogSource
		.getPages()
		.filter((page) => !page.data.draft)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** `_exports.cover` comes from source.config.ts's remarkCoverExport. */
export function coverOf(post: {
	data: { _exports: Record<string, unknown>; imageAlt?: string };
}): PostCover | undefined {
	const cover = post.data._exports.cover;
	if (typeof cover !== "object" || cover === null) return undefined;
	const { src, width, height } = cover as Partial<PostCover>;
	return typeof src === "string" &&
		typeof width === "number" &&
		typeof height === "number"
		? { src, width, height, alt: post.data.imageAlt ?? "" }
		: undefined;
}
