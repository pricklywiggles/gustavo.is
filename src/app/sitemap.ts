import type { MetadataRoute } from "next";
import { RETROSPECTIVES } from "@/components/retrospective/retrospective-data";
import { absoluteUrl } from "@/lib/site";
import { publishedPosts } from "@/lib/source";

export default function sitemap(): MetadataRoute.Sitemap {
	const pages = [
		"/",
		"/blog",
		"/contact",
		...RETROSPECTIVES.map((r) => `/remembering/${r.slug}`),
	].map((path) => ({ url: absoluteUrl(path) }));
	const posts = publishedPosts().map((post) => ({
		url: absoluteUrl(post.url),
		lastModified: post.data.date,
	}));
	return [...pages, ...posts];
}
