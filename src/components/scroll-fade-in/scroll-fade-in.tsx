"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { type ElementType, type ReactNode, useRef } from "react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** `gsap.from`, so the copy reads at rest with no JS and under reduced motion. */
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
