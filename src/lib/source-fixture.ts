/**
 * Stand-in for the generated `.source/server` module in tests: the real one imports
 * MDX with query strings vitest cannot parse. Mock it with
 * `vi.mock("../../.source/server", async () => ({ blog: (await import("./source-fixture")).BLOG_FIXTURE }))`.
 */
type Frontmatter = {
	title: string;
	slug: string;
	date: Date;
	description?: string;
	tags: string[];
	draft: boolean;
	image?: string;
};

const post = (file: string, data: Frontmatter) => ({
	info: { path: file, fullPath: `content/blog/${file}` },
	...data,
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
	post("new.mdx", {
		title: "New",
		slug: "new-post",
		date: new Date("2026-01-01"),
		description: "The new one.",
		tags: ["t"],
		draft: false,
		image: "/og/blog.jpg",
	}),
	post("draft.mdx", {
		title: "Draft",
		slug: "draft-post",
		date: new Date("2026-06-01"),
		tags: [],
		draft: true,
	}),
];
