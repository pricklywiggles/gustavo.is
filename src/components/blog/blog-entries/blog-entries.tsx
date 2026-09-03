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
							entry.cover
								? "grid grid-cols-[1fr_auto] gap-x-4 sm:grid-cols-[7rem_1fr_auto] sm:gap-x-6"
								: "sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-6",
							FOCUS_RING.dark,
						)}
					>
						{/* Noon Sun holds 5.08:1 on the dark earth. */}
						<time
							dateTime={entry.dateTime}
							className="block font-medium text-[0.8125rem] text-noon-sun tracking-[0.01em] transition-colors duration-200 group-hover:text-sand-haze group-focus-visible:text-sand-haze sm:pt-1.5"
						>
							{entry.dateLabel}
						</time>
						<span
							className={cn(
								"mt-1.5 block sm:mt-0",
								entry.cover &&
									"col-start-1 row-start-2 sm:col-start-2 sm:row-start-1",
							)}
						>
							<h2 className="font-medium text-pale-dune text-xl leading-snug transition-colors duration-200 group-hover:text-first-light group-focus-visible:text-first-light">
								{entry.title}
							</h2>
							{entry.description ? (
								// line-clamp owns display (-webkit-box); a competing display kills it.
								<p className="mt-2 line-clamp-4 text-pale-dune/80 leading-relaxed transition-colors duration-200 group-hover:text-pale-dune group-focus-visible:text-pale-dune">
									{entry.description}
								</p>
							) : null}
						</span>
						{entry.cover ? (
							// Decorative in the list: the title is the link's name.
							<span className="col-start-2 row-span-2 row-start-1 self-start sm:col-start-3 sm:row-span-1">
								<Image
									src={entry.cover.src}
									width={entry.cover.width}
									height={entry.cover.height}
									alt=""
									sizes="6rem"
									className="size-20 rounded-lg object-cover sm:size-24"
								/>
							</span>
						) : null}
					</CurtainLink>
				</ScrollFadeIn>
			))}
		</ul>
	);
}
