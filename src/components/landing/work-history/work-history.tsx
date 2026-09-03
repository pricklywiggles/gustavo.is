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
import { dockPose, heroPose } from "./year-pose";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const LINE1_LEAD_VH = 0.5;

const YEAR_HERO_WIDTH = 0.85;

// GSAP can't interpolate the theme's oklch(); these are the ramp's sRGB twins.
const INK_HEX = RAMP_HEX["dusk-ink"];
const EARTH_HEX = RAMP_HEX["dusk-earth"];

// Headroom so the counter's inner edge clears the frame corner.
const FLYTHROUGH_MARGIN = 1.15;
// Filters apply in element space: this times the live scale is about one source pixel.
const FLYTHROUGH_BLUR_PX = 0.8;
const FLYTHROUGH_FALLBACK = 200;

// A split char's box is a whole line box, so the "o" ink centre comes from font metrics.
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

function counterOrigin(line: HTMLElement): string {
	const point = counterPoint(line);
	if (!point) return "50% 50%";
	const box = line.getBoundingClientRect();
	return `${point.x - box.left}px ${point.y - box.top}px`;
}

// Kitora's "o" is nearly solid, a 0.05em pinhole: hence the hundreds-scale fly-through.
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

// Neutralize the live GSAP transform so measured offsets never compound it.
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
	yearSwapAt: number;
	yearSwapLen: number;
	productInAt: number;
	productInLen: number;
	hudInAt: number;
	hudInLen: number;
};

// Function offsets re-measure on resize instead of stranding the year mid-flight.
function buildHudEntrance(
	root: HTMLElement,
	section: HTMLElement,
	tl: gsap.core.Timeline,
	cue: ChapterCues,
) {
	const q = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel);
	const hero = q("[data-hud-year-hero]");
	const odometer = q("[data-hud-year-value]");
	const role = q("[data-hud-role]");
	const counter = q("[data-hud-counter]");
	const marker = q("[data-hud-marker]");
	const product = q("[data-hud-product]");
	const ticks = gsap.utils.toArray<HTMLElement>(
		root.querySelectorAll("[data-hud-ruler] > *"),
	);
	// Document order runs left to right across the bar; the stagger leans on it.
	const barItems = gsap.utils.toArray<HTMLElement>(
		root.querySelectorAll("[data-hud-bar] [data-hud-slot]"),
	);
	if (!hero || !odometer) return;

	// Measured against the section, never the viewport: these run while pins are reverted.
	// Cached per refresh pass: each untransformedRect is a write-read-write reflow.
	let measured: { rect: DOMRect; host: DOMRect; number: DOMRect } | null = null;
	const measure = () => {
		if (!measured) {
			measured = {
				rect: untransformedRect(hero),
				host: section.getBoundingClientRect(),
				// The wrapper stands in until AnimateNumber has rendered its glyph box.
				number: (
					odometer.querySelector("[data-hud-year-number]") ?? odometer
				).getBoundingClientRect(),
			};
			queueMicrotask(() => {
				measured = null;
			});
		}
		return measured;
	};
	// Safari rasters text at layout size, so the hero string only ever scales DOWN (FRA-192).
	// The odometer stays untransformed: its reels read travel from transform-inclusive rects.
	const heroAt = () => {
		const { rect, host } = measure();
		return heroPose(rect, host, YEAR_HERO_WIDTH);
	};
	const dockAt = () => {
		const { rect, number } = measure();
		return dockPose(
			rect,
			number,
			Number.parseFloat(getComputedStyle(hero).fontSize),
			Number.parseFloat(getComputedStyle(odometer).fontSize),
		);
	};
	const heroX = () => heroAt().x;
	const heroY = () => heroAt().y;
	const heroScale = () => heroAt().scale;

	// Opacity, never autoAlpha: the odometer is the year's one accessible copy.
	gsap.set(odometer, { opacity: 0 });
	const swapEnd = cue.yearSwapAt + cue.yearSwapLen;
	// force3D false keeps a 1235px-wide text layer per chapter off the compositor.
	tl.fromTo(
		hero,
		{ autoAlpha: 0, x: heroX, y: heroY, scale: heroScale },
		{
			autoAlpha: 1,
			x: heroX,
			y: heroY,
			scale: heroScale,
			duration: cue.yearInLen,
			ease: "power1.out",
			force3D: false,
		},
		cue.yearInAt,
	)
		.to(
			hero,
			{
				x: () => dockAt().x,
				y: () => dockAt().y,
				scale: () => dockAt().scale,
				duration: cue.yearDockLen,
				ease: "power3.inOut",
				force3D: false,
			},
			cue.yearDockAt,
		)
		// White over the panorama, ink by the dock: the color settles before the swap.
		.to(
			hero,
			{ color: INK_HEX, duration: cue.yearSwapLen, ease: "none" },
			cue.yearSwapAt,
		)
		.set(hero, { autoAlpha: 0 }, swapEnd)
		.set(odometer, { opacity: 1 }, swapEnd);

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
	// One tween so both captions share a beat; the phone counter is display:none from sm.
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
	// Never a scale here: the mark inside is Motion's pop (FRA-192).
	if (product) {
		tl.fromTo(
			product,
			{ autoAlpha: 0, y: 12 },
			{ autoAlpha: 1, y: 0, duration: cue.productInLen, ease: "power2.out" },
			cue.productInAt,
		);
	}
}

// On the blockquote so the rule's em thickness sizes against the term type.
const quoteSize = "text-[clamp(3.25rem,8.5vw,7rem)]";
const quoteLineClass =
	"font-bold font-display text-dusk-ink leading-[1.1] tracking-[-0.01em]";

// The line's last glyph is always the operator; colour alpha leaves opacity to the reveal.
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
	// A fresh inline ref closure per render would defeat the scenes' and HUDs' memo.
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

	// Full value so reduced motion and SSR read right; the scrubs reset it at build.
	// Both poses are constant per chapter, so an inactive HUD's props never change identity.
	const atRest = useMemo(
		() =>
			story.map((chapter, i) => ({
				past: {
					year: chapter.span[1],
					stintIndex: chapter.stints.length - 1,
					usersTotal:
						carried[i] + cumulativeUsersAt(chapter.stints, chapter.span[1]),
				},
				future: {
					year: chapter.span[0],
					stintIndex: 0,
					usersTotal: carried[i],
				},
			})),
		[story, carried],
	);

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

	// The pin holds the quote static, so its reveals bind to absolute scroll positions.
	const sectionTop = useCallback(() => {
		const el = rootRef.current;
		return el ? el.getBoundingClientRect().top + window.scrollY : 0;
	}, []);
	// The h-screen box is the layers' CSS viewport; innerHeight on iOS tracks the toolbar.
	const sectionHeight = useCallback(
		() => rootRef.current?.offsetHeight || window.innerHeight,
		[],
	);
	// AnimatedLines rebuilds its trigger when start/end change identity.
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
				if (rule) gsap.set(rule, { scaleX: 0, transformOrigin: "100% 50%" });

				// Timeline seconds are viewport-heights.
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
				// The result never fades: the frame ends inside the hole, not on a dissolved word.
				if (result) {
					tl.to(
						result,
						{
							scale: () => flythroughScale(result, section),
							transformOrigin: () => counterOrigin(result),
							duration: phase.len["result-exit"],
							// Apparent size goes as 1/distance: an even approach is a constant ratio.
							ease: "expo.in",
						},
						phase.at["result-exit"],
					);
					// The word rasterizes once, so its edges break up as it grows.
					// immediateRender off: GSAP cannot interpolate filter out of `none`.
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
					// The grown word otherwise shows behind the panorama after a resize reflow.
					// A timeline set() stays scrub-safe; an imperative one dies on rewind.
					tl.set(
						result,
						{ autoAlpha: 0 },
						phase.at["result-exit"] + phase.len["result-exit"],
					);
				}

				// Whichever chapter's scrub holds the playhead owns the shared readout state.
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
						yearSwapAt: phase.at[`year-swap@${i}`],
						yearSwapLen: phase.len[`year-swap@${i}`],
						productInAt: phase.at[`product-in@${i}`],
						productInLen: phase.len[`product-in@${i}`],
						hudInAt: phase.at[`hud-in@${i}`],
						hudInLen: phase.len[`hud-in@${i}`],
					});

					// Readouts push into React only when a quantized value changes.
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
					// Never onToggle: a one-frame skip fires enter then leave, never a toggle.
					// onRefresh: a mid-chapter load's refresh replays the cue.
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

				// The scrubs own the readouts, so chapter 0's HUD starts at its opening total.
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
			    React; inactive chapters get constant props so hidden instruments never roll. */}
			{story.map((chapter, i) => {
				// A finished chapter rests on its last stint: reversing into one fades its HUD
				// back in before the scrub re-engages, and span[0] showed the first (FRA-195).
				const rest = i < chapterIndex ? atRest[i].past : atRest[i].future;
				const live = chapterIndex === i;
				return (
					// Hidden, never unmounted: GSAP owns these nodes (invariant 6).
					<div
						key={`hud-${chapter.id}`}
						className="motion-reduce:hidden"
						ref={hudRefFns[i]}
					>
						<WorkHistoryHud
							span={chapter.span}
							year={live ? year : rest.year}
							stint={chapter.stints[live ? stintIndex : rest.stintIndex]}
							usersTotal={live ? usersTotal : rest.usersTotal}
						/>
					</div>
				);
			})}
		</section>
	);
}
