"use client";

import { Tabs } from "@base-ui/react/tabs";
import {
	AnimatePresence,
	domAnimation,
	LazyMotion,
	m,
	useIsPresent,
	useReducedMotion,
} from "motion/react";
import { type ReactNode, type RefObject, useId, useRef, useState } from "react";
import { FOCUS_OUTLINE, FOCUS_RING } from "@/lib/focus-ring";
import type { FeatureCard } from "../retrospective-data";
import { VideoEmbed } from "../video-embed";

const SLIDE_SPRING = {
	type: "spring",
	visualDuration: 0.4,
	bounce: 0.15,
} as const;

/** popLayout keeps the leaving slide mounted: hence one clipped window, not Base UI panels. */
// A slide riding out must be unreachable to focus and assistive tech.
function SlideGuard({ children }: { children: ReactNode }) {
	const isPresent = useIsPresent();
	return (
		<div inert={!isPresent} aria-hidden={!isPresent || undefined}>
			{children}
		</div>
	);
}

const STRIP = {
	enter: (dir: "next" | "prev") => ({ x: dir === "next" ? "108%" : "-108%" }),
	center: { x: "0%" },
	exit: (dir: "next" | "prev") => ({ x: dir === "next" ? "-108%" : "108%" }),
};

export function FeatureShowcase({
	features,
	value,
	onValueChange,
	direction,
}: {
	features: FeatureCard[];
	value?: string;
	onValueChange?: (id: string) => void;
	direction?: RefObject<"next" | "prev">;
}) {
	const reduced = useReducedMotion();
	const baseId = useId();
	const stageId = `${baseId}-stage`;
	const tabId = (id: string) => `${baseId}-tab-${id}`;
	const [internalValue, setInternalValue] = useState(features[0]?.id ?? "");
	const internalDirection = useRef<"next" | "prev">("next");
	const dir = direction ?? internalDirection;
	const first = features[0];
	if (!first) return null;

	const activeId = value ?? internalValue;
	const active = features.find((feature) => feature.id === activeId) ?? first;

	const handleChange = (id: unknown) => {
		const next = String(id);
		if (value === undefined) {
			const from = features.findIndex(
				(feature) => feature.id === internalValue,
			);
			const to = features.findIndex((feature) => feature.id === next);
			internalDirection.current = to >= from ? "next" : "prev";
			setInternalValue(next);
		} else {
			onValueChange?.(next);
		}
	};

	return (
		<Tabs.Root value={activeId} onValueChange={handleChange} className="mt-10">
			<Tabs.List className="relative flex flex-wrap items-end gap-x-7 gap-y-2 border-pale-dune/25 border-b pb-3">
				{features.map((feature) => (
					<Tabs.Tab
						key={feature.id}
						value={feature.id}
						id={tabId(feature.id)}
						aria-controls={stageId}
						className={`rounded-sm font-display text-[clamp(1.125rem,2vw,1.5rem)] leading-none text-pale-dune/55 transition-colors duration-200 hover:text-pale-dune/85 data-[active]:text-pale-dune ${FOCUS_OUTLINE.dark}`}
					>
						{feature.name}
					</Tabs.Tab>
				))}
				{/* `top`, not translate-y: a % inside a transform resolves against this 1px element.
				    The min() pulls the rule into the row gap when the active row isn't last; on the last row it's 0. */}
				<Tabs.Indicator className="absolute left-0 h-px w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] top-[calc(var(--active-tab-top)+var(--active-tab-height)+0.75rem-min(100%-(var(--active-tab-top)+var(--active-tab-height)+0.75rem),0.5rem))] bg-noon-sun transition-all duration-300 ease-out motion-reduce:transition-none" />
			</Tabs.List>

			<div className="pt-9">
				<div
					role="tabpanel"
					id={stageId}
					aria-labelledby={tabId(active.id)}
					className={`relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl ${FOCUS_RING.dark}`}
				>
					<LazyMotion features={domAnimation}>
						<AnimatePresence
							initial={false}
							custom={dir.current}
							mode="popLayout"
						>
							<m.div
								key={active.id}
								custom={dir.current}
								variants={STRIP}
								initial="enter"
								animate="center"
								exit="exit"
								transition={reduced ? { duration: 0 } : SLIDE_SPRING}
								className="w-full"
							>
								<SlideGuard>
									<VideoEmbed
										src={active.videoUrl}
										title={active.videoTitle}
										name={active.name}
										poster={active.poster}
									/>
								</SlideGuard>
							</m.div>
						</AnimatePresence>
					</LazyMotion>
				</div>
			</div>
		</Tabs.Root>
	);
}
