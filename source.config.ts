import { existsSync } from "node:fs";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { defineCollections, defineConfig } from "fumadocs-mdx/config";
import { z } from "zod";
import { codeTheme } from "./src/lib/code-theme";

function isOwnedAsset(image: string, postPath: string): boolean {
	if (!image.startsWith("./")) return false;
	const dir = dirname(isAbsolute(postPath) ? postPath : resolve(postPath));
	const target = resolve(dir, image);
	const rel = relative(dir, target);
	if (!rel || rel.startsWith("..") || rel.includes(`..${sep}`)) return false;
	return existsSync(target);
}

const postSchema = (postPath: string) =>
	z
		.object({
			title: z.string(),
			slug: z.string(),
			date: z.coerce.date(),
			description: z.string().optional(),
			tags: z.array(z.string()).default([]),
			draft: z.boolean().default(false),
			/** Cover, `./name.webp` beside the post: hero, index card, OG image, BlogPosting. */
			image: z.string().optional(),
			/** Omit when the cover is purely decorative. */
			imageAlt: z.string().optional(),
		})
		.refine((post) => post.draft || post.description, {
			message:
				"Published posts need a description: it feeds the meta tag, OG card, RSS, and llms.txt.",
			path: ["description"],
		})
		.refine((post) => !post.image || isOwnedAsset(post.image, postPath), {
			message:
				"image must be a ./ path to a file inside the post's own folder (e.g. ./cover.webp)",
			path: ["image"],
		});

/**
 * Frontmatter `image` becomes a bundler import exported as `cover`, so covers ship hashed
 * from /_next/static/media instead of public/. Only estree survives MDX compilation.
 */
function remarkCoverExport() {
	return (
		tree: { children: unknown[] },
		file: { data: Record<string, unknown> },
	) => {
		const frontmatter = file.data.frontmatter as
			| { image?: unknown }
			| undefined;
		const image = frontmatter?.image;
		if (typeof image !== "string") return;
		tree.children.unshift({
			type: "mdxjsEsm",
			value: `import __cover from "${image}";\nexport const cover = __cover;`,
			data: {
				estree: {
					type: "Program",
					sourceType: "module",
					body: [
						{
							type: "ImportDeclaration",
							source: { type: "Literal", value: image },
							specifiers: [
								{
									type: "ImportDefaultSpecifier",
									local: { type: "Identifier", name: "__cover" },
								},
							],
						},
						{
							type: "ExportNamedDeclaration",
							specifiers: [],
							source: null,
							declaration: {
								type: "VariableDeclaration",
								kind: "const",
								declarations: [
									{
										type: "VariableDeclarator",
										id: { type: "Identifier", name: "cover" },
										init: { type: "Identifier", name: "__cover" },
									},
								],
							},
						},
					],
				},
			},
		});
	};
}

export const blog = defineCollections({
	type: "doc",
	dir: "content/blog",
	schema: ({ path }) => postSchema(path),
	// Feeds the /llms.mdx markdown mirrors via page.data.getText("processed").
	postprocess: { includeProcessedMarkdown: true },
});

// Global: a collection-level mdxOptions would drop the preset's default plugins.
export default defineConfig({
	mdxOptions: {
		remarkPlugins: (plugins) => [...plugins, remarkCoverExport],
		rehypeCodeOptions: {
			// A bare `theme` loses to the preset's dual `themes` in the shallow merge.
			themes: { light: codeTheme },
			defaultColor: "light",
			icon: false,
		},
	},
});
