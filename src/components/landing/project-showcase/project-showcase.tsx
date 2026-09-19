"use client";

import { domAnimation, LazyMotion, m } from "motion/react";
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

function ProjectPanel({ project }: { project: Project }) {
	return (
		<>
			<div className="flex flex-wrap items-center gap-x-4 gap-y-2">
				<h3 className={headingClass}>{project.name}</h3>
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
				{/* Glyph and screenshot are absolute and add no height. */}
				<div className="absolute inset-0 grid place-items-center">
					<span
						aria-hidden="true"
						className="font-display text-[clamp(4rem,8vw,7rem)] text-pale-dune/10"
					>
						{project.name[0]}
					</span>
				</div>
				{project.image && (
					// biome-ignore lint/performance/noImgElement: fixed-box screenshot with onError degradation to the standby glyph; next/image adds nothing here
					<img
						src={project.image}
						alt={`Screenshot of ${project.name}`}
						loading="lazy"
						decoding="async"
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

export function ProjectShowcase({
	projects,
	activeIndex,
	onSelect,
}: {
	projects: Project[];
	activeIndex: number;
	onSelect?: (index: number) => void;
}) {
	const reduced = useReducedMotionLive();
	const mounted = useMounted();
	const active = projects[activeIndex] ?? projects[0];

	const stacked = useMediaQuery(BELOW_MD);
	const duration = reduced ? 0 : stacked ? 0.22 : 0.25;
	// Every project stays mounted once hydrated: a remounted img refetches its file (max-age=0
	// on Vercel), so the old AnimatePresence swap showed an empty frame for the round trip.
	// The server HTML carries only the staged project (FRA-183); the active key is stable
	// across the flip, so hydration keeps its element.
	const panels = mounted ? projects : [active];
	// Earlier projects rest where an exit leaves them, later ones where an entrance starts,
	// so a scrub in either direction reads as the old sequenced enter and exit.
	const hidden = (index: number) => {
		if (reduced) return { opacity: 0, x: 0, y: 0 };
		const before = index < activeIndex;
		return stacked
			? { opacity: 0, x: before ? -28 : 28, y: 0 }
			: { opacity: 0, x: 0, y: before ? -14 : 18 };
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

			{/* overflow-x-clip: the resting x offsets would otherwise widen the page on a phone. */}
			<div className="grid min-w-0 flex-1 items-start overflow-x-clip md:min-h-[min(32rem,85vh)]">
				<LazyMotion features={domAnimation}>
					{panels.map((project) => {
						const index = projects.indexOf(project);
						const shown = project === active;
						return (
							/* Below md the stack sizes the cell to the tallest project so a switch moves
							   nothing (FRA-189); from md the hidden ones leave the flow, since at 844x390
							   the tallest cell would push every heading above the fold. */
							<m.article
								key={project.name}
								aria-hidden={shown ? undefined : true}
								inert={!shown}
								className={
									shown
										? "col-start-1 row-start-1"
										: "pointer-events-none col-start-1 row-start-1 md:absolute md:inset-x-0 md:top-0"
								}
								variants={{
									shown: { opacity: 1, x: 0, y: 0 },
									hidden: hidden(index),
								}}
								initial={false}
								animate={shown ? "shown" : "hidden"}
								transition={{
									duration,
									ease: [0.19, 1, 0.22, 1],
									// The entrance waits for the exit, as the old mode="wait" swap did.
									delay: shown ? duration : 0,
								}}
							>
								<ProjectPanel project={project} />
							</m.article>
						);
					})}
				</LazyMotion>
			</div>
		</div>
	);
}
