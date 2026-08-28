"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
	type ElementType,
	Fragment,
	type HTMLAttributes,
	type ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import { useMounted } from "@/components/use-mounted";
import { groupIntoLines } from "@/lib/text-lines";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Scroll span (% of viewport) of the reveal at speed 1 in scrub mode.
const SCRUB_PCT = 100;
// Pin mode scroll span (% of viewport) per line unit of the cascade.
const PIN_PCT_PER_LINE = 70;
// Target real-time length (seconds) per line unit at speed 1 in trigger mode.
const TRIGGER_SECONDS_PER_LINE = 1;

type StartEnd = string | number | (() => number);

/**
 * Adds one line's tweens to `timeline` starting at `at` and returns the
 * line's natural length in timeline seconds (drives the line stagger).
 */
export type LineEffect = (context: {
	chars: HTMLElement[];
	lineIndex: number;
	lineCount: number;
	timeline: gsap.core.Timeline;
	at: number;
}) => number;

type AnimatedLinesOwnProps = {
	children: string;
	/** Screen-reader copy when it must differ from the drawn glyphs. aria-label cannot
	 * serve: naming is prohibited on paragraph/generic roles, so a hidden node carries it. */
	accessibleText?: string;
	as?: ElementType;
	/** How each line animates; pass a stable (memoized) reference. */
	effect: LineEffect;
	/** "scrub" (default) follows scroll; "pin" scrubs while pinning the element;
	 * "trigger" plays once in real time at the start position. */
	mode?: "scrub" | "pin" | "trigger";
	/** Fraction of a line's length before the next line starts (0 together, 1 sequential). */
	lineStagger?: number;
	/** Trigger mode: seconds to wait before the cascade starts. */
	delay?: number;
	/** Higher is snappier: divides the scroll span (scrub/pin) or play time (trigger). */
	speed?: number;
	/** Trigger mode: viewport % (0 top, 100 bottom) the element's top crosses to start. */
	triggerAt?: number;
	/** ScrollTrigger element; defaults to the text. "viewport" binds to absolute scroll
	 * positions (for text held static by a sticky ancestor); needs a numeric/function start. */
	trigger?: gsap.DOMTarget | "viewport";
	start?: StartEnd;
	end?: StartEnd;
	/** Scrub/pin: catch-up smoothing in seconds (GSAP's scrub number). */
	scrub?: number;
};

export type AnimatedLinesProps = AnimatedLinesOwnProps &
	Omit<HTMLAttributes<HTMLElement>, keyof AnimatedLinesOwnProps>;

/**
 * Splits text into grapheme spans grouped into the browser's wrapped lines, playing
 * `effect` per line staggered; the real text stays available via a visually hidden copy.
 */
export function AnimatedLines({
	children,
	accessibleText,
	as,
	className,
	effect,
	mode = "scrub",
	lineStagger = 0.4,
	delay = 0,
	speed = 1,
	triggerAt,
	trigger,
	start,
	end,
	scrub,
	...rest
}: AnimatedLinesProps) {
	const Tag = (as ?? "span") as ElementType;
	const root = useRef<HTMLElement>(null);
	const [measureKey, setMeasureKey] = useState(0);
	const [fontsReady, setFontsReady] = useState(false);
	const mounted = useMounted();
	const played = useRef(false);
	const lineSignature = useRef<string | null>(null);
	const safeSpeed = speed > 0 ? speed : 1;

	// Wait for the web font: the fallback wraps differently, and rebuilding a pinned
	// trigger later strands its pin-spacer. Rebuild on resize only if wrapping changed:
	// recreating a pinned trigger mid-scroll races GSAP's refresh and corrupts distances.
	useEffect(() => {
		let cancelled = false;
		const ready = () => !cancelled && setFontsReady(true);
		const fonts = document.fonts;
		if (!fonts || fonts.status === "loaded") ready();
		else fonts.ready.then(ready).catch(ready);

		let timer = 0;
		const remeasure = () => {
			window.clearTimeout(timer);
			timer = window.setTimeout(() => {
				if (lineSignature.current === null) return;
				const chars = Array.from(
					root.current?.querySelectorAll<HTMLElement>(".split-char") ?? [],
				);
				const next = signatureOf(groupIntoLines(chars));
				if (next !== lineSignature.current) setMeasureKey((k) => k + 1);
			}, 150);
		};
		window.addEventListener("resize", remeasure);
		return () => {
			cancelled = true;
			window.clearTimeout(timer);
			window.removeEventListener("resize", remeasure);
		};
	}, []);

	useGSAP(
		() => {
			if (!fontsReady) return;
			const chars = gsap.utils.toArray<HTMLElement>(
				root.current?.querySelectorAll(".split-char") ?? [],
			);
			if (chars.length === 0) return;

			// Under reduced motion the callback never registers; letters stay at rest.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const lines = groupIntoLines(chars);
				lineSignature.current = signatureOf(lines);
				const master = gsap.timeline({
					scrollTrigger: buildScrollTrigger({
						root: root.current,
						mode,
						trigger,
						triggerAt,
						start,
						end,
						scrub,
						speed: safeSpeed,
						lineCount: lines.length,
						lineStagger,
					}),
				});

				let position = 0;
				lines.forEach((lineChars, lineIndex) => {
					const length = effect({
						chars: lineChars,
						lineIndex,
						lineCount: lines.length,
						timeline: master,
						at: position,
					});
					position += length * lineStagger;
				});

				if (mode === "trigger") {
					// A timeline `delay` is consumed while ScrollTrigger holds it paused, so
					// bake in the lead instead; shiftChildren works in pre-timeScale units.
					master.duration(
						(TRIGGER_SECONDS_PER_LINE / safeSpeed) *
							(1 + (lines.length - 1) * lineStagger),
					);
					if (delay) master.shiftChildren(delay * master.timeScale(), true);
					// A rebuild (rewrap) must not replay an already-shown reveal.
					if (played.current) master.progress(1);
					else
						master.eventCallback("onComplete", () => {
							played.current = true;
						});
				}
			});

			return () => mm.revert();
		},
		{
			scope: root,
			dependencies: [
				children,
				effect,
				mode,
				lineStagger,
				delay,
				safeSpeed,
				triggerAt,
				trigger,
				start,
				end,
				scrub,
				fontsReady,
				mounted,
				measureKey,
			],
		},
	);

	return (
		<Tag ref={root} className={className} {...rest}>
			{/* aria-label is prohibited on generic roles; the hidden node is the accessible text. */}
			<span className={mounted ? "sr-only" : undefined}>
				{accessibleText ?? children}
			</span>
			{/* Client-only: a crawler would read the split copy as spaced letters. */}
			{mounted && <span aria-hidden="true">{splitIntoChars(children)}</span>}
		</Tag>
	);
}

function buildScrollTrigger({
	root,
	mode,
	trigger,
	triggerAt,
	start,
	end,
	scrub,
	speed,
	lineCount,
	lineStagger,
}: {
	root: HTMLElement | null;
	mode: "scrub" | "pin" | "trigger";
	trigger?: gsap.DOMTarget | "viewport";
	triggerAt?: number;
	start?: StartEnd;
	end?: StartEnd;
	scrub?: number;
	speed: number;
	lineCount: number;
	lineStagger: number;
}): ScrollTrigger.Vars {
	const viewport = trigger === "viewport";
	if (viewport && typeof start !== "number" && typeof start !== "function") {
		throw new Error('trigger="viewport" requires a numeric or function start');
	}
	const element = viewport ? undefined : (trigger ?? root ?? undefined);
	const base: ScrollTrigger.Vars = { invalidateOnRefresh: true };
	if (element) base.trigger = element;

	switch (mode) {
		case "pin": {
			if (viewport) throw new Error('mode="pin" needs an element trigger');
			const pct =
				(PIN_PCT_PER_LINE * (1 + (lineCount - 1) * lineStagger)) / speed;
			return {
				...base,
				start: start ?? "top top",
				end: end ?? `+=${pct}%`,
				scrub: scrub ?? true,
				pin: true,
				anticipatePin: 1,
			};
		}
		case "trigger": {
			const startValue = start ?? `top ${triggerAt ?? 80}%`;
			const vars: ScrollTrigger.Vars = {
				...base,
				start: startValue,
				toggleActions: "play none none none",
			};
			if (end !== undefined) vars.end = end;
			// Without a trigger element ScrollTrigger needs an explicit range.
			else if (!element) vars.end = () => toNumber(startValue) + 1;
			return vars;
		}
		default: {
			const vars: ScrollTrigger.Vars = {
				...base,
				start: start ?? "top bottom",
				scrub: scrub ?? true,
			};
			if (end !== undefined) vars.end = end;
			else if (element) vars.end = `+=${SCRUB_PCT / speed}%`;
			// Percent-relative ends need a trigger element; compute absolute.
			// (No element implies "viewport", whose start is validated above.)
			else
				vars.end = () =>
					toNumber(start ?? 0) +
					(window.innerHeight * (SCRUB_PCT / 100)) / speed;
			return vars;
		}
	}
}

function toNumber(value: StartEnd): number {
	return typeof value === "function" ? value() : Number(value);
}

function signatureOf(lines: HTMLElement[][]): string {
	return lines.map((line) => line.length).join(",");
}

const segmenter =
	typeof Intl !== "undefined" && "Segmenter" in Intl
		? new Intl.Segmenter(undefined, { granularity: "grapheme" })
		: null;

// Grapheme-cluster chars; keys are string offsets, stable because the text is fixed.
// NBSP is deliberately NOT a separator: between two inline-blocks it does not bind at
// all, so callers using NBSP to control headline wrapping would silently get nothing.
const BREAKABLE_SPACE = /([^\S\u00A0]+)/;
const ONLY_BREAKABLE_SPACE = /^[^\S\u00A0]+$/;

function splitIntoChars(text: string): ReactNode[] {
	let offset = 0;
	return text.split(BREAKABLE_SPACE).map((token) => {
		const tokenStart = offset;
		offset += token.length;
		if (token.length === 0) return null;
		if (ONLY_BREAKABLE_SPACE.test(token))
			return <Fragment key={tokenStart}>{token}</Fragment>;
		const clusters = segmenter
			? Array.from(segmenter.segment(token), (s) => s.segment)
			: Array.from(token);
		let at = tokenStart;
		return (
			<span key={tokenStart} className="inline-block whitespace-nowrap">
				{clusters.map((cluster) => {
					const key = at;
					at += cluster.length;
					return (
						<span key={key} className="split-char inline-block">
							{cluster}
						</span>
					);
				})}
			</span>
		);
	});
}
