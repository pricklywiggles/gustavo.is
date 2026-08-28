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
