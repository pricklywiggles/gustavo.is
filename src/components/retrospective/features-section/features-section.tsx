"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { startTransition, useRef, useState } from "react";
import { scrubIndex, scrubJumpTarget } from "@/lib/scrub";
import { FeatureShowcase } from "../feature-showcase";
import type { FeatureCard } from "../retrospective-data";
import { SectionHeading } from "../section-heading";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * Motion-safe visitors get a pinned section where scroll walks through the
 * tabs; the trigger pushes state only when the quantized index changes.
 * Reduced motion (and jsdom) falls back to plain click tabs, unpinned.
 */
export function FeaturesSection({ features }: { features: FeatureCard[] }) {
	const section = useRef<HTMLElement>(null);
	const trigger = useRef<ScrollTrigger | null>(null);
	// The view transition slides by travel direction; exit callbacks read this
	// ref at animation time, after state has already moved on.
	const direction = useRef<"next" | "prev">("next");
	const [active, setActive] = useState(features[0]?.id ?? "");

	const goTo = (id: string) => {
		setActive((prev) => {
			if (prev === id) return prev;
			const from = features.findIndex((feature) => feature.id === prev);
			const to = features.findIndex((feature) => feature.id === id);
			direction.current = to >= from ? "next" : "prev";
			return id;
		});
	};

	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				trigger.current = ScrollTrigger.create({
					trigger: section.current,
					pin: true,
					start: "top top",
					end: () => `+=${features.length * window.innerHeight * 0.55}`,
					onUpdate(self) {
						const index = scrubIndex(self.progress, features.length);
						const id = features[index]?.id;
						if (id) startTransition(() => goTo(id));
					},
				});
				return () => {
					trigger.current?.kill();
					trigger.current = null;
				};
			});
			return () => mm.revert();
		},
		{ scope: section },
	);

	const onValueChange = (id: string) => {
		startTransition(() => goTo(id));
		const st = trigger.current;
		const index = features.findIndex((feature) => feature.id === id);
		if (st && index >= 0) {
			window.scrollTo({
				top: scrubJumpTarget(st, index, features.length),
				behavior: "smooth",
			});
		}
	};

	return (
		<section
			ref={section}
			data-surface="dusk-earth"
			className="flex min-h-svh flex-col justify-center bg-dusk-earth"
		>
			<div className="mx-auto w-full max-w-5xl px-6 py-16 sm:px-10">
				<SectionHeading>Feature showcase</SectionHeading>
				<FeatureShowcase
					features={features}
					value={active}
					onValueChange={onValueChange}
					direction={direction}
				/>
			</div>
		</section>
	);
}
