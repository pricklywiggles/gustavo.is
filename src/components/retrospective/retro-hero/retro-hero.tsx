import { PonderLogo } from "@/components/icons";
import { ScrollingMural } from "@/components/retrospective/scrolling-mural";
import { ScrollFadeIn } from "@/components/scroll-fade-in";
import type { Retrospective } from "../retrospective-data";

/** The old site's treatment: the mural runs full strength behind a hard slanted edge, no scrims. */
export function RetroHero({ retrospective }: { retrospective: Retrospective }) {
	const { tagline, wordmarkSuffix, contributions, years, mural } =
		retrospective;

	return (
		<section
			data-surface="dusk-earth"
			// clip, not hidden: the tilted mural plane must not add scroll range.
			className="relative isolate overflow-clip bg-dusk-earth"
		>
			<div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col justify-center px-6 pt-28 pb-14 sm:px-10 md:min-h-[74svh] md:py-32">
				<div className="md:max-w-[min(28rem,calc(42vw-3rem))] lg:max-w-[min(32rem,calc(42vw-5rem))]">
					<ScrollFadeIn
						as="p"
						className="font-legend text-[0.8125rem] tracking-[0.01em] text-noon-sun"
					>
						Retrospective, {years}
					</ScrollFadeIn>
					<ScrollFadeIn as="h1" delay={0.08} className="mt-6">
						<span className="flex items-baseline gap-3">
							<PonderLogo className="block h-[clamp(2.75rem,6vw,4rem)] w-auto" />
							<span className="sr-only">Ponder</span>
							{wordmarkSuffix ? (
								<span className="font-display text-[#ff7979] text-[clamp(2rem,4.5vw,3rem)] leading-none">
									{wordmarkSuffix}
								</span>
							) : null}
						</span>
						<span className="mt-4 block text-balance font-display text-[clamp(1.5rem,3.2vw,2.25rem)] leading-[1.15] text-first-light">
							{tagline}
						</span>
					</ScrollFadeIn>
					<ScrollFadeIn
						as="p"
						delay={0.16}
						className="mt-7 max-w-[44ch] text-base leading-[1.6] text-first-light/75"
					>
						<span className="font-medium text-noon-sun">Contributions:</span>{" "}
						{contributions}
					</ScrollFadeIn>
				</div>
			</div>

			{/* Inset below the bar so the transparent header never sits on the
			    light tiles; the slanted edge echoes the plane's own tilt. */}
			<ScrollingMural
				src={mural}
				className="h-72 w-full sm:h-80 md:absolute md:top-16 md:right-0 md:bottom-0 md:h-auto md:w-[min(56vw,700px)] md:[clip-path:polygon(18%_0,100%_0,100%_100%,0_100%)]"
			/>
		</section>
	);
}
