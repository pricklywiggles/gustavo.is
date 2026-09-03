import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import { CurtainLink } from "@/components/curtain-link";
import { ScrollFadeIn } from "@/components/scroll-fade-in";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import type { PostCover } from "@/lib/post-cover";

/** Contrast on Dusk Earth: eyebrow 5.08, title 6.03, standfirst 4.88; 65ch matches the article. */
export function BlogPostHero({
	title,
	dateTime,
	dateLabel,
	standfirst,
	tags,
	cover,
}: {
	title: string;
	dateTime: string;
	dateLabel: string;
	standfirst?: string;
	tags: string[];
	cover?: PostCover;
}) {
	const tagsDelay = standfirst ? 0.22 : 0.16;
	const coverDelay = tags.length > 0 ? tagsDelay + 0.06 : tagsDelay;
	return (
		<header className="bg-dusk-earth">
			{/* pt-28 clears the overlaid riding bar, like the retro hero. */}
			<div className="mx-auto w-full max-w-3xl px-6 pt-28 pb-12 sm:px-8 sm:pt-32 sm:pb-14">
				<div className="mx-auto max-w-[65ch]">
					{/* Flex row keeps the chevron, dot, and date on one axis; inline-flex alone
					    knocked the link off the line's baseline. */}
					<ScrollFadeIn
						as="p"
						className="flex items-center gap-x-2 font-legend text-[0.8125rem] text-noon-sun tracking-[0.01em]"
					>
						<CurtainLink
							href="/blog"
							className={`inline-flex items-center gap-1 rounded-sm transition-colors duration-150 hover:text-sand-haze ${FOCUS_OUTLINE.dark}`}
						>
							<ChevronLeft aria-hidden="true" className="-ml-0.5 size-3.5" />
							Blog
						</CurtainLink>
						<span aria-hidden="true">·</span>
						<time dateTime={dateTime}>{dateLabel}</time>
					</ScrollFadeIn>
					<ScrollFadeIn
						as="h1"
						delay={0.08}
						className="mt-6 text-balance font-display text-[clamp(2rem,4.5vw,3rem)] text-pale-dune leading-[1.1] tracking-[-0.01em]"
					>
						{title}
					</ScrollFadeIn>
					{standfirst ? (
						<ScrollFadeIn
							as="p"
							delay={0.16}
							className="mt-6 text-lg text-pale-dune/85 leading-[1.6]"
						>
							{standfirst}
						</ScrollFadeIn>
					) : null}
					{tags.length > 0 ? (
						<ScrollFadeIn
							as="ul"
							delay={tagsDelay}
							className="mt-7 flex flex-wrap gap-2"
						>
							{tags.map((tag) => (
								<li
									key={tag}
									className="rounded-full border border-pale-dune/30 px-3 py-1 font-medium text-[0.8125rem] text-pale-dune/85 tracking-[0.01em]"
								>
									{tag}
								</li>
							))}
						</ScrollFadeIn>
					) : null}
					{cover ? (
						<ScrollFadeIn as="figure" delay={coverDelay} className="mt-10">
							{/* Above the fold on every post, so it loads eagerly. */}
							<Image
								src={cover.src}
								width={cover.width}
								height={cover.height}
								alt={cover.alt}
								priority
								sizes="(min-width: 48rem) 42rem, 100vw"
								className="h-auto w-full rounded-xl"
							/>
						</ScrollFadeIn>
					) : null}
				</div>
			</div>
		</header>
	);
}
