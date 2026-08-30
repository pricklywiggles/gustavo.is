"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	Fragment,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import { CityLedger } from "@/components/landing/city-ledger";
import {
	attachCloudSway,
	attachVessels,
	buildCascade,
	buildDusk,
	buildOutroClose,
	buildParallaxShift,
	buildSceneExit,
	buildSunset,
	buildSurfaceReveal,
	buildYearCues,
	setLayersBeforeEntrance,
} from "@/components/landing/panorama-phases";
import { PanoramaScene } from "@/components/landing/panorama-scene";
import {
	SCRUB_VH_PER_YEAR,
	stageWindow,
	storyPhases,
} from "@/components/landing/story-phases";
import {
	CHAPTERS,
	type CityChapter,
	carriedUsersBefore,
	cumulativeUsersAt,
	stintIndexAt,
} from "@/components/landing/work-history-data";
import {
	rulerTravel,
	WorkHistoryHud,
} from "@/components/landing/work-history-hud";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { RAMP_HEX } from "@/lib/ramp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Line 1 of the quote leads in while the section is still scrolling into view.
const LINE1_LEAD_VH = 0.5;

// Near full-bleed: the year is the whole frame when a city opens.
const YEAR_HERO_WIDTH = 0.85;

// GSAP can't interpolate the theme's oklch() strings; the ink drift uses the ramp's sRGB twins.
const INK_HEX = RAMP_HEX["dusk-ink"];
const EARTH_HEX = RAMP_HEX["dusk-earth"];

// Headroom so the counter's inner edge clears the frame instead of kissing the corner.
const FLYTHROUGH_MARGIN = 1.15;
// Filters apply in element space, so on-screen blur is this times the live scale: about a
// source pixel, the same order as the rasterized blocks it exists to hide.
const FLYTHROUGH_BLUR_PX = 0.8;
const FLYTHROUGH_FALLBACK = 200;

// Optical centre of the "o" counter. A split char's box is a whole line box, so the ink
// centre must come from font metrics.
function counterPoint(line: HTMLElement): { x: number; y: number } | null {
	const o = gsap.utils
		.toArray<HTMLElement>(line.querySelectorAll(".split-char"))
		.find((c) => c.textContent === "o");
	const ctx = document.createElement("canvas").getContext("2d");
	if (!o || !ctx) return null;
	const cs = getComputedStyle(line);
	ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
	const m = ctx.measureText("o");
	if (!m.actualBoundingBoxAscent || !m.fontBoundingBoxAscent) return null;
	const box = o.getBoundingClientRect();
	const leading =
		(box.height - (m.fontBoundingBoxAscent + m.fontBoundingBoxDescent)) / 2;
	const baseline = box.top + leading + m.fontBoundingBoxAscent;
	return {
		x: box.left + box.width / 2,
		y: baseline - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
	};
}

// Scaling about the counter sends the viewer through the hole.
function counterOrigin(line: HTMLElement): string {
	const point = counterPoint(line);
	if (!point) return "50% 50%";
	const box = line.getBoundingClientRect();
	return `${point.x - box.left}px ${point.y - box.top}px`;
}

// Measured, not assumed: Kitora's "o" is nearly solid, a 0.05em pinhole, hence the
// hundreds-scale fly-through. Cached because only the face can change it.
const counterExtents = (() => {
	const cache = new Map<string, { a: number; b: number } | null>();
	return (weight: string, family: string) => {
		const key = `${weight}|${family}`;
		const hit = cache.get(key);
		if (hit !== undefined) return hit;
		const size = 400;
		const canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;
		const ctx = canvas.getContext("2d", { willReadFrequently: true });
		let value: { a: number; b: number } | null = null;
		if (ctx) {
			const em = size * 0.6;
			ctx.font = `${weight} ${em}px ${family}`;
			ctx.textBaseline = "alphabetic";
			const m = ctx.measureText("o");
			const originX = 20;
			const originY = em;
			ctx.fillText("o", originX, originY);
			const data = ctx.getImageData(0, 0, size, size).data;
			const opaque = (x: number, y: number) =>
				data[(y * size + x) * 4 + 3] > 20;
			const cx = Math.round(
				originX + (m.actualBoundingBoxRight - m.actualBoundingBoxLeft) / 2,
			);
			const cy = Math.round(
				originY - (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
			);
			if (!opaque(cx, cy)) {
				let a = 0;
				while (cx + a < size && !opaque(cx + a, cy)) a++;
				let b = 0;
				while (cy + b < size && !opaque(cx, cy + b)) b++;
				if (a > 0 && b > 0) value = { a: a / em, b: b / em };
			}
		}
		cache.set(key, value);
		return value;
	};
})();

// Computed rather than pinned: the type size clamps while the viewport does not.
function flythroughScale(line: HTMLElement, section: HTMLElement): number {
	const point = counterPoint(line);
	const cs = getComputedStyle(line);
	const extents = counterExtents(cs.fontWeight, cs.fontFamily);
	if (!point || !extents) return FLYTHROUGH_FALLBACK;
	const size = parseFloat(cs.fontSize);
	const a = extents.a * size;
	const b = extents.b * size;
	const box = section.getBoundingClientRect();
	let needed = 0;
	for (const x of [box.left, box.right]) {
		for (const y of [box.top, box.bottom]) {
			needed = Math.max(
				needed,
				Math.hypot((x - point.x) / a, (y - point.y) / b),
			);
		}
	}
	return needed * FLYTHROUGH_MARGIN;
}

// Rect with the live GSAP transform neutralized, so measured offsets never compound it.
function untransformedRect(el: HTMLElement): DOMRect {
	const previous = el.style.transform;
	el.style.transform = "none";
	const rect = el.getBoundingClientRect();
	el.style.transform = previous;
	return rect;
}

type ChapterCues = {
	yearInAt: number;
	yearInLen: number;
	yearDockAt: number;
	yearDockLen: number;
	hudInAt: number;
	hudInLen: number;
};

// Offsets are functions so a resize re-measures instead of stranding the year mid-flight;
// queries scope to this chapter's HUD root, since each chapter owns its instrument DOM.
function buildHudEntrance(
	root: HTMLElement,
	section: HTMLElement,
	tl: gsap.core.Timeline,
	cue: ChapterCues,
) {
	const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
	const yearValue = q("[data-hud-year-value]");
	const role = q("[data-hud-role]");
	const counter = q("[data-hud-counter]");
	const marker = q("[data-hud-marker]");
	const divider = q("[data-hud-divider]");
	const ticks = gsap.utils.toArray<HTMLElement>(
		root.querySelectorAll("[data-hud-ruler] > *"),
	);
	// Document order runs left to right across the bar; the stagger leans on it.
	const barItems = gsap.utils.toArray<HTMLElement>(
		root.querySelectorAll("[data-hud-bar] [data-hud-slot]"),
	);
	if (!yearValue) return;

	// Measured against the section, never the viewport: these run during ScrollTrigger
	// refresh, while pins are reverted. The section is viewport-sized, so its center is
	// the screen center once the pin re-engages.
	// One measurement shared across a refresh pass's six start/end evaluations: each
	// untransformedRect is a write-read-write reflow, so uncached they thrash layout.
	let measured: { rect: DOMRect; host: DOMRect } | null = null;
	const measure = () => {
		if (!measured) {
			measured = {
				rect: untransformedRect(yearValue),
				host: section.getBoundingClientRect(),
			};
			queueMicrotask(() => {
				measured = null;
			});
		}
		return measured;
	};
	const heroScale = () => {
		const { rect, host } = measure();
		return rect.width > 0 ? (host.width * YEAR_HERO_WIDTH) / rect.width : 1;
	};
	const heroX = () => {
		const { rect, host } = measure();
		return host.left + host.width / 2 - (rect.left + rect.width / 2);
	};
	const heroY = () => {
		const { rect, host } = measure();
		return host.top + host.height / 2 - (rect.top + rect.height / 2);
	};

	gsap.set(yearValue, { transformOrigin: "50% 50%" });
	tl.fromTo(
		yearValue,
		{ autoAlpha: 0, x: heroX, y: heroY, scale: heroScale },
		{
			autoAlpha: 1,
			x: heroX,
			y: heroY,
			scale: heroScale,
			duration: cue.yearInLen,
			ease: "power1.out",
		},
		cue.yearInAt,
	).to(
		yearValue,
		{
			x: 0,
			y: 0,
			scale: 1,
			duration: cue.yearDockLen,
			ease: "power3.inOut",
		},
		cue.yearDockAt,
	);

	const hudIn = cue.hudInAt;
	const hudLen = cue.hudInLen;

	if (marker) {
		tl.fromTo(
			marker,
			{ autoAlpha: 0, scaleX: 0, transformOrigin: "100% 50%" },
			{ autoAlpha: 1, scaleX: 1, duration: hudLen * 0.4, ease: "power2.out" },
			hudIn,
		);
	}
	if (ticks.length > 0) {
		tl.fromTo(
			ticks,
			{ autoAlpha: 0, x: 14 },
			{
				autoAlpha: 1,
				x: 0,
				duration: hudLen * 0.35,
				ease: "power2.out",
				stagger: (hudLen * 0.5) / ticks.length,
			},
			hudIn,
		);
	}
	// One tween keeps both captions on the same beat by construction; the phone counter
	// is display: none from sm up, so its share is inert there.
	const captions = [role, counter].filter((el): el is HTMLElement => !!el);
	if (captions.length > 0) {
		tl.fromTo(
			captions,
			{ autoAlpha: 0, y: 8 },
			{ autoAlpha: 1, y: 0, duration: hudLen * 0.4, ease: "power2.out" },
			hudIn + hudLen * 0.25,
		);
	}
	if (barItems.length > 0) {
		tl.fromTo(
			barItems,
			{ autoAlpha: 0, y: 18 },
			{
				autoAlpha: 1,
				y: 0,
				duration: hudLen * 0.45,
				ease: "power2.out",
				stagger: (hudLen * 0.4) / barItems.length,
			},
			hudIn + hudLen * 0.15,
		);
	}
	if (divider) {
		tl.fromTo(
			divider,
			{ scaleY: 0 },
			{ scaleY: 1, duration: hudLen * 0.5, ease: "power2.out" },
			hudIn + hudLen * 0.35,
		);
	}
}

// On the blockquote so the terms inherit it and the rule can size its em thickness against it.
const quoteSize = "text-[clamp(3.25rem,8.5vw,7rem)]";
const quoteLineClass =
	"font-bold font-display text-dusk-ink leading-[1.1] tracking-[-0.01em]";

// The operator is always its line's final glyph (the NBSP welds it on), which the selector
// leans on. Colour alpha, not opacity: the reveal animates per-char opacity over it.
const operatorClass = "[&_.split-char:last-child]:text-dusk-ink/85";

// NBSPs weld each term to its operator so no width strands one on its own line.
const NB = "\u00A0";
const TERM_1 = `Play${NB}+`;
// Typed "-", drawn as "=" by .kitora-equals.
const TERM_2 = `Purpose${NB}-`;
const RESULT = "Work";

export function WorkHistorySection() {
	const rootRef = useRef<HTMLElement>(null);
	const stageRefs = useRef<(HTMLDivElement | null)[]>([]);
	const hudRefs = useRef<(HTMLDivElement | null)[]>([]);
	// ?chapter=N applies after mount so prerendered HTML always hydrates as the full story.
	const [story, setStory] = useState<CityChapter[]>(CHAPTERS);
	useEffect(() => {
		const param = new URLSearchParams(window.location.search).get("chapter");
		const chapter = param === null ? undefined : CHAPTERS[Number(param)];
		if (chapter) setStory([chapter]);
	}, []);
	const phase = useMemo(() => storyPhases(story), [story]);
	const carried = useMemo(
		() => story.map((_, i) => carriedUsersBefore(story, i)),
		[story],
	);
	// Stable per-index ref callbacks: a fresh inline closure per render would defeat the
	// scenes' and HUDs' memo on every quantized readout push.
	const stageRefFns = useMemo(
		() =>
			story.map((_, i) => (el: HTMLDivElement | null) => {
				stageRefs.current[i] = el;
			}),
		[story],
	);
	const hudRefFns = useMemo(
		() =>
			story.map((_, i) => (el: HTMLDivElement | null) => {
				hudRefs.current[i] = el;
			}),
		[story],
	);

	// Full value so reduced motion and SSR read right; the motion path resets it at build.
	const [chapterIndex, setChapterIndex] = useState(0);
	const [usersTotal, setUsersTotal] = useState(
		() => carried[0] + cumulativeUsersAt(story[0].stints, story[0].span[1]),
	);
	const [year, setYear] = useState(story[0].span[0]);
	const [stintIndex, setStintIndex] = useState(0);
	useEffect(() => {
		setChapterIndex(0);
		setUsersTotal(
			carried[0] + cumulativeUsersAt(story[0].stints, story[0].span[1]),
		);
		setYear(story[0].span[0]);
		setStintIndex(0);
	}, [story, carried]);

	// The pin holds the quote static, so its reveals bind to absolute scroll positions;
	// function values re-measure on refresh, while pins are reverted, so offsets stay real.
	const sectionTop = useCallback(() => {
		const el = rootRef.current;
		return el ? el.getBoundingClientRect().top + window.scrollY : 0;
	}, []);
	// The h-screen box is the layers' CSS viewport; innerHeight on iOS tracks the toolbar.
	const sectionHeight = useCallback(
		() => rootRef.current?.offsetHeight || window.innerHeight,
		[],
	);
	// AnimatedLines rebuilds its trigger when start/end change identity, so these must only
	// change with the phase map. Ends are each term's own phase end: the reveals overlap.
	const cue = useMemo(() => {
		const at = (vh: number) => () => sectionTop() + sectionHeight() * vh;
		return {
			line1Start: () => sectionTop() - sectionHeight() * LINE1_LEAD_VH,
			line1End: at(phase.at.line1 + phase.len.line1),
			line2Start: at(phase.at.line2),
			line2End: at(phase.at.line2 + phase.len.line2),
			line3Start: at(phase.at.line3),
			line3End: at(phase.at.line3 + phase.len.line3),
		};
	}, [sectionTop, sectionHeight, phase]);

	// matchMedia leaves the section unpinned at its rendered static state under reduced motion.
	useGSAP(
		() => {
			const section = rootRef.current;
			if (!section) return;

			const rule = section.querySelector<HTMLElement>("[data-quote-rule]");
			const operands = section.querySelector<HTMLElement>(
				"[data-quote-operands]",
			);
			const result = section.querySelector<HTMLElement>("[data-quote-result]");

			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				// Whole-line ink: AnimatedLines splits the word after this layout effect runs.
				if (result) gsap.set(result, { color: INK_HEX });
				// Origin right: the rule grows from the edge the terms anchor to, under the "=".
				if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "100% 50%" });

				// Timeline seconds are viewport-heights, so phase offsets read as scroll distances.
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: section,
						start: "top top",
						end: () => `+=${sectionHeight() * phase.total}`,
						scrub: true,
						pin: true,
						anticipatePin: 1,
						invalidateOnRefresh: true,
					},
				});

				if (rule) {
					tl.to(
						rule,
						{ scaleX: 1, duration: phase.len.rule, ease: "power2.out" },
						phase.at.rule,
					);
				}
				if (result) {
					tl.to(
						result,
						{ color: EARTH_HEX, duration: phase.len.ink, ease: "none" },
						phase.at.ink,
					);
				}
				// The result scales about its "o" counter and never fades, so the frame ends
				// inside the hole, not on a dissolved word; a function origin re-measures on resize.
				if (operands) {
					tl.to(
						operands,
						{
							autoAlpha: 0,
							scale: 0.88,
							duration: phase.len["quote-exit"],
							ease: "power2.inOut",
						},
						phase.at["quote-exit"],
					);
				}
				if (result) {
					tl.to(
						result,
						{
							scale: () => flythroughScale(result, section),
							transformOrigin: () => counterOrigin(result),
							duration: phase.len["result-exit"],
							// Apparent size goes as 1/distance: an even approach is a constant growth
							// RATIO. Polynomial eases lurch then coast in depth terms; expo.in holds steady.
							ease: "expo.in",
						},
						phase.at["result-exit"],
					);
					// The word rasterizes once, so edges break up as it grows; blur takes over from
					// halfway. immediateRender off: GSAP cannot interpolate filter out of `none`.
					tl.fromTo(
						result,
						{ filter: "blur(0px)" },
						{
							filter: `blur(${FLYTHROUGH_BLUR_PX}px)`,
							duration: phase.len["result-exit"] / 2,
							ease: "none",
							immediateRender: false,
						},
						phase.at["result-exit"] + phase.len["result-exit"] / 2,
					);
					// The grown word otherwise survives behind the panorama, where a resize reflow
					// can expose it. A timeline set() stays scrub-safe: rewinding restores it.
					tl.set(
						result,
						{ autoAlpha: 0 },
						phase.at["result-exit"] + phase.len["result-exit"],
					);
				}

				// Whichever chapter's scrub holds the playhead pushes the shared readout state
				// into React; crossing a chapter boundary swaps the HUD's data source.
				const shown = { chapter: 0, year: 0, index: -1, users: -1 };
				const cleanups: (() => void)[] = [];

				story.forEach((chapter, i) => {
					const stage = stageRefs.current[i];
					const hud = hudRefs.current[i];
					if (!stage || !hud) return;
					const pano = chapter.panorama;
					const cascadeAt = phase.at[`panorama-in@${i}`];
					const scrubAt = phase.at[`scrub@${i}`];
					const scrubLen = phase.len[`scrub@${i}`];

					setLayersBeforeEntrance(stage, pano);
					buildCascade(tl, cascadeAt, stage, pano);
					buildParallaxShift(
						tl,
						phase.at[`parallax@${i}`],
						phase.len[`parallax@${i}`],
						stage,
						pano,
						sectionHeight,
					);
					buildSurfaceReveal(
						tl,
						phase.at[`parallax@${i}`],
						phase.len[`parallax@${i}`],
						stage,
						pano,
						sectionHeight,
					);
					buildSunset(
						tl,
						{
							enterAt: cascadeAt,
							scrubAt,
							scrubLen,
							closeLen:
								i === story.length - 1 ? phase.len["outro-close"] : undefined,
							duskLen:
								i === story.length - 1 ? phase.len["outro-dusk"] : undefined,
						},
						stage,
						pano,
					);
					buildHudEntrance(hud, section, tl, {
						yearInAt: phase.at[`year-in@${i}`],
						yearInLen: phase.len[`year-in@${i}`],
						yearDockAt: phase.at[`year-dock@${i}`],
						yearDockLen: phase.len[`year-dock@${i}`],
						hudInAt: phase.at[`hud-in@${i}`],
						hudInLen: phase.len[`hud-in@${i}`],
					});

					// The ruler tweens straight on the DOM; quantized readouts push into React
					// only when their value changes.
					const [from, to] = chapter.span;
					const clock = { year: from };
					tl.to(
						clock,
						{
							year: to,
							duration: scrubLen,
							ease: "none",
							onUpdate: () => {
								if (shown.chapter !== i) {
									shown.chapter = i;
									setChapterIndex(i);
								}
								const whole = Math.floor(clock.year);
								if (whole !== shown.year) {
									shown.year = whole;
									setYear(whole);
								}
								const index = stintIndexAt(chapter.stints, clock.year);
								if (index !== shown.index) {
									shown.index = index;
									setStintIndex(index);
								}
								const users =
									carried[i] + cumulativeUsersAt(chapter.stints, clock.year);
								if (users !== shown.users) {
									shown.users = users;
									setUsersTotal(users);
								}
							},
						},
						scrubAt,
					);
					buildYearCues(
						tl,
						{ at: scrubAt, vhPerYear: SCRUB_VH_PER_YEAR, spanStart: from },
						stage,
						pano,
					);
					const ruler = hud.querySelector("[data-hud-ruler]");
					if (ruler) {
						tl.to(
							ruler,
							{
								y: -rulerTravel(chapter.span),
								duration: scrubLen,
								ease: "none",
								force3D: true,
							},
							scrubAt,
						);
					}

					if (i < story.length - 1) {
						tl.to(
							hud,
							{
								autoAlpha: 0,
								duration: phase.len[`hud-out@${i}`],
								ease: "power1.inOut",
							},
							phase.at[`hud-out@${i}`],
						);
						buildSceneExit(
							tl,
							phase.at[`scene-out@${i}`],
							phase.len[`scene-out@${i}`],
							stage,
							pano,
						);
					} else {
						tl.to(
							hud,
							{
								autoAlpha: 0,
								duration: phase.len["outro-close"],
								ease: "power1.inOut",
							},
							phase.at["outro-close"],
						);
						buildOutroClose(
							tl,
							phase.at["outro-close"],
							phase.len["outro-close"],
							stage,
							pano,
						);
						buildDusk(
							tl,
							{
								at: phase.at["outro-dusk"],
								len: phase.len["outro-dusk"],
							},
							stage,
							pano,
						);
					}

					const sway = attachCloudSway(stage, pano);
					const vessels = attachVessels({
						stage,
						config: pano,
						cueScrollY: (vessel) => () =>
							sectionTop() +
							sectionHeight() *
								(cascadeAt + vessel.cueStep * pano.stepVh + pano.durVh),
					});
					cleanups.push(vessels.cleanup);
					// The scrubbed master cannot stop clock-driven tweens, so a window trigger
					// does. Boundary callbacks, never onToggle: a one-frame skip across the window
					// fires enter then leave with no toggle and must still end paused; onRefresh
					// re-syncs after a refresh replays the vessel cue for a load mid-chapter.
					const onStage = stageWindow(phase, i, story.length);
					const syncAmbience = (self: ScrollTrigger) => {
						if (self.isActive) {
							sway.resume();
							vessels.resume();
						} else {
							sway.pause();
							vessels.pause();
						}
					};
					ScrollTrigger.create({
						id: `ambience@${i}`,
						start: () => sectionTop() + sectionHeight() * onStage.start,
						end: () => sectionTop() + sectionHeight() * onStage.end,
						onEnter: syncAmbience,
						onEnterBack: syncAmbience,
						onLeave: syncAmbience,
						onLeaveBack: syncAmbience,
						onRefresh: syncAmbience,
					});
				});

				// The scrubs own the readouts now, so chapter 0's HUD arrives at its opening total.
				setUsersTotal(
					carried[0] + cumulativeUsersAt(story[0].stints, story[0].span[0]),
				);
				// Settle on the last finished scene before the pin releases.
				tl.to({}, { duration: phase.len.tail }, phase.at.tail);

				return () => {
					for (const cleanup of cleanups) cleanup();
				};
			});

			return () => mm.revert();
		},
		{ scope: rootRef, dependencies: [story, phase], revertOnUpdate: true },
	);

	return (
		<section
			ref={rootRef}
			id="work"
			data-surface="pale-dune"
			data-header-hold
			data-motion-anchor="scrub"
			className="relative h-screen bg-pale-dune motion-reduce:h-auto"
		>
			{/* Stacking: panoramas (0) < huds (tree order) < quote (20), which exits
			    before the first hud arrives. */}
			{/* overflow-hidden: the scaled result otherwise extends the document's scroll range. */}
			<div className="relative z-20 flex h-screen items-center justify-center overflow-hidden">
				{/* As a flex item the figure hugs the widest term, so the equation
				    right-aligns on one shared edge. */}
				<figure className="max-w-6xl px-6 text-right sm:px-10">
					<blockquote className={quoteSize}>
						{/* Grouped so the exit recedes these together while the result flies
						    the other way. */}
						<div data-quote-operands>
							<ScrollRevealText
								as="p"
								direction="right"
								trigger="viewport"
								start={cue.line1Start}
								end={cue.line1End}
								className={`${quoteLineClass} ${operatorClass}`}
							>
								{TERM_1}
							</ScrollRevealText>
							<ScrollRevealText
								as="p"
								direction="left"
								accessibleText="Purpose ="
								trigger="viewport"
								start={cue.line2Start}
								end={cue.line2End}
								className={`${quoteLineClass} ${operatorClass} kitora-equals`}
							>
								{TERM_2}
							</ScrollRevealText>
							{/* Em units so the rule tracks the clamped type size. 75% alpha reads
							    like the operators' 85%: font smoothing thins glyphs, a filled bar
							    lands heavier at the same value. */}
							<div
								data-quote-rule
								aria-hidden="true"
								className="my-[0.14em] h-[0.13em] rounded-full bg-dusk-ink/75"
							/>
						</div>
						<ScrollRevealText
							as="p"
							data-quote-result
							direction="right"
							trigger="viewport"
							start={cue.line3Start}
							end={cue.line3End}
							className={quoteLineClass}
						>
							{RESULT}
						</ScrollRevealText>
					</blockquote>
				</figure>
			</div>
			{/* The ledger is display:none under motion, so the scenes' stacking and layer
			    order are untouched; reduced motion reads scene, ledger, scene, ledger. */}
			{story.map((chapter, i) => (
				<Fragment key={chapter.id}>
					<PanoramaScene
						config={chapter.panorama}
						veil={i === story.length - 1}
						stageRef={stageRefFns[i]}
					/>
					<CityLedger chapter={chapter} />
				</Fragment>
			))}
			{/* Each chapter owns its HUD DOM so GSAP choreographs lifetimes without fighting
			    React; inactive chapters get quiet props so hidden instruments never roll. */}
			{story.map((chapter, i) => (
				// Hidden, never unmounted: a GSAP target (invariant 6); the ledgers carry the data.
				<div
					key={`hud-${chapter.id}`}
					className="motion-reduce:hidden"
					ref={hudRefFns[i]}
				>
					<WorkHistoryHud
						span={chapter.span}
						year={chapterIndex === i ? year : chapter.span[0]}
						stint={chapter.stints[chapterIndex === i ? stintIndex : 0]}
						usersTotal={chapterIndex === i ? usersTotal : carried[i]}
					/>
				</div>
			))}
		</section>
	);
}
