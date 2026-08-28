"use client";

import { useReducedMotion } from "motion/react";
import { Ticker } from "motion-plus/react";
import {
	type RefObject,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import type { Technology } from "../retrospective-data";

function TechMark({ tech }: { tech: Technology }) {
	const mask = tech.icon
		? {
				maskImage: `url(${tech.icon})`,
				maskSize: "contain",
				maskRepeat: "no-repeat",
				maskPosition: "center",
				WebkitMaskImage: `url(${tech.icon})`,
				WebkitMaskSize: "contain",
				WebkitMaskRepeat: "no-repeat",
				WebkitMaskPosition: "center",
			}
		: undefined;

	return (
		<span className="flex select-none items-center gap-3 whitespace-nowrap">
			{mask ? (
				// Mask, not img: the marks render as one First Light family.
				<span
					aria-hidden="true"
					className="block size-8 shrink-0 bg-first-light/85"
					style={mask}
				/>
			) : null}
			<span className="font-medium text-first-light/85 text-lg">
				{tech.name}
			</span>
		</span>
	);
}

// The Ticker re-clones marks only when it re-measures, so the item list refreshes on
// this cadence instead of per frame; the per-frame rect reads are the feature.
const REQUERY_EVERY_FRAMES = 10;

// Owns the center-follow state, so caption swaps never re-render the Ticker band above.
function TickerCaption({
	technologies,
	band,
	reduced,
}: {
	technologies: Technology[];
	band: RefObject<HTMLDivElement | null>;
	reduced: boolean | null;
}) {
	const [activeIndex, setActiveIndex] = useState(0);
	const count = technologies.length;

	// The caption follows whichever mark is nearest the band's center line.
	useEffect(() => {
		if (reduced || typeof IntersectionObserver === "undefined") return;
		const bandEl = band.current;
		if (!bandEl) return;
		let raf = 0;
		let visible = false;
		let frame = 0;
		let items: HTMLElement[] = [];
		const centerOf = (r: DOMRect) => r.left + r.width / 2;
		const tick = () => {
			if (frame % REQUERY_EVERY_FRAMES === 0) {
				items = Array.from(
					bandEl.querySelectorAll<HTMLElement>("[data-tech-idx]"),
				);
			}
			frame++;
			const mid = centerOf(bandEl.getBoundingClientRect());
			let best: HTMLElement | null = null;
			let bestDist = Number.POSITIVE_INFINITY;
			for (const item of items) {
				// A clone detached by a Ticker re-measure rects to 0,0; skip it outright
				// until the next cadence query repairs the list.
				if (!item.isConnected) continue;
				const d = Math.abs(centerOf(item.getBoundingClientRect()) - mid);
				if (d < bestDist) {
					bestDist = d;
					best = item;
				}
			}
			const index = Number(best?.dataset.techIdx ?? 0) % count;
			setActiveIndex((prev) => (prev === index ? prev : index));
			if (visible) raf = requestAnimationFrame(tick);
		};
		const io = new IntersectionObserver(([entry]) => {
			visible = !!entry?.isIntersecting;
			cancelAnimationFrame(raf);
			if (visible) {
				frame = 0;
				raf = requestAnimationFrame(tick);
			}
		});
		io.observe(bandEl);
		return () => {
			io.disconnect();
			cancelAnimationFrame(raf);
		};
	}, [reduced, count, band]);

	const active = technologies[activeIndex] ?? technologies[0];
	if (!active) return null;

	return (
		<div className="mx-auto flex h-72 w-full max-w-3xl items-start justify-center px-6 pt-9">
			<div className="relative rounded-2xl bg-pale-dune px-7 py-5 text-center sm:px-9">
				<span
					aria-hidden="true"
					className="-top-2.5 -translate-x-1/2 absolute left-1/2 size-5 rotate-45 rounded-[3px] bg-pale-dune"
				/>
				<h3 className="font-medium text-dusk-ink text-xl leading-[1.3]">
					{active.name}
				</h3>
				<p className="mt-1 font-legend text-[0.8125rem] text-dusk-ink/70 tracking-[0.01em]">
					{active.type}
				</p>
				<p className="mx-auto mt-3 max-w-[56ch] text-base leading-[1.65] text-dusk-ink/85">
					{active.highlights.join(" · ")}
				</p>
			</div>
		</div>
	);
}

export function TechSection({ technologies }: { technologies: Technology[] }) {
	const reduced = useReducedMotion();
	// useReducedMotion is truthy on a reduced client's FIRST render while the server
	// rendered the ticker branch; SSR always takes the ticker, swapped pre-paint after mount.
	const [hydrated, setHydrated] = useState(false);
	useLayoutEffect(() => {
		setHydrated(true);
	}, []);
	const showStatic = hydrated && Boolean(reduced);
	const band = useRef<HTMLDivElement>(null);

	// A fresh element array per render would defeat any memoization inside Ticker.
	const items = useMemo(
		() =>
			technologies.map((tech, index) => (
				<span key={tech.name} data-tech-idx={index}>
					<TechMark tech={tech} />
				</span>
			)),
		[technologies],
	);

	if (technologies.length === 0) return null;

	return (
		<section
			data-surface="dusk-earth"
			className="overflow-hidden bg-dusk-earth"
		>
			{!showStatic ? (
				<>
					{/* Screen readers get the full ledger here; the band below is
					    presentation. The static branch carries its own text. */}
					<ul className="sr-only">
						{technologies.map((tech) => (
							<li key={tech.name}>
								{tech.name}, {tech.type}: {tech.highlights.join(". ")}
							</li>
						))}
					</ul>
					<div aria-hidden="true">
						<div ref={band} className="relative pt-24 md:pt-28">
							<Ticker
								className="w-full"
								velocity={40}
								hoverFactor={0.25}
								gap={72}
								fade="14%"
								items={items}
							/>
						</div>
						{/* Fixed-height stage: captions change length constantly, and the
						    footer must not ride up and down with them. */}
						<TickerCaption
							technologies={technologies}
							band={band}
							reduced={reduced}
						/>
					</div>
				</>
			) : (
				<div className="px-6 pt-24 pb-24 sm:px-10 md:pt-28 md:pb-32">
					<ul className="mx-auto flex w-full max-w-3xl flex-col gap-10">
						{technologies.map((tech) => (
							<li key={tech.name}>
								<h3 className="font-medium text-first-light text-xl leading-[1.3]">
									{tech.name}
								</h3>
								<p className="mt-1 font-legend text-[0.8125rem] text-noon-sun tracking-[0.01em]">
									{tech.type}
								</p>
								<p className="mt-3 max-w-[60ch] text-base leading-[1.7] text-first-light/85">
									{tech.highlights.join(" · ")}
								</p>
							</li>
						))}
					</ul>
				</div>
			)}
		</section>
	);
}
