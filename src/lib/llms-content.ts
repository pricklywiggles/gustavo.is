import { RETROSPECTIVES } from "@/components/retrospective/retrospective-data";
import { blogDateTime } from "./blog-date";
import {
	llmsFull,
	llmsIndex,
	type PostSummary,
	postMarkdown,
	retrospectiveMarkdown,
} from "./llms";
import { coverOf, publishedPosts } from "./source";

type Post = ReturnType<typeof publishedPosts>[number];

export function postSummary(post: Post): PostSummary {
	return {
		url: post.url,
		title: post.data.title,
		description: post.data.description,
		date: blogDateTime(post.data.date),
		tags: post.data.tags,
		image: coverOf(post)?.src,
	};
}

const postDocument = async (post: Post) =>
	postMarkdown(postSummary(post), await post.data.getText("processed"));

export function llmsIndexText(): string {
	return llmsIndex(publishedPosts().map(postSummary), RETROSPECTIVES);
}

export async function llmsFullText(): Promise<string> {
	const posts = await Promise.all(publishedPosts().map(postDocument));
	return llmsFull(llmsIndexText(), [
		...RETROSPECTIVES.map(retrospectiveMarkdown),
		...posts,
	]);
}

/** Site paths of every page with a markdown mirror. */
export function markdownPages(): string[] {
	return [
		...RETROSPECTIVES.map((r) => `/remembering/${r.slug}`),
		...publishedPosts().map((post) => post.url),
	];
}

export async function pageMarkdown(path: string): Promise<string | null> {
	const retrospective = RETROSPECTIVES.find(
		(r) => `/remembering/${r.slug}` === path,
	);
	if (retrospective) return retrospectiveMarkdown(retrospective);
	const post = publishedPosts().find((p) => p.url === path);
	return post ? postDocument(post) : null;
}
