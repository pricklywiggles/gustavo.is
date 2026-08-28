import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { blogMdxComponents } from "@/components/blog/blog-mdx-components";
import { BlogPostHero } from "@/components/blog/blog-post-hero";
import { GroundStrata } from "@/components/blog/ground-strata";
import { JsonLd } from "@/components/json-ld";
import { ScrollReset } from "@/components/scroll-reset";
import { SiteFooter } from "@/components/site-footer";
import { blogDateTime, formatBlogDate } from "@/lib/blog-date";
import { postSummary } from "@/lib/llms-content";
import { pageMetadata } from "@/lib/site-metadata";
import { blogSource } from "@/lib/source";
import { blogPostingJsonLd } from "@/lib/structured-data";

export function generateStaticParams() {
	return blogSource.getPages().map((page) => ({ slug: page.data.slug }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const page = blogSource.getPage([slug]);
	// Drafts 404 below, so their metadata must not leak into that response.
	if (!page || page.data.draft) return {};
	return pageMetadata({
		path: page.url,
		title: page.data.title,
		description: page.data.description,
		image: page.data.image
			? { url: page.data.image, alt: page.data.title }
			: "blog",
		article: {
			publishedTime: blogDateTime(page.data.date),
			tags: page.data.tags,
		},
		markdown: true,
	});
}

/**
 * One dark-earth surface end to end so arrival and the footer hand-off stay seamless
 * (the Unbroken Ground Rule); the hero owns the h1, authors start at h2.
 */
export default async function BlogPostPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const page = blogSource.getPage([slug]);
	if (!page || page.data.draft) notFound();

	const Mdx = page.data.body;

	return (
		<>
			<JsonLd data={blogPostingJsonLd(postSummary(page))} />
			<main
				data-curtain-target={page.url}
				data-surface="dusk-earth"
				className="bg-dusk-earth text-pale-dune"
			>
				<ScrollReset />
				<article>
					<BlogPostHero
						title={page.data.title}
						dateTime={blogDateTime(page.data.date)}
						dateLabel={formatBlogDate(page.data.date)}
						standfirst={page.data.description}
						tags={page.data.tags}
					/>
					{/* Content-width seam: full bleed here read as a wall between
					    title and body. The closing seam stays full bleed. */}
					<div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
						<div className="mx-auto max-w-[65ch]">
							<GroundStrata />
						</div>
					</div>
					<section className="mx-auto w-full max-w-3xl px-6 pt-14 pb-20 sm:px-8 sm:pt-16 sm:pb-24">
						<div className="blog-prose prose mx-auto">
							<Mdx components={blogMdxComponents} />
						</div>
					</section>
					<GroundStrata flip />
				</article>
			</main>
			{/* Sibling of <main>, never inside it (landmark demotion). */}
			<SiteFooter />
		</>
	);
}
