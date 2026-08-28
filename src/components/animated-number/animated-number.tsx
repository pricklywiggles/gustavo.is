"use client";

import { AnimateNumber, type AnimateNumberProps } from "motion-plus/react";
import { useEffect, useRef } from "react";

/**
 * AnimateNumber locked to tabular digits so widths never jitter; GSAP never touches
 * these nodes. `trend` comes from the last COMMITTED value: the library mutates a ref
 * during render, which StrictMode's double-render zeroes, degrading every roll to a
 * shortest-path rewind.
 */
export function AnimatedNumber({
	className,
	children,
	...rest
}: Omit<AnimateNumberProps, "ref"> & { className?: string }) {
	const numeric = Number(children);
	const committed = useRef(numeric);
	useEffect(() => {
		committed.current = numeric;
	}, [numeric]);
	const trend = Math.sign(numeric - committed.current) || 0;

	return (
		<AnimateNumber
			trend={trend}
			className={className ? `tabular-nums ${className}` : "tabular-nums"}
			{...rest}
		>
			{children}
		</AnimateNumber>
	);
}
