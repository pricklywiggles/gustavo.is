"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ElementType, type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * `gsap.from`, not `to`: children are authored in their resting state, so the
 * copy reads with no JS and under reduced motion. Scroll-driven work is GSAP's
 * half of DESIGN.md's two-library rule.
 */
export function ScrollFadeIn({
	as,
	className,
	delay = 0,
	children,
}: {
	as?: ElementType;
	className?: string;
	delay?: number;
	children: ReactNode;
}) {
	const Tag = (as ?? "div") as ElementType;
	const root = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				gsap.from(root.current, {
					opacity: 0,
					y: 24,
					duration: 0.7,
					delay,
					ease: "power3.out",
					scrollTrigger: { trigger: root.current, start: "top 88%" },
				});
			});
			return () => mm.revert();
		},
		{ scope: root, dependencies: [delay] },
	);

	return (
		<Tag ref={root} className={className}>
			{children}
		</Tag>
	);
}
