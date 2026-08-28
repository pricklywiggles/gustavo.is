import { Feed } from "feed";
import {
	AUTHOR_NAME,
	absoluteUrl,
	BLOG_DESCRIPTION,
	FEED_PATH,
	SITE_NAME,
	SITE_URL,
} from "@/lib/site";
import { OG_IMAGES } from "@/lib/site-metadata";
import { publishedPosts } from "@/lib/source";

export const dynamic = "force-static";

export function GET() {
	const posts = publishedPosts();
	const feed = new Feed({
		id: SITE_URL,
		title: `${SITE_NAME} blog`,
		description: BLOG_DESCRIPTION,
		link: absoluteUrl("/blog"),
		language: "en",
		image: absoluteUrl(OG_IMAGES.blog.url),
		updated: posts[0]?.data.date,
		feedLinks: { rss: absoluteUrl(FEED_PATH) },
		author: { name: AUTHOR_NAME, link: SITE_URL },
		generator: false,
	});
	// No item-level author: RSS 2.0 defines <author> as an email address, and the
	// channel already names the one writer.
	for (const post of posts) {
		feed.addItem({
			title: post.data.title,
			id: absoluteUrl(post.url),
			link: absoluteUrl(post.url),
			date: post.data.date,
			description: post.data.description,
			category: post.data.tags.map((name) => ({ name })),
		});
	}
	return new Response(feed.rss2(), {
		headers: { "content-type": "application/rss+xml; charset=utf-8" },
	});
}
