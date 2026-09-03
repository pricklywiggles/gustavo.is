import type { Ref } from "react";

type WarpStarfieldOverlayProps = {
	ref?: Ref<HTMLDivElement>;
	/** Lines of words; the flattened order is the flight stagger order. */
	headline: string[][];
	astronautSrc?: string;
};

/** The compositor draws the track the starfield once translated per frame (FRA-185). */
export function WarpStarfieldOverlay({
	ref,
	headline,
	astronautSrc,
}: WarpStarfieldOverlayProps) {
	return (
		// aria-hidden: the section owns the heading; split spans read as one mashed word.
		<div
			aria-hidden="true"
			data-warp-overlay-track
			className="pointer-events-none absolute inset-x-0 top-0 h-screen motion-safe:top-[200vh] motion-safe:h-[125vh]"
		>
			<div ref={ref} className="sticky top-0 z-10 h-screen overflow-hidden">
				{astronautSrc && (
					// Sized in vw against the 20vw words; the negative left tucks the backpack offscreen.
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
