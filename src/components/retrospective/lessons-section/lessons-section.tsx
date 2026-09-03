"use client";

import { ChevronDown } from "lucide-react";
import {
	domAnimation,
	LazyMotion,
	MotionConfig,
	m,
	useReducedMotion,
} from "motion/react";
import { useId, useState } from "react";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import type { Lesson } from "../retrospective-data";
import { SectionHeading } from "../section-heading";
import { Runs } from "../text-runs";

/** Adapted from the Motion accordion example: height auto with a mask fade. */
function LessonItem({
	lesson,
	open,
	onToggle,
}: {
	lesson: Lesson;
	open: boolean;
	onToggle: () => void;
}) {
	const id = useId();

	return (
		<m.section
			initial={false}
			animate={open ? "open" : "closed"}
			className="relative px-6 py-6 sm:px-8"
		>
			<h3 className="m-0">
				<button
					type="button"
					id={`${id}-button`}
					aria-expanded={open}
					aria-controls={id}
					onClick={onToggle}
					className={`flex w-full items-center justify-between gap-6 rounded-md text-left ${FOCUS_OUTLINE.light}`}
				>
					<span className="font-display text-[clamp(1.25rem,2.2vw,1.625rem)] leading-[1.25] text-dusk-ink">
						{lesson.title}
					</span>
					<m.span
						aria-hidden="true"
						variants={{ open: { rotate: 180 }, closed: { rotate: 0 } }}
						className="shrink-0 text-canyon-brown"
					>
						<ChevronDown className="size-6" />
					</m.span>
				</button>
			</h3>
			<m.div
				id={id}
				aria-labelledby={`${id}-button`}
				// height 0 alone still reads aloud, so collapsed prose leaves the a11y tree too.
				aria-hidden={open ? undefined : true}
				inert={!open}
				className="overflow-hidden"
				variants={{
					open: {
						height: "auto",
						maskImage:
							"linear-gradient(to bottom, black 100%, transparent 100%)",
					},
					closed: {
						height: 0,
						maskImage:
							"linear-gradient(to bottom, black 50%, transparent 100%)",
					},
				}}
			>
				<m.div
					variants={{
						open: { filter: "blur(0px)", opacity: 1 },
						closed: { filter: "blur(2px)", opacity: 0 },
					}}
				>
					<p className="max-w-[66ch] pt-6 text-[1.0625rem] leading-[1.5] text-dusk-ink/85">
						<Runs paragraph={lesson.body} />
					</p>
				</m.div>
			</m.div>
			<hr className="absolute right-6 bottom-0 left-6 m-0 border-0 border-dusk-earth/20 border-b sm:right-8 sm:left-8" />
		</m.section>
	);
}

export function LessonsSection({ lessons }: { lessons: Lesson[] }) {
	const reduced = useReducedMotion();
	const [openId, setOpenId] = useState<string | null>(null);

	return (
		<section data-surface="pale-dune" className="bg-pale-dune">
			<div className="mx-auto w-full max-w-4xl px-6 py-24 sm:px-10 md:py-32">
				<SectionHeading tone="light">Lessons learned</SectionHeading>
				<LazyMotion features={domAnimation}>
					<MotionConfig transition={{ duration: reduced ? 0 : 0.3 }}>
						<div className="mt-12 flex flex-col rounded-2xl border border-dusk-earth/25 [&>section:last-child_hr]:hidden">
							{lessons.map((lesson) => (
								<LessonItem
									key={lesson.id}
									lesson={lesson}
									open={openId === lesson.id}
									onToggle={() =>
										setOpenId((prev) => (prev === lesson.id ? null : lesson.id))
									}
								/>
							))}
						</div>
					</MotionConfig>
				</LazyMotion>
			</div>
		</section>
	);
}
