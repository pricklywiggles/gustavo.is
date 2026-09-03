"use client";

import { Mail } from "lucide-react";
import { m, type Variants } from "motion/react";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { cta } from "@/lib/cta";
import type { Tone } from "@/lib/focus-ring";

// Passed unconditionally: a conditional variants prop broke React 19 hydration.
// whileTap emits a tabindex, so its gate must flip only after hydration.
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

/** morphId requires a LazyMotion domMax tree: the morph uses layout projection. */
export function SayHelloButton({
	onClick,
	onIntent,
	morphId,
	surface = "bg-dusk-earth text-first-light hover:bg-dusk-earth/85",
	tone,
}: {
	onClick: () => void;
	/** Hover or focus; hosts prefetch the dialog chunk. */
	onIntent?: () => void;
	/** Shared layout id the contact dialog morphs from; omit for no morph. */
	morphId?: string;
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
