"use client";

import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	type MotionValue,
	m,
	motionValue,
	useAnimationFrame,
	useMotionValue,
	useSpring,
	useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";
import { useMounted } from "@/components/use-mounted";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";

// Never AnimateNumber here: a middle digit falling while the value rises sweeps the long way.

// 0-9 plus a wrapping 0: position 10 is pixel-identical to 0, so 9 -> 0 is seamless.
const REEL_GLYPHS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0];

// 20 rows is 2 revolutions per second; faster aliases against the frame rate.
const MAX_ROWS_PER_SECOND = 20;

const VALUE_SPRING = { stiffness: 170, damping: 28 };

function mod10(n: number): number {
	return ((n % 10) + 10) % 10;
}

/** Reel position in glyph rows: digit plus a carry, so 1999 -> 2000 cascades all four. */
export function reelPosition(value: number, place: number): number {
	const v = Math.max(0, value);
	const digit = Math.floor(v / place) % 10;
	const carry = Math.max(0, (v % place) - (place - 1));
	return digit + carry;
}

/** One frame of a speed-limited reel; distance runs around the wheel in the travel direction. */
export function advanceReel(
	display: number,
	target: number,
	direction: 1 | -1,
	maxStep: number,
): number {
	let distance =
		direction === 1 ? mod10(target - display) : mod10(display - target);
	// Float jitter puts the target an epsilon behind, which reads as a near-full lap.
	if (distance > 10 - 1e-4) distance = 0;
	const step = Math.min(distance, Math.max(0, maxStep));
	return mod10(display + direction * step);
}

// AnimateNumber's mask, so the year and the counter match: expensive.toys/blog/blur-vignette
const MASK_HEIGHT = "0.15em";
const MASK_WIDTH = "0.5em";
const CORNER = "#000 0, transparent 71%";
const MASK_IMAGE =
	`linear-gradient(to right, transparent 0, #000 ${MASK_WIDTH}, #000 calc(100% - ${MASK_WIDTH}), transparent),` +
	`linear-gradient(to bottom, transparent 0, #000 ${MASK_HEIGHT}, #000 calc(100% - ${MASK_HEIGHT}), transparent 100%),` +
	`radial-gradient(at bottom right, ${CORNER}),` +
	`radial-gradient(at bottom left, ${CORNER}),` +
	`radial-gradient(at top left, ${CORNER}),` +
	`radial-gradient(at top right, ${CORNER})`;
const MASK_SIZE =
	`100% calc(100% - ${MASK_HEIGHT} * 2),` +
	`calc(100% - ${MASK_WIDTH} * 2) 100%,` +
	`${MASK_WIDTH} ${MASK_HEIGHT},` +
	`${MASK_WIDTH} ${MASK_HEIGHT},` +
	`${MASK_WIDTH} ${MASK_HEIGHT},` +
	`${MASK_WIDTH} ${MASK_HEIGHT}`;
const maskStyle: React.CSSProperties = {
	margin: `0 calc(-1 * ${MASK_WIDTH})`,
	padding: `calc(${MASK_HEIGHT} / 2) ${MASK_WIDTH}`,
	overflow: "clip",
	WebkitMaskImage: MASK_IMAGE,
	WebkitMaskSize: MASK_SIZE,
	WebkitMaskPosition:
		"center, center, top left, top right, bottom right, bottom left",
	WebkitMaskRepeat: "no-repeat",
};

function Reel({
	display,
	place,
}: {
	display: MotionValue<number>;
	place: number;
}) {
	const y = useTransform(display, (d) => `${-d}em`);
	return (
		<m.span
			data-reel={place}
			initial={{ width: "0ch", opacity: 0 }}
			animate={{ width: "1ch", opacity: 1 }}
			exit={{ width: "0ch", opacity: 0 }}
			transition={{ duration: 0.25, ease: "easeOut" }}
			className="inline-flex h-[1em] justify-center"
		>
			<m.span style={{ y }} className="flex flex-col">
				{REEL_GLYPHS.map((glyph, i) => (
					<span
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed glyph strip, never reorders
						key={i}
						className="flex h-[1em] items-center justify-center leading-none"
					>
						{glyph}
					</span>
				))}
			</m.span>
		</m.span>
	);
}

type Token =
	| { kind: "digit"; place: number }
	| { kind: "separator"; char: string; key: string };

function tokenize(text: string): Token[] {
	const tokens: Token[] = [];
	let digitsSeen = 0;
	for (let i = text.length - 1; i >= 0; i--) {
		const char = text[i];
		if (char >= "0" && char <= "9") {
			tokens.unshift({ kind: "digit", place: 10 ** digitsSeen });
			digitsSeen++;
		} else {
			tokens.unshift({ kind: "separator", char, key: `sep-${digitsSeen}` });
		}
	}
	return tokens;
}

export function OdometerNumber({
	value,
	grouping = true,
	className,
}: {
	value: number;
	grouping?: boolean;
	className?: string;
}) {
	const target = Math.max(0, Math.round(value));
	const text = target.toLocaleString("en-US", { useGrouping: grouping });
	const tokens = tokenize(text);
	const raw = useMotionValue(target);
	const smooth = useSpring(raw, VALUE_SPRING);
	const reducedMotion = useReducedMotionLive();
	const mounted = useMounted();

	// motionValue(), not the hook: reels come and go with the digit count, hook counts can't.
	const reels = useRef(new Map<number, MotionValue<number>>());
	const direction = useRef<1 | -1>(1);
	const getReel = (place: number): MotionValue<number> => {
		let reel = reels.current.get(place);
		if (!reel) {
			reel = motionValue(reelPosition(smooth.get(), place));
			reels.current.set(place, reel);
		}
		return reel;
	};

	useEffect(() => {
		if (reducedMotion) smooth.jump(target);
		else raw.set(target);
	}, [target, raw, smooth, reducedMotion]);

	useAnimationFrame((_, delta) => {
		if (reducedMotion) return;
		const v = smooth.get();
		const velocity = smooth.getVelocity();
		if (Math.abs(velocity) > 1) direction.current = velocity > 0 ? 1 : -1;
		const maxStep = (MAX_ROWS_PER_SECOND * delta) / 1000;
		for (const [place, reel] of reels.current) {
			const next = advanceReel(
				reel.get(),
				reelPosition(v, place),
				direction.current,
				maxStep,
			);
			if (next !== reel.get()) reel.set(next);
		}
	});

	// Reels are client-only: a crawler would read the 0..9 strips beside the number.
	if (reducedMotion || !mounted) {
		return <span className={`tabular-nums ${className ?? ""}`}>{text}</span>;
	}

	return (
		<LazyMotion features={domAnimation} strict>
			{/* The real number rides along for assistive tech; the reels are decorative. */}
			<span className={`relative inline-flex tabular-nums ${className ?? ""}`}>
				<span className="sr-only">{text}</span>
				<span aria-hidden="true" className="inline-flex" style={maskStyle}>
					<AnimatePresence initial={false}>
						{tokens.map((token) =>
							token.kind === "digit" ? (
								<Reel
									key={token.place}
									place={token.place}
									display={getReel(token.place)}
								/>
							) : (
								<m.span
									key={token.key}
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: "auto", opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									transition={{ duration: 0.25, ease: "easeOut" }}
									className="inline-flex justify-center overflow-clip leading-none"
								>
									{token.char}
								</m.span>
							),
						)}
					</AnimatePresence>
				</span>
			</span>
		</LazyMotion>
	);
}
