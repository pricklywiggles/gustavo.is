"use client";

import { type HTMLMotionProps, motion } from "motion/react";

/**
 * The system's button for state-driven content; layout="position" stops text stretching.
 * Caveat: a layout child inside a morphing (layoutId) container decouples onto its own
 * spring, so morphing hosts must render layout={false} and then REMOUNT with layout.
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
