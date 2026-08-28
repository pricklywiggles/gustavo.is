"use client";

import { type HTMLMotionProps, motion } from "motion/react";

/**
 * Button whose box animates when state changes its content size; the system rule is any
 * button with state-driven content uses this. Full `motion`, so it needs no LazyMotion
 * provider; the layout="position" inner span keeps text from stretching mid-animation.
 *
 * Caveat: a layout child inside a morphing (layoutId) container ALWAYS decouples and
 * drifts on its own spring. Morphing hosts must render layout={false} during the morph
 * and REMOUNT with layout after; toggling without a remount does not re-arm projection.
 */
export function AnimatedButton({
	children,
	transition,
	layout = true,
	...props
}: HTMLMotionProps<"button">) {
	return (
		<motion.button
			layout={layout}
			transition={{
				type: "spring",
				bounce: 0.2,
				visualDuration: 0.3,
				...transition,
			}}
			{...props}
		>
			<motion.span
				layout={layout ? "position" : false}
				className="flex items-center gap-2.5"
			>
				{children}
			</motion.span>
		</motion.button>
	);
}
