"use client";

import gsap from "gsap";
import { useMemo } from "react";
import {
	AnimatedLines,
	type AnimatedLinesProps,
	type LineEffect,
} from "@/components/animated-lines";

// Reverse-engineered from the champions4good.club headline reveal.
const X_DISTANCE = 80;
// Steeper than the source's 14deg; re-tuned via the Storybook knobs.
const DEFAULT_ANGLE = 40;
const SCALE_Y = 0.95;
const CHAR_DURATION = 1;
const STAGGER = 0.214 * CHAR_DURATION;
const OPACITY_DURATION = 0.4 * CHAR_DURATION;
const EASE = "power3.out";

function skewReveal(
	direction: "left" | "right",
	order: "normal" | "reverse",
	angle: number,
): LineEffect {
	const xFrom = direction === "left" ? -X_DISTANCE : X_DISTANCE;
	const from = order === "reverse" ? "end" : "start";
	return ({ chars, timeline, at }) => {
		gsap.set(chars, { opacity: 0, x: xFrom, skewX: angle, scaleY: SCALE_Y });
		const stagger = { each: STAGGER, from } as const;
		timeline
			.to(
				chars,
				{
					x: 0,
					skewX: 0,
					scaleY: 1,
					duration: CHAR_DURATION,
					ease: EASE,
					stagger,
				},
				at,
			)
			.to(
				chars,
				{ opacity: 1, duration: OPACITY_DURATION, ease: "power2.out", stagger },
				at,
			);
		return CHAR_DURATION + (chars.length - 1) * STAGGER;
	};
}

type ScrollRevealTextProps = Omit<AnimatedLinesProps, "effect"> & {
	direction?: "left" | "right";
	/** Which end resolves first: "normal" the first letter, "reverse" the last. */
	order?: "normal" | "reverse";
	/** Initial skew, in degrees, that each letter straightens out of. */
	angle?: number;
};

/** The end furthest from entry, so the line fills toward the incoming side. */
export function defaultOrderFor(direction: "left" | "right") {
	return direction === "right" ? "normal" : "reverse";
}

export function ScrollRevealText({
	direction = "right",
	order,
	angle = DEFAULT_ANGLE,
	...rest
}: ScrollRevealTextProps) {
	const resolvedOrder = order ?? defaultOrderFor(direction);
	const effect = useMemo(
		() => skewReveal(direction, resolvedOrder, angle),
		[direction, resolvedOrder, angle],
	);
	return <AnimatedLines effect={effect} {...rest} />;
}
