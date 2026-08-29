import type { Ref } from "react";

type WarpStarfieldOverlayProps = {
	/** The sticky screen the starfield lands its words, astronaut, and cue in. */
	ref?: Ref<HTMLDivElement>;
	/**
	 * Headline that drops out of warp, as lines of word units; flattened order is the
	 * stagger order. Rendered as real DOM text each word reveals on landing.
	 */
	headline: string[][];
	/** Pops out of the lower-left once the headline settles; leans in the words' empty left. */
	astronautSrc?: string;
};

/**
 * The settled warp scene (headline, astronaut, scroll cue) in document flow: an absolute
 * track from the theater's lock, 200vh into the projects section, holding a sticky screen
 * for 25vh and then releasing it at page speed (FRA-185). That is the piecewise path the
 * starfield used to translate every frame, now drawn by the compositor: `200vh - x`
 * before the lock, `0` through it, `225vh - x` on the way out, with the showcase arriving
 * at 325vh. Reduced motion has no lock or spacer, so the track sits at the section's top
 * with zero stick. `WarpStarfield` reveals the pieces through the `data-*` hooks.
 */
export function WarpStarfieldOverlay({
	ref,
	headline,
	astronautSrc,
}: WarpStarfieldOverlayProps) {
	return (
		// Decorative: the section supplies the accessible heading; split spans would read
		// as one mashed word.
		<div
			aria-hidden="true"
			data-warp-overlay-track
			className="pointer-events-none absolute inset-x-0 top-0 h-screen motion-safe:top-[200vh] motion-safe:h-[125vh]"
		>
			<div ref={ref} className="sticky top-0 z-10 h-screen overflow-hidden">
				{astronautSrc && (
					// Width-relative and bottom-anchored so the astronaut-to-words proportion holds
					// at any viewport; the negative left tucks his backpack edge offscreen.
					<div className="absolute bottom-[10vw] left-[-1.5vw] w-[22.5vw] rotate-[16deg]">
						{/* The drift lives on its own layer so it never fights the pop transition below. */}
						<div className="motion-safe:animate-[float-bob_2.8s_ease-in-out_infinite_alternate]">
							{/* biome-ignore lint/performance/noImgElement: transform-animated
							    actor with its own transition; next/image's wrapper and
							    optimization pipeline add nothing for it. */}
							<img
								data-warp-astronaut
								src={astronautSrc}
								alt=""
								draggable={false}
								className="h-auto w-full [transform:translateY(160%)] [transition:transform_800ms_cubic-bezier(0.34,1.8,0.5,1)]"
							/>
						</div>
					</div>
				)}
				<div className="absolute inset-0 flex flex-col items-end justify-end pr-[1vw] pb-[4vh] text-right font-display text-pale-dune">
					{headline.map((line) => (
						<div
							key={line.join("-")}
							className="whitespace-nowrap text-[20vw] leading-[0.85]"
						>
							{line.map((word) => (
								<span
									key={word}
									data-warp-word
									className="inline-block opacity-0"
								>
									{word}
								</span>
							))}
						</div>
					))}
				</div>
				<div
					data-scroll-hint
					className="absolute bottom-[3vh] left-1/2 -translate-x-1/2 opacity-0 [transition:opacity_600ms_ease]"
				>
					{/* The bounce lives on a wrapper div: browsers often skip compositing CSS
					    animations applied to the svg element itself. */}
					<div className="motion-safe:animate-bounce">
						<svg
							viewBox="0 0 24 24"
							aria-hidden="true"
							className="size-8 text-pale-dune/70"
						>
							<path
								d="m6 9 6 6 6-6"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							/>
						</svg>
					</div>
				</div>
			</div>
		</div>
	);
}
