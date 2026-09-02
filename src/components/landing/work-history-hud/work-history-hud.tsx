"use client";

import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	m,
	type Variants,
} from "motion/react";
import { memo } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { OdometerNumber } from "@/components/landing/odometer-number";
import { useBelowSm } from "@/components/landing/use-below-sm";
import type { Stint } from "@/components/landing/work-history-data";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";

// Ruler geometry, shared with the scrub tween. RULER_LEAD ticks sit above the marker so
// the instrument reads as continuing past the chapter's first year.
export const RULER_PITCH = 12;
export const RULER_TICKS_PER_YEAR = 6;
export const RULER_LEAD = 4;
export const RULER_MARKER_TOP = RULER_LEAD * RULER_PITCH;
// Enough ticks below the marker to fill a tall viewport at any scrub position.
const RULER_TRAIL = 140;

/** Pixels the strip travels across a chapter's whole span. */
export function rulerTravel([from, to]: [number, number]): number {
	return (to - from) * RULER_TICKS_PER_YEAR * RULER_PITCH;
}

// mode="wait" holds the incoming mark until the outgoing one is gone, so the fixed box
// never holds two children; scale and opacity only, so the swap stays on the compositor.
const POP: Variants = {
	initial: { opacity: 0, scale: 0.6 },
	enter: {
		opacity: 1,
		scale: 1,
		transition: {
			scale: { type: "spring", bounce: 0.45, visualDuration: 0.4 },
			opacity: { duration: 0.15, ease: "easeOut" },
		},
	},
	exit: {
		opacity: 0,
		scale: 0.8,
		transition: { duration: 0.15, ease: "easeIn" },
	},
};

// The role caption wants less theatre than the marks: a plain fade.
const FADE: Variants = {
	initial: { opacity: 0 },
	enter: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
	exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

// A fixed box equalizes logos from 6.5:1 wordmarks to 1:1 glyphs and keeps downstream
// elements from shifting on stint change; below sm the boxes fit the 375px floor.
const COMPANY_BOX = "h-11 w-32 shrink-0 sm:w-40";
// Same fixed-box treatment; a name-only fallback covers stints whose art doesn't exist.
const PRODUCT_BOX = "h-11 w-28 shrink-0 sm:w-36";
// Same fixed height so all three boxes line up: the content is font-derived, so without
// it the bar's alignment drifts with the legend face. Hidden below sm (top-left dl).
const COUNTER_BOX =
	"ml-auto hidden h-11 shrink-0 flex-col justify-center text-right sm:flex";

// The ~200 identical ticks otherwise rebuild on every readout push into the HUD.
const RulerTicks = memo(function RulerTicks({ count }: { count: number }) {
	return (
		<>
			{Array.from({ length: count }, (_, i) => (
				<div
					// biome-ignore lint/suspicious/noArrayIndexKey: ticks are identical and never reorder
					key={i}
					className={
						(i - RULER_LEAD) % RULER_TICKS_PER_YEAR === 0
							? "h-px w-4 bg-dusk-ink/45"
							: "h-px w-2.5 bg-dusk-ink/25"
					}
				/>
			))}
		</>
	);
});

/**
 * Purely presentational: GSAP drives visibility and motion through the data-hud-* slot
 * containers, Motion only ever animates their children, keeping the two-library rule.
 * memo: inactive chapters get constant props, so scrub pushes re-render only the
 * active HUD.
 */
export const WorkHistoryHud = memo(function WorkHistoryHud({
	span,
	year,
	stint,
	usersTotal,
}: {
	/** The chapter's [first, last] year, which sizes the ruler. */
	span: [number, number];
	year: number;
	stint: Stint;
	usersTotal: number;
}) {
	const reducedMotion = useReducedMotionLive();
	// Both dl shells stay mounted as stable GSAP targets; only the active one mounts the
	// odometer, so three reel loops run instead of six (hydration caveat: use-below-sm.ts).
	const belowSm = useBelowSm();
	// No variants under reduced motion: AnimatePresence just replaces the node instantly.
	const pop = reducedMotion ? undefined : POP;
	const fade = reducedMotion ? undefined : FADE;
	const tickCount =
		RULER_LEAD + (span[1] - span[0]) * RULER_TICKS_PER_YEAR + RULER_TRAIL;
	return (
		<div className="pointer-events-none absolute inset-0">
			<LazyMotion features={domAnimation}>
				{/* The role reads as the year's caption; both answer "when/what was he then". */}
				<div
					data-hud-year
					className="absolute top-8 right-12 max-w-64 text-right"
				>
					{/* Two copies of the year (FRA-192). The hero copy is a static string laid
					    out at 37vw and only ever scaled DOWN (Safari rasters text at layout
					    size). The odometer stays untransformed in flow: its reels compute
					    travel from transform-inclusive rects, so any ancestor scale breaks the
					    spin. GSAP docks the string onto the odometer's glyph box and swaps
					    them; the string is white while large for legibility, ink by the swap.
					    Kerning off and tabular digits match the odometer's isolated digits. */}
					<div className="relative font-bold font-legend text-[clamp(2.25rem,3.4vw,3.25rem)] text-dusk-ink leading-none">
						<div data-hud-year-value>
							<AnimatedNumber
								data-hud-year-number
								format={{ useGrouping: false }}
							>
								{year}
							</AnimatedNumber>
						</div>
						<div
							data-hud-year-hero
							aria-hidden="true"
							className="absolute top-0 right-0 w-max origin-top-right text-[37vw] text-white leading-none tabular-nums [font-kerning:none] motion-safe:opacity-0"
						>
							{span[0]}
						</div>
					</div>
					{/* Keyed on the value so a title carrying across consecutive stints never
					    re-flashes. */}
					<p
						data-hud-role
						className="mt-2 text-balance font-bold font-legend text-[0.9375rem] text-dusk-earth uppercase leading-snug"
					>
						<AnimatePresence mode="wait" initial={false}>
							<m.span
								key={stint.role}
								className="inline-block"
								variants={fade}
								initial="initial"
								animate="enter"
								exit="exit"
							>
								{stint.role}
							</m.span>
						</AnimatePresence>
					</p>
				</div>

				{/* The bar's fixed boxes overflow a phone, so below sm the counter becomes its
				    own top-left instrument; GSAP arrives it with the role caption. */}
				<dl data-hud-counter className="absolute top-8 left-6 sm:hidden">
					<dt className="font-bold font-legend text-dusk-earth text-xs uppercase leading-snug">
						Total users reached
					</dt>
					<dd className="font-bold font-legend text-2xl text-dusk-earth leading-none">
						{belowSm && <OdometerNumber value={usersTotal} />}
					</dd>
				</dl>

				{/* Tick RULER_LEAD sits on the marker at the chapter's first year. */}
				<div className="absolute inset-y-0 right-0 w-10 overflow-hidden">
					<div
						data-hud-ruler
						className="absolute top-0 right-0 flex flex-col items-end pr-2"
						style={{ gap: `${RULER_PITCH - 1}px` }}
					>
						<RulerTicks count={tickCount} />
					</div>
					<div
						data-hud-marker
						className="absolute right-0 h-0.5 w-6 bg-dusk-ink"
						style={{ top: RULER_MARKER_TOP - 1 }}
					/>
				</div>

				{/* The right padding is asymmetric on purpose: it clears the ruler. */}
				<div data-hud-bar className="absolute inset-x-0 bottom-0">
					<div className="mx-auto flex max-w-6xl items-center gap-4 py-[clamp(0.75rem,1.6vh,1.25rem)] pr-16 pl-6 sm:gap-7 sm:pl-10">
						{/* Both marks hug the divider and the pop's origin sits on that edge, so
						    overshoot grows outward. Keys are the art: carried marks never re-pop. */}
						<div data-hud-slot className={COMPANY_BOX}>
							<AnimatePresence mode="wait" initial={false}>
								{stint.companyLogo ? (
									// biome-ignore lint/performance/noImgElement: fixed-box scene sprite; next/image adds nothing here
									<m.img
										key={stint.companyLogo}
										src={stint.companyLogo}
										alt={stint.company}
										className="h-full w-full object-contain object-right"
										style={{ transformOrigin: "100% 50%" }}
										variants={pop}
										initial="initial"
										animate="enter"
										exit="exit"
									/>
								) : (
									<m.span
										key={stint.company}
										className="flex h-full items-center justify-end font-semibold text-dusk-ink text-lg"
										style={{ transformOrigin: "100% 50%" }}
										variants={pop}
										initial="initial"
										animate="enter"
										exit="exit"
									>
										{stint.company}
									</m.span>
								)}
							</AnimatePresence>
						</div>

						{/* Grows upward on arrival, so the company reads as bracketing the product. */}
						<div
							data-hud-divider
							aria-hidden="true"
							className="h-11 w-1 shrink-0 origin-bottom rounded-full bg-dusk-earth/50"
						/>

						<div data-hud-slot className={PRODUCT_BOX}>
							<AnimatePresence mode="wait" initial={false}>
								{stint.productLogo ? (
									// biome-ignore lint/performance/noImgElement: fixed-box scene sprite; next/image adds nothing here
									<m.img
										key={stint.productLogo}
										src={stint.productLogo}
										alt={stint.product}
										className="h-full w-full object-contain object-left"
										style={{ transformOrigin: "0% 50%" }}
										variants={pop}
										initial="initial"
										animate="enter"
										exit="exit"
									/>
								) : (
									<m.span
										key={stint.product}
										className="flex h-full items-center font-semibold text-dusk-ink text-lg"
										style={{ transformOrigin: "0% 50%" }}
										variants={pop}
										initial="initial"
										animate="enter"
										exit="exit"
									>
										{stint.product}
									</m.span>
								)}
							</AnimatePresence>
						</div>

						{/* Right aligned so digits arriving through the count-up grow leftward
						    into open space instead of shoving the label along. */}
						<dl data-hud-slot className={COUNTER_BOX}>
							<dt className="font-bold font-legend text-[0.8125rem] text-dusk-earth uppercase leading-snug">
								Total users reached
							</dt>
							<dd className="font-bold font-legend text-[clamp(1.5rem,2vw,1.875rem)] text-dusk-earth leading-none">
								{!belowSm && <OdometerNumber value={usersTotal} />}
							</dd>
						</dl>
					</div>
				</div>
			</LazyMotion>
		</div>
	);
});
