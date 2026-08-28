import { CurtainLink } from "@/components/curtain-link";
import { ScrollFadeIn } from "@/components/scroll-fade-in";
import { FOCUS_RING } from "@/lib/focus-ring";

export type BlogEntry = {
	url: string;
	title: string;
	description?: string;
	/** ISO date for the <time> element. */
	dateTime: string;
	/** Pre-formatted label; the server owns locale and timezone. */
	dateLabel: string;
};

/**
 * Only the entries sharing the first viewport stagger as a batch; a lone entry deep in
 * the list rises immediately instead of waiting out its absolute position.
 */
const STAGGER_BATCH = 4;

/**
 * Server component: the resting state is what the server renders, so the list reads
 * with JavaScript disabled; ScrollFadeIn adds the rise after mount.
 */
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
						className={`-mx-5 group block rounded-xl p-5 transition-colors duration-200 hover:bg-pale-dune/10 focus-visible:bg-pale-dune/10 sm:-mx-6 sm:grid sm:grid-cols-[7rem_1fr] sm:gap-x-6 sm:p-6 ${FOCUS_RING.dark}`}
					>
						{/* Noon Sun holds 5.08:1 on the dark earth. */}
						<time
							dateTime={entry.dateTime}
							className="block font-medium text-[0.8125rem] text-noon-sun tracking-[0.01em] transition-colors duration-200 group-hover:text-sand-haze group-focus-visible:text-sand-haze sm:pt-1.5"
						>
							{entry.dateLabel}
						</time>
						<span className="mt-1.5 block sm:mt-0">
							<h2 className="font-medium text-pale-dune text-xl leading-snug transition-colors duration-200 group-hover:text-first-light group-focus-visible:text-first-light">
								{entry.title}
							</h2>
							{entry.description ? (
								// No display class: line-clamp owns display (-webkit-box); a competing
								// display kills the clamp.
								<p className="mt-2 line-clamp-4 text-pale-dune/80 leading-relaxed transition-colors duration-200 group-hover:text-pale-dune group-focus-visible:text-pale-dune">
									{entry.description}
								</p>
							) : null}
						</span>
					</CurtainLink>
				</ScrollFadeIn>
			))}
		</ul>
	);
}
