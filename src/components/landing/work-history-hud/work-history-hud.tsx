"use client";

import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	m,
	type Variants,
} from "motion/react";
import { memo, useMemo } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { OdometerNumber } from "@/components/landing/odometer-number";
import { useBelowSm } from "@/components/landing/use-below-sm";
import type { Stint } from "@/components/landing/work-history-data";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";

// RULER_LEAD ticks above the marker so the ruler reads as continuing past year one.
export const RULER_PITCH = 12;
export const RULER_TICKS_PER_YEAR = 6;
export const RULER_LEAD = 4;
export const RULER_MARKER_TOP = RULER_LEAD * RULER_PITCH;
// Enough ticks below the marker to fill a tall viewport at any scrub position.
const RULER_TRAIL = 140;

export function rulerTravel([from, to]: [number, number]): number {
	return (to - from) * RULER_TICKS_PER_YEAR * RULER_PITCH;
}

// Scale and opacity only: the swap stays on the compositor. Marks never unmount (a
// remounted img refetches its file and pops pixel-less), so the pop waits out the fade.
const SWAP_OUT = 0.15;
const POP: Variants = {
	hidden: {
		opacity: 0,
		scale: 0.8,
		transition: { duration: SWAP_OUT, ease: "easeIn" },
	},
	shown: {
		opacity: 1,
		scale: [0.6, 1],
		// A value's own transition replaces the variant's, so each carries the delay.
		transition: {
			scale: {
				type: "spring",
				bounce: 0.45,
				visualDuration: 0.4,
				delay: SWAP_OUT,
			},
			opacity: { duration: 0.15, ease: "easeOut", delay: SWAP_OUT },
		},
	},
};

const FADE: Variants = {
	initial: { opacity: 0 },
	enter: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
	exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

// Fixed slot: marks run 6.5:1 to 1:1, the counter must not shift; w-40 fits 375px phones.
const COMPANY_BOX = "relative h-13.75 w-40 shrink-0 sm:w-50";
// Padding tracks viewport height from sm, so a landscape phone still fits the plate.
const PRODUCT_PLATE =
	"rounded-[2.5rem] bg-pale-dune/60 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.55)] ring-1 ring-white/40 backdrop-blur-md sm:p-[clamp(1.5rem,4.5vh,2.5rem)]";
// Same height as the mark slot: font-derived content would drift with the legend face.
const COUNTER_BOX =
	"ml-auto hidden h-13.75 shrink-0 flex-col justify-center text-right sm:flex";

type Mark = {
	key: string;
	label: string;
	src?: string;
	width?: number;
	height?: number;
};

const productMark = (stint: Stint): Mark => ({
	key: stint.productLogo ?? stint.product,
	label: stint.product,
	src: stint.productLogo,
});

const companyMark = (stint: Stint): Mark => ({
	key: stint.companyLogo?.src ?? stint.company,
	label: stint.company,
	...stint.companyLogo,
});

// One element per distinct art: a mark carried across stints keeps it and never re-pops.
function distinctMarks(
	stints: readonly Stint[],
	toMark: (stint: Stint) => Mark,
): Mark[] {
	const seen = new Set<string>();
	return stints.flatMap((stint) => {
		const mark = toMark(stint);
		if (seen.has(mark.key)) return [];
		seen.add(mark.key);
		return [mark];
	});
}

// The active mark pops in; the rest wait hidden and out of the accessibility tree.
function MarkStack({
	marks,
	active,
	variants,
	imgClassName,
	textClassName,
}: {
	marks: Mark[];
	active: string;
	variants: Variants | undefined;
	imgClassName: string;
	textClassName: string;
}) {
	return marks.map((mark) => {
		const shown = mark.key === active;
		const motion = {
			variants,
			initial: false as const,
			animate: shown ? "shown" : "hidden",
			"aria-hidden": shown ? undefined : true,
		};
		return mark.src ? (
			// biome-ignore lint/performance/noImgElement: fixed-box scene sprite; next/image adds nothing here
			<m.img
				key={mark.key}
				src={mark.src}
				width={mark.width}
				height={mark.height}
				alt={mark.label}
				loading="lazy"
				decoding="async"
				className={imgClassName}
				{...motion}
			/>
		) : (
			<m.span key={mark.key} className={textClassName} {...motion}>
				{mark.label}
			</m.span>
		);
	});
}

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

// GSAP drives the data-hud-* containers, Motion only their children (two-library rule).
// memo pays off because inactive chapters get constant props during a scrub.
export const WorkHistoryHud = memo(function WorkHistoryHud({
	span,
	stints,
	year,
	stint,
	usersTotal,
}: {
	/** [first, last] year. */
	span: [number, number];
	/** Every stint of the chapter: each distinct mark stays mounted across swaps. */
	stints: readonly Stint[];
	year: number;
	stint: Stint;
	usersTotal: number;
}) {
	const reducedMotion = useReducedMotionLive();
	// Both counter shells stay mounted as GSAP targets; only the active one runs reels.
	const belowSm = useBelowSm();
	const pop = reducedMotion ? undefined : POP;
	const fade = reducedMotion ? undefined : FADE;
	const products = useMemo(() => distinctMarks(stints, productMark), [stints]);
	const companies = useMemo(() => distinctMarks(stints, companyMark), [stints]);
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

				{/* Where the reader looks. Sized at rest (Safari rasters at layout size). Every
				    mark of the chapter stays mounted: a remounted img refetches its file and
				    pops pixel-less, a gap Gecko paints as the alt text. */}
				<div
					data-hud-product
					className="absolute inset-0 flex items-center justify-center"
				>
					{/* The marks span every palette; a frosted plate in the band's surface color
					    keeps each one from clashing with or vanishing into its city. */}
					<div className={PRODUCT_PLATE}>
						<div className="relative h-[clamp(4rem,20vh,12rem)] w-[min(72vw,34rem)]">
							<MarkStack
								marks={products}
								active={productMark(stint).key}
								variants={pop}
								imgClassName="absolute inset-0 h-full w-full object-contain"
								textClassName="absolute inset-0 flex items-center justify-center text-center font-bold font-display text-[clamp(1.75rem,4vw,3.5rem)] text-white leading-none"
							/>
						</div>
					</div>
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
						{/* width/height give the ratio before load, so the slot lays out at the
						    final width; the stack never remounts a mark (see the product layer). */}
						<div data-hud-slot className={COMPANY_BOX}>
							<MarkStack
								marks={companies}
								active={companyMark(stint).key}
								variants={pop}
								imgClassName="absolute inset-y-0 left-0 h-full w-auto max-w-full object-contain"
								textClassName="absolute inset-0 flex items-center font-semibold text-dusk-ink text-lg"
							/>
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
