"use client";

import { AnimatePresence, domAnimation, LazyMotion, m } from "motion/react";
import { useEffect, useRef } from "react";
import { CurtainLink } from "@/components/curtain-link";
import { BELOW_MD, useMediaQuery } from "@/components/use-media-query";
import { useMounted } from "@/components/use-mounted";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { cta } from "@/lib/cta";
import type { Project } from "../projects-data";

function LinkArrow() {
	return (
		<svg
			viewBox="0 0 16 16"
			aria-hidden="true"
			className="size-3.5"
			fill="none"
			stroke="currentColor"
			strokeWidth="1.75"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" />
		</svg>
	);
}

const headingClass =
	"font-display text-[clamp(1.75rem,2.6vw,2.5rem)] text-pale-dune";

/**
 * One project's panel body. `measure` renders a height-only copy: the same boxes with
 * no heading, no image, and nothing focusable, for the tallest-project cell below.
 */
function ProjectPanel({
	project,
	measure = false,
}: {
	project: Project;
	measure?: boolean;
}) {
	return (
		<>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				{measure ? (
					<p className={headingClass}>{project.name}</p>
				) : (
					<h3 className={headingClass}>{project.name}</h3>
				)}
				{project.tech && (
					<span className="rounded-full border border-pale-dune/25 px-3 py-1 text-[0.8125rem] text-pale-dune/75">
						{project.tech}
					</span>
				)}
			</div>

			{/* Shaped to the asset's own ratio so it fills edge-to-edge; the height
			    cap keeps any ratio inside the locked panel. */}
			<div
				className="relative mt-6 w-full overflow-hidden rounded-xl border border-pale-dune/15 bg-white/[0.03]"
				style={{
					aspectRatio: project.imageRatio ?? 1.6,
					maxWidth: `min(100%, ${40 * (project.imageRatio ?? 1.6)}vh)`,
				}}
			>
				{/* Glyph and screenshot are absolute and add no height, so a measure copy
				    skips them: six eager image loads would buy nothing. */}
				{!measure && (
					<div className="absolute inset-0 grid place-items-center">
						<span
							aria-hidden="true"
							className="font-display text-[clamp(4rem,8vw,7rem)] text-pale-dune/10"
						>
							{project.name[0]}
						</span>
					</div>
				)}
				{!measure && project.image && (
					// biome-ignore lint/performance/noImgElement: runtime-swapped screenshot with onError degradation to the standby frame; next/image adds nothing here
					<img
						src={project.image}
						alt={`Screenshot of ${project.name}`}
						className="absolute inset-0 size-full bg-dusk-ink object-contain"
						style={
							project.imageBg ? { backgroundColor: project.imageBg } : undefined
						}
						onError={(event) => {
							event.currentTarget.style.display = "none";
						}}
					/>
				)}
			</div>

			<p className="mt-5 max-w-[58ch] text-base leading-[1.65] text-pale-dune/85">
				{project.description}
			</p>

			{project.links.length > 0 && (
				<div className="mt-6 flex flex-wrap gap-3">
					{project.links.map((link, li) => {
						const style = `${cta({ variant: li === 0 ? "solid" : "outline", tone: "dark" })} ${
							li === 0
								? "bg-pale-dune text-dusk-ink hover:bg-noon-sun"
								: "border-pale-dune/40 text-pale-dune hover:bg-pale-dune/10"
						}`;
						if (measure) {
							return (
								<span key={link.label} className={style}>
									{link.label}
									<LinkArrow />
								</span>
							);
						}
						// The retrospectives open behind CurtainLink's blinds.
						if (link.url?.startsWith("/")) {
							return (
								<CurtainLink key={link.label} href={link.url} className={style}>
									{link.label}
									<LinkArrow />
								</CurtainLink>
							);
						}
						return link.url ? (
							<a
								key={link.label}
								href={link.url}
								target="_blank"
								rel="noopener noreferrer"
								className={style}
							>
								{link.label}
								<LinkArrow />
							</a>
						) : (
							<button key={link.label} type="button" disabled className={style}>
								{link.label}
								<LinkArrow />
							</button>
						);
					})}
				</div>
			)}
		</>
	);
}

/**
 * Purely presentational: the section drives selection from scroll and the rail via the
 * [data-rail-fill] / [data-rail-tip] hooks (the work-history HUD convention).
 */
export function ProjectShowcase({
	projects,
	activeIndex,
	onSelect,
}: {
	projects: Project[];
	activeIndex: number;
	/** Jump the scrub to a project (the section owns the scroll math). */
	onSelect?: (index: number) => void;
}) {
	const reduced = useReducedMotionLive();
	const mounted = useMounted();
	const active = projects[activeIndex] ?? projects[0];

	// Layout-specific transition: a vertical rise beside the manifest on desktop, a
	// direction-aware horizontal slide when stacked (tab panes move sideways).
	const stacked = useMediaQuery(BELOW_MD);

	const previousIndex = useRef(activeIndex);
	const direction = activeIndex >= previousIndex.current ? 1 : -1;
	useEffect(() => {
		previousIndex.current = activeIndex;
	}, [activeIndex]);

	const variants = {
		enter: (dir: number) =>
			reduced
				? { opacity: 1 }
				: stacked
					? { opacity: 0, x: 28 * dir }
					: { opacity: 0, y: 18 },
		center: { opacity: 1, x: 0, y: 0 },
		exit: (dir: number) =>
			reduced
				? { opacity: 1 }
				: stacked
					? { opacity: 0, x: -28 * dir }
					: { opacity: 0, y: -14 },
	};

	return (
		<div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-[clamp(1.5rem,4vw,4rem)] md:flex-row md:items-center md:gap-[clamp(3rem,6vw,6rem)]">
			{/* The fill/tip tweens are orientation-matched by the section via gsap.matchMedia. */}
			<div className="flex shrink-0 flex-col gap-3 md:flex-row md:gap-[1.375rem] md:basis-[36%]">
				<div className="relative order-2 h-px w-full bg-pale-dune/15 md:order-1 md:h-auto md:w-px md:self-stretch">
					<div
						data-rail-fill
						className="absolute inset-0 origin-top-left bg-horizon-blaze [transform:scale(0,0)]"
					/>
					<div
						data-rail-tip
						className="absolute top-0 left-0 size-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-noon-sun shadow-[0_0_10px_2px_var(--color-horizon-blaze)]"
					/>
				</div>
				{/* Stacked layouts read as tabs: one row, always all six, sized by viewport
				    so they fit; desktop keeps the vertical manifest untouched. */}
				<ul className="order-1 flex w-full flex-nowrap items-end justify-between gap-2 md:order-2 md:w-auto md:flex-col md:items-start md:justify-center md:gap-[1.4rem]">
					{projects.map((project, i) => (
						<li key={project.name}>
							<button
								type="button"
								aria-current={i === activeIndex ? "true" : undefined}
								onClick={() => onSelect?.(i)}
								className={`origin-bottom font-display leading-none whitespace-nowrap text-[clamp(0.82rem,2.9vw,1.05rem)] [transition:transform_450ms_cubic-bezier(0.34,1.56,0.64,1),color_300ms_ease] motion-reduce:transition-none md:origin-left md:text-[clamp(2.7rem,2.6vw,3.6rem)] ${
									i === activeIndex
										? "text-pale-dune [transform:scale(1.4)] md:[transform:scale(1.1)]"
										: "text-pale-dune/50 hover:text-pale-dune/75"
								}`}
							>
								{project.name}
							</button>
						</li>
					))}
				</ul>
			</div>

			<div className="grid min-w-0 flex-1 items-start md:min-h-[min(32rem,85vh)]">
				<LazyMotion features={domAnimation}>
					<AnimatePresence mode="wait" initial={false} custom={direction}>
						<m.article
							key={active.name}
							className="col-start-1 row-start-1"
							custom={direction}
							variants={variants}
							initial="enter"
							animate="center"
							exit="exit"
							transition={{
								duration: reduced ? 0 : stacked ? 0.22 : 0.25,
								ease: [0.19, 1, 0.22, 1],
							}}
						>
							<ProjectPanel project={active} />
						</m.article>
					</AnimatePresence>
				</LazyMotion>
				{/* Client-only so the server HTML carries each description once (invariant 13); the
				    invisible stack sizes the cell to the tallest project so switches never jump.
				    md:hidden by measurement: at 844x390 the tallest cell would push every heading
				    above the fold (landing README, "Projects showcase panel"). */}
				{mounted &&
					projects.map((project) => (
						<div
							key={project.name}
							data-project-measure
							aria-hidden="true"
							inert
							className="invisible col-start-1 row-start-1 md:hidden"
						>
							<ProjectPanel project={project} measure />
						</div>
					))}
			</div>
		</div>
	);
}
