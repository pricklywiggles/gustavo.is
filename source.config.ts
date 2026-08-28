import { existsSync } from "node:fs";
import { join } from "node:path";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
import { codeTheme } from "./src/lib/code-theme";

const postSchema = z
	.object({
		title: z.string(),
		slug: z.string(),
		date: z.coerce.date(),
		description: z.string().optional(),
		tags: z.array(z.string()).default([]),
		draft: z.boolean().default(false),
		/** Representative image, a path under public/; drives the card and BlogPosting.image. */
		image: z.string().optional(),
	})
	.refine((post) => post.draft || post.description, {
		message:
			"Published posts need a description: it feeds the meta tag, OG card, RSS, and llms.txt.",
		path: ["description"],
	})
	.refine(
		(post) =>
			!post.image || existsSync(join(process.cwd(), "public", post.image)),
		{ message: "image must name a file under public/", path: ["image"] },
	);

export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: postSchema,
	// Feeds the /llms.mdx markdown mirrors via page.data.getText("processed").
	postprocess: { includeProcessedMarkdown: true },
});

// Global mdxOptions keep the preset's default plugins; a collection-level mdxOptions
// would remove them all.
export default defineConfig({
	mdxOptions: {
		rehypeCodeOptions: {
			// A bare `theme` key loses to the preset's default dual `themes` in the shallow
			// merge, leaving CSS-variable output nothing on this site consumes.
			themes: { light: codeTheme },
			defaultColor: "light",
			icon: false,
		},
	},
});
