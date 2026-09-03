/** Stand-in for `.source/server` in tests: its MDX query-string imports break vitest. */
type Frontmatter = {
	title: string;
	slug: string;
	date: Date;
	description?: string;
	tags: string[];
	draft: boolean;
	image?: string;
	imageAlt?: string;
};

const post = (
	file: string,
	data: Frontmatter,
	exports: Record<string, unknown> = {},
) => ({
	info: { path: file, fullPath: `content/blog/${file}` },
	...data,
	_exports: exports,
	getText: async () => `Body of ${data.title}.\n`,
});

export const BLOG_FIXTURE = [
	post("old.mdx", {
		title: "Old",
		slug: "old-post",
		date: new Date("2025-01-01"),
		description: "The old one.",
		tags: [],
		draft: false,
	}),
	post(
		"new.mdx",
		{
			title: "New",
			slug: "new-post",
			date: new Date("2026-01-01"),
			description: "The new one.",
			tags: ["t"],
			draft: false,
			image: "./new.webp",
			imageAlt: "A new thing",
		},
		// What remarkCoverExport's `export const cover` looks like after bundling.
		{
			cover: {
				src: "/_next/static/media/new.abc123.webp",
				width: 1200,
				height: 630,
			},
		},
	),
	post("draft.mdx", {
		title: "Draft",
		slug: "draft-post",
		date: new Date("2026-06-01"),
		tags: [],
		draft: true,
	}),
];
