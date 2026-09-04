import Image from "next/image";
import { CurtainLink } from "@/components/curtain-link";
import { ScrollFadeIn } from "@/components/scroll-fade-in";
import { FOCUS_RING } from "@/lib/focus-ring";
import type { PostCover } from "@/lib/post-cover";
import { cn } from "@/lib/utils";

export type BlogEntry = {
	url: string;
	title: string;
	description?: string;
	dateTime: string;
	/** Pre-formatted: the server owns locale and timezone. */
	dateLabel: string;
	cover?: PostCover;
};

/** Past the first viewport, entries rise with no delay instead of waiting out their index. */
const STAGGER_BATCH = 4;

/** 16:9 and wider lose at most 7% to the OG-shaped frame's crop; taller covers would lose
 * their subject, so they sit inside the frame at full height instead. */
export function coverFillsFrame(cover: PostCover) {
	return cover.width / cover.height >= 16 / 9;
}

/** Rests visible from the server, so the list reads with JavaScript disabled. */
export function BlogEntries({ entries }: { entries: BlogEntry[] }) {
	return (
		<ul className="flex flex-col gap-2">
			{entries.map((entry, index) => (
				<ScrollFadeIn
					as="li"
					key={entry.url}
					delay={index < STAGGER_BATCH ? index * 0.07 : 0}
				>
					{/* On hover/focus the muted roles MUST brighten with the wash: the resting
					    opacities fall under AA on the lightened ground (3.74:1, 4.06:1); the
					    stepped set holds 5.71 / 4.82 / 5.16. Negative margins bleed the wash
					    past the text column while the type stays on grid. */}
					<CurtainLink
						href={entry.url}
						className={cn(
							"-mx-5 group block rounded-xl p-5 transition-colors duration-200 hover:bg-pale-dune/10 focus-visible:bg-pale-dune/10 sm:-mx-6 sm:p-6",
							"sm:grid sm:gap-x-6",
							entry.cover
								? "sm:grid-cols-[7rem_1fr_14rem]"
								: "sm:grid-cols-[7rem_1fr]",
							FOCUS_RING.dark,
						)}
					>
						{entry.cover ? (
							// The frame is the OG card's shape, so the width the browser renders is the
							// width it fetches: no crop, no upscale. Bare ground behind it, so a
							// transparent cover reads as art on the earth, never as a boxed picture.
							<div className="mb-4 aspect-[1200/630] overflow-hidden rounded-lg sm:col-start-3 sm:row-start-1 sm:mb-0 sm:self-start">
								{/* Decorative in the list: the title is the link's name. */}
								<Image
									src={entry.cover.src}
									width={entry.cover.width}
									height={entry.cover.height}
									alt=""
									priority={index === 0}
									sizes="(min-width: 40rem) 14rem, 100vw"
									className={cn(
										"size-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-safe:group-hover:scale-[1.03] motion-safe:group-focus-visible:scale-[1.03]",
										coverFillsFrame(entry.cover)
											? "object-cover"
											: "object-contain",
									)}
								/>
							</div>
						) : null}
						{/* Noon Sun holds 5.08:1 on the dark earth. */}
						<time
							dateTime={entry.dateTime}
							className="block font-medium text-[0.8125rem] text-noon-sun tracking-[0.01em] transition-colors duration-200 group-hover:text-sand-haze group-focus-visible:text-sand-haze sm:col-start-1 sm:row-start-1 sm:pt-1.5"
						>
							{entry.dateLabel}
						</time>
						<div className="mt-1.5 sm:col-start-2 sm:row-start-1 sm:mt-0">
							<h2 className="font-medium text-pale-dune text-xl leading-snug transition-colors duration-200 group-hover:text-first-light group-focus-visible:text-first-light">
								{entry.title}
							</h2>
							{entry.description ? (
								// line-clamp owns display (-webkit-box); a competing display kills it.
								<p className="mt-2 line-clamp-4 text-pale-dune/80 leading-relaxed transition-colors duration-200 group-hover:text-pale-dune group-focus-visible:text-pale-dune">
									{entry.description}
								</p>
							) : null}
						</div>
					</CurtainLink>
				</ScrollFadeIn>
			))}
		</ul>
	);
}
