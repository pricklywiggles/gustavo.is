import { loader } from "fumadocs-core/source";
import { toFumadocsSource } from "fumadocs-mdx/runtime/server";
import { blog } from "../../.source/server";

export const blogSource = loader({
	baseUrl: "/blog",
	source: toFumadocsSource(blog, []),
	slugs(file) {
		return [file.data.slug];
	},
});

/** Non-draft posts, newest first: the index, sitemap, feed, and llms routes all agree. */
export function publishedPosts() {
	return blogSource
		.getPages()
		.filter((page) => !page.data.draft)
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export type Cover = { src: string; width: number; height: number };

/**
 * The post's cover as the bundler emitted it: source.config.ts exports the frontmatter
 * `image` from each MDX module as `cover`, a StaticImageData whose `src` is the hashed
 * /_next/static/media URL. Undefined when the post has no image.
 */
export function coverOf(post: {
	data: { _exports: Record<string, unknown> };
}): Cover | undefined {
	const cover = post.data._exports.cover;
	if (typeof cover !== "object" || cover === null) return undefined;
	const { src, width, height } = cover as Partial<Cover>;
	return typeof src === "string" &&
		typeof width === "number" &&
		typeof height === "number"
		? { src, width, height }
		: undefined;
}
