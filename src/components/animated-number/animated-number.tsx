"use client";

import { AnimateNumber, type AnimateNumberProps } from "motion-plus/react";
import { useEffect, useRef } from "react";

/**
 * GSAP must never touch these nodes. `trend` uses the last COMMITTED value: the library's
 * render-time ref is zeroed by StrictMode, degrading every roll to a shortest-path rewind.
 */
export function AnimatedNumber({
	className,
	children,
	locales,
	format,
	prefix,
	suffix,
	...rest
}: Omit<AnimateNumberProps, "ref"> & { className?: string }) {
	const numeric = Number(children);
	const committed = useRef(numeric);
	useEffect(() => {
		committed.current = numeric;
	}, [numeric]);
	const trend = Math.sign(numeric - committed.current) || 0;
	// The same string the library builds for its own label.
	const text = `${prefix ?? ""}${new Intl.NumberFormat(locales, format).format(numeric)}${suffix ?? ""}`;

	return (
		<>
			{/* Motion+ puts aria-label on a role-less span, which ARIA prohibits and screen
			    readers drop: hide its markup and carry the value as text instead. */}
			<AnimateNumber
				trend={trend}
				className={className ? `tabular-nums ${className}` : "tabular-nums"}
				locales={locales}
				format={format}
				prefix={prefix}
				suffix={suffix}
				{...rest}
				aria-hidden="true"
			>
				{children}
			</AnimateNumber>
			<span className="sr-only">{text}</span>
		</>
	);
}
