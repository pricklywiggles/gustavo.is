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

const SCRUB_VIEWPORT_PCT = 100;
const PIN_PCT_PER_LINE = 70;
const TRIGGER_SECONDS_PER_LINE = 1;

type StartEnd = string | number | (() => number);

/** Adds a line's tweens at `at`; returns its length in seconds, which drives the stagger. */
export type LineEffect = (context: {
	chars: HTMLElement[];
	lineIndex: number;
	lineCount: number;
	timeline: gsap.core.Timeline;
	at: number;
}) => number;

type AnimatedLinesOwnProps = {
	children: string;
	accessibleText?: string;
	as?: ElementType;
	/** Must be memoized: the reference is a timeline-rebuild dependency. */
	effect: LineEffect;
	/** "scrub" follows scroll; "pin" scrubs while pinned; "trigger" plays once in real time. */
	mode?: "scrub" | "pin" | "trigger";
	/** Fraction of a line's length before the next line starts (0 together, 1 sequential). */
	lineStagger?: number;
	/** Trigger mode: seconds to wait before the cascade starts. */
	delay?: number;
	/** Higher is snappier: divides the scroll span (scrub/pin) or play time (trigger). */
	speed?: number;
	/** Trigger mode: viewport % (0 top, 100 bottom) the element's top crosses to start. */
	triggerAt?: number;
	/** ScrollTrigger element; "viewport" takes absolute positions, for sticky-held text. */
	trigger?: gsap.DOMTarget | "viewport";
	start?: StartEnd;
	end?: StartEnd;
	scrub?: boolean | number;
};

export type AnimatedLinesProps = AnimatedLinesOwnProps &
	Omit<HTMLAttributes<HTMLElement>, keyof AnimatedLinesOwnProps>;

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

	// Fonts first: the fallback wraps differently and a later pinned rebuild strands its spacer.
	// Resize rebuilds only when wrapping changed: rebuilding mid-scroll races GSAP's refresh.
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
					// ScrollTrigger eats a paused timeline's `delay`; shiftChildren works pre-timeScale.
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
	scrub?: boolean | number;
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
			else if (element) vars.end = `+=${SCRUB_VIEWPORT_PCT / speed}%`;
			// Percent-relative ends need a trigger element.
			else
				vars.end = () =>
					toNumber(start ?? 0) +
					(window.innerHeight * (SCRUB_VIEWPORT_PCT / 100)) / speed;
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

// NBSP is deliberately not a separator: it never binds between inline-blocks (wrap control no-ops).
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
