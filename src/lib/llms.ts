import type {
	Paragraph,
	Retrospective,
} from "@/components/retrospective/retrospective-data";
import { type Employment, employmentHistory } from "./career";
import {
	AUTHOR_NAME,
	absoluteUrl,
	BLOG_DESCRIPTION,
	FEED_PATH,
	markdownPath,
	SITE_NAME,
} from "./site";
import { SOCIAL_LINKS } from "./site-links";

export type PostSummary = {
	url: string;
	title: string;
	description?: string;
	/** ISO date, YYYY-MM-DD. */
	date: string;
	tags: string[];
	/** The cover's served path (hashed under /_next/static/media). */
	image?: string;
};

const BIO =
	"Gustavo Gallegos is a software engineer generalist in Los Angeles with 26 years in tech. He has shipped everything from Microsoft Office features to AI-powered health apps, and the agents behind them, across software engineering, QA, product management, and engineering program management.";

export function paragraphMarkdown(paragraph: Paragraph): string {
	return paragraph
		.map((run) =>
			typeof run === "string" ? run : `[${run.text}](${run.href})`,
		)
		.join("");
}

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`);

export function retrospectiveMarkdown(r: Retrospective): string {
	return [
		`# ${r.metaTitle}`,
		"",
		`> ${r.metaDescription}`,
		"",
		`- Years: ${r.years}`,
		`- My contributions: ${r.contributions}`,
		`- Page: ${absoluteUrl(`/remembering/${r.slug}`)}`,
		"",
		"## Inception and purpose",
		"",
		...r.purpose.flatMap((p) => [paragraphMarkdown(p), ""]),
		"## Features",
		"",
		...r.features.flatMap((f) => [
			`### ${f.name}`,
			"",
			...bullets(f.highlights),
			"",
			`Walkthrough video: ${f.videoUrl}`,
			"",
		]),
		"## Lessons learned",
		"",
		...r.lessons.flatMap((l) => [
			`### ${l.title}`,
			"",
			paragraphMarkdown(l.body),
			"",
		]),
		"## Technologies",
		"",
		...r.technologies.flatMap((t) => [
			`### ${t.name} (${t.type})`,
			"",
			...bullets(t.highlights),
			"",
		]),
	].join("\n");
}

export function postMarkdown(post: PostSummary, body: string): string {
	return [
		`# ${post.title}`,
		"",
		...(post.description ? [`> ${post.description}`, ""] : []),
		`- Published: ${post.date}`,
		...(post.tags.length ? [`- Tags: ${post.tags.join(", ")}`] : []),
		`- Page: ${absoluteUrl(post.url)}`,
		"",
		body.trim(),
		"",
	].join("\n");
}

/** Chronological, but without dates: the timeline is the owner's to share. */
export function careerMarkdown(
	history: readonly Employment[] = employmentHistory(),
): string {
	return history
		.map(
			(e) =>
				`- ${e.company} (${e.city}): ${e.roles.map((r) => r.title).join(", ")}. Products: ${e.products.join(", ")}.`,
		)
		.join("\n");
}

const link = (text: string, path: string, note?: string) =>
	`- [${text}](${absoluteUrl(path)})${note ? `: ${note}` : ""}`;

const postNote = (post: PostSummary) =>
	[post.description, `(published ${post.date})`].filter(Boolean).join(" ");

/**
 * The /llms.txt index in the llmstxt.org shape: H1, blockquote summary, free detail,
 * then H2 sections that hold only links. The career list is detail, not a section.
 */
export function llmsIndex(
	posts: readonly PostSummary[],
	retrospectives: readonly Retrospective[],
): string {
	return [
		`# ${SITE_NAME}`,
		"",
		`> Personal site of ${AUTHOR_NAME}: about, project retrospectives, a blog, and a contact form. Every retrospective and post also has a markdown mirror at ${absoluteUrl(markdownPath("/"))}<page path>.`,
		"",
		BIO,
		"",
		"Career, one employer per line, earliest first:",
		"",
		careerMarkdown(),
		"",
		"## Pages",
		"",
		link(
			"Home",
			"/",
			"who Gustavo is and the work history, told as a scroll story",
		),
		link("Blog", "/blog", BLOG_DESCRIPTION),
		link("Contact", "/contact", "send Gustavo a message"),
		"",
		"## Retrospectives",
		"",
		...retrospectives.map((r) =>
			link(
				r.metaTitle,
				markdownPath(`/remembering/${r.slug}`),
				r.metaDescription,
			),
		),
		"",
		...(posts.length
			? [
					"## Blog posts",
					"",
					...posts.map((p) => link(p.title, markdownPath(p.url), postNote(p))),
					"",
				]
			: []),
		"## Optional",
		"",
		link("Full text of every page", "/llms-full.txt"),
		link("RSS feed", FEED_PATH),
		...SOCIAL_LINKS.map(({ label, href }) => `- [${label}](${href})`),
		"",
	].join("\n");
}

export function llmsFull(index: string, documents: readonly string[]): string {
	return [index, ...documents].join("\n\n---\n\n");
}
