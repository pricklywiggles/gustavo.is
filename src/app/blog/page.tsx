import { BlogEntries, type BlogEntry } from "@/components/blog/blog-entries";
import { BlogHeader } from "@/components/blog/blog-header";
import { BlogHero } from "@/components/blog/blog-hero";
import { BLOG_PANO_SETTLED_VW } from "@/components/blog/blog-panorama-data";
import { SiteFooter } from "@/components/site-footer";
import { blogDateTime, formatBlogDate } from "@/lib/blog-date";
import { BLOG_DESCRIPTION } from "@/lib/site";
import { pageMetadata } from "@/lib/site-metadata";
import { coverOf, publishedPosts } from "@/lib/source";

export const metadata = pageMetadata({
	path: "/blog",
	title: "Blog",
	description: BLOG_DESCRIPTION,
	image: "blog",
});

export default function BlogIndexPage() {
	const entries: BlogEntry[] = publishedPosts().map((page) => ({
		url: page.url,
		title: page.data.title,
		description: page.data.description,
		dateTime: blogDateTime(page.data.date),
		dateLabel: formatBlogDate(page.data.date),
		cover: coverOf(page),
	}));

	return (
		<>
			<BlogHero />
			<BlogHeader />
			{/* Pale Dune on the dark ground (6.03:1; /80 muted holds 4.54:1). min-height
			    fills below the settled hero and the bar so no body background peeks. */}
			<main
				className="bg-dusk-earth text-pale-dune"
				style={{
					minHeight: `calc(100svh - ${BLOG_PANO_SETTLED_VW}vw - 4rem)`,
				}}
			>
				<div className="mx-auto max-w-3xl px-6 pb-24 sm:px-8">
					<header className="pt-16 pb-10 sm:pt-20 sm:pb-12">
						<h1 className="font-display text-3xl text-pale-dune sm:text-4xl">
							{/* The period is Noon Sun: the hero's disc, setting at the word's end. */}
							Blog<span className="text-noon-sun">.</span>
						</h1>
					</header>

					{entries.length === 0 ? (
						<p className="text-pale-dune/80">No posts yet.</p>
					) : (
						<BlogEntries entries={entries} />
					)}
				</div>
			</main>
			{/* Sibling of <main>, never inside it (landmark demotion); the footer carries
			    the same Dusk Earth so the ground runs unbroken to the bottom. */}
			<SiteFooter />
		</>
	);
}
