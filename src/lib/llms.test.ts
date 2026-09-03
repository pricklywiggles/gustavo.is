import { describe, expect, it } from "vitest";
import type { Retrospective } from "@/components/retrospective/retrospective-data";
import type { Employment } from "./career";
import {
	careerMarkdown,
	llmsIndex,
	type PostSummary,
	paragraphMarkdown,
	postMarkdown,
	retrospectiveMarkdown,
} from "./llms";

const retro: Retrospective = {
	slug: "demo",
	ogImage: "default",
	tagline: "a demo.",
	contributions: "Everything.",
	years: "2019 to 2021",
	mural: "/x.webp",
	metaTitle: "Demo, a demo",
	metaDescription: "What the demo was.",
	purpose: [["Built with ", { text: "friends", href: "https://x.test" }, "."]],
	lessons: [{ id: "a", title: "Ship.", body: ["Ship early."] }],
	technologies: [{ name: "React", type: "Client", highlights: ["SPA"] }],
	features: [
		{
			id: "f",
			name: "Editor",
			videoUrl: "https://player.vimeo.com/video/1",
			videoTitle: "Editor",
			highlights: ["Auto-save"],
			poster: "/p.jpg",
		},
	],
};

const post: PostSummary = {
	url: "/blog/hi",
	title: "Hi",
	description: "Hello.",
	date: "2026-07-16",
	tags: ["a", "b"],
};

const history: Employment[] = [
	{
		company: "Acme",
		city: "Seattle",
		roles: [{ title: "Engineer", start: 2000, end: 2005 }],
		products: ["A", "B"],
		start: 2000,
		end: 2005,
	},
	{
		company: "Now",
		city: "LA",
		roles: [
			{ title: "Dev", start: 2005, end: 2010 },
			{ title: "Lead", start: 2010, end: null },
		],
		products: ["C"],
		start: 2005,
		end: null,
	},
];

describe("llms markdown", () => {
	it("renders link runs as markdown links", () => {
		expect(paragraphMarkdown(retro.purpose[0])).toBe(
			"Built with [friends](https://x.test).",
		);
	});

	it("renders a retrospective with every section", () => {
		const md = retrospectiveMarkdown(retro);
		expect(md).toContain("# Demo, a demo");
		expect(md).toContain("- Page: https://gustavo.is/remembering/demo");
		expect(md).toContain("### Editor\n\n- Auto-save");
		expect(md).toContain("### Ship.\n\nShip early.");
		expect(md).toContain("### React (Client)\n\n- SPA");
	});

	it("renders a post with its frontmatter as a header block", () => {
		expect(postMarkdown(post, "Body.\n")).toBe(
			"# Hi\n\n> Hello.\n\n- Published: 2026-07-16\n- Tags: a, b\n- Page: https://gustavo.is/blog/hi\n\nBody.\n",
		);
	});

	it("omits the blockquote and tags line when a post has neither", () => {
		expect(
			postMarkdown(
				{ url: "/blog/x", title: "X", date: "2026-01-01", tags: [] },
				"B",
			),
		).toBe(
			"# X\n\n- Published: 2026-01-01\n- Page: https://gustavo.is/blog/x\n\nB\n",
		);
	});

	it("writes one employer per line, in order, without dates", () => {
		const md = careerMarkdown(history);
		expect(md).toBe(
			[
				"- Acme (Seattle): Engineer. Products: A, B.",
				"- Now (LA): Dev, Lead. Products: C.",
			].join("\n"),
		);
		expect(md).not.toMatch(/\d{4}/);
	});

	it("builds an index whose H2 sections hold only links", () => {
		const md = llmsIndex([post], [retro]);
		expect(md.startsWith("# gustavo.is\n\n> ")).toBe(true);
		expect(md).toContain("https://gustavo.is/llms.mdx/<page path>");
		expect(md.indexOf("Career, one employer per line")).toBeLessThan(
			md.indexOf("## Pages"),
		);
		expect(md).toContain(
			"- [Demo, a demo](https://gustavo.is/llms.mdx/remembering/demo): What the demo was.",
		);
		expect(md).toContain(
			"- [Hi](https://gustavo.is/llms.mdx/blog/hi): Hello. (published 2026-07-16)",
		);
		expect(md).toContain("https://gustavo.is/llms-full.txt");
		const sections = md.split(/^## /m).slice(1);
		for (const section of sections) {
			const bodyLines = section.split("\n").slice(1).filter(Boolean);
			for (const line of bodyLines) expect(line).toMatch(/^- \[.+\]\(.+\)/);
		}
	});

	it("drops the blog section when there are no posts", () => {
		const md = llmsIndex([], [retro]);
		expect(md).not.toContain("## Blog posts");
		expect(md).toContain("## Optional");
	});
});
