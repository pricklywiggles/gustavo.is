"use client";

import { Mail } from "lucide-react";
import { m, type Variants } from "motion/react";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { cta } from "@/lib/cta";
import type { Tone } from "@/lib/focus-ring";

// Passed unconditionally: a conditional variants prop broke React 19 hydration. Reduced
// motion drops whileHover/whileTap instead, post-hydration (whileTap emits a tabindex).
const WAVE_VARIANTS: Variants = {
	rest: {
		rotate: 0,
		y: 0,
		transition: { duration: 0.25, ease: "easeOut" },
	},
	hover: {
		rotate: [0, -14, 10, -6, 0],
		y: [0, -2, 1, 0, 0],
		transition: { duration: 0.55, ease: "easeInOut" },
	},
};

/**
 * The shared "say hello" trigger. Must render inside a LazyMotion tree with
 * domMax features when morphId is set (the dialog morph uses layout
 * projection). `surface` carries the color classes so each section can sit
 * the button on its own ground without forking the component.
 */
export function SayHelloButton({
	onClick,
	onIntent,
	morphId,
	surface = "bg-dusk-earth text-first-light hover:bg-dusk-earth/85",
	tone,
}: {
	onClick: () => void;
	/** First sign of intent (hover/focus): hosts prefetch the dialog chunk. */
	onIntent?: () => void;
	/** Shared layout id the contact dialog morphs from; omit for no morph. */
	morphId?: string;
	/** Background, text, and hover color classes. */
	surface?: string;
	/** The ground the button sits on; picks the focus ring. */
	tone: Tone;
}) {
	const reducedMotion = useReducedMotionLive();
	return (
		<m.button
			type="button"
			onClick={onClick}
			onPointerEnter={onIntent}
			onFocus={onIntent}
			layoutId={reducedMotion ? undefined : morphId}
			style={{ borderRadius: 10 }}
			initial="rest"
			animate="rest"
			whileHover={reducedMotion ? undefined : "hover"}
			whileTap={reducedMotion ? undefined : { scale: 0.97 }}
			className={`${cta({ tone })} ${surface}`}
		>
			<m.span aria-hidden className="flex" variants={WAVE_VARIANTS}>
				<Mail className="size-[18px]" />
			</m.span>
			Say hello
		</m.button>
	);
}
