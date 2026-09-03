"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { WarpStarfield } from "@/components/landing/warp-starfield";
import { WarpStarfieldOverlay } from "@/components/landing/warp-starfield-overlay";
import { scrollScrub } from "@/lib/scroll-scrub";
import { scrubIndex, scrubJumpTarget } from "@/lib/scrub";
import { ProjectShowcase } from "../project-showcase";
import { PROJECTS } from "../projects-data";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function OtherProjectsSection() {
	const wrapper = useRef<HTMLElement>(null);
	const overlay = useRef<HTMLDivElement>(null);
	// A reduced-motion flip must remount both: the starfield writes the overlay's inline styles.
	const [motionEpoch, setMotionEpoch] = useState(0);
	const seedProgress = useRef(0);
	const sceneScroll = useRef(0);
	const scrubRef = useRef<ScrollTrigger | null>(null);
	/** Scroll position held while the theater plays; null = free. */
	const lockY = useRef<number | null>(null);
	/** After the theater, the scrub end never locks again. */
	const theaterOver = useRef(false);
	const engageLockRef = useRef<(top: number) => void>(() => {});
	const releaseLockRef = useRef<() => void>(() => {});
	const [active, setActive] = useState(0);

	// Non-passive listeners attach only while engaged: otherwise every scroll frame site-wide pays.
	useEffect(() => {
		const clamp = () => {
			if (lockY.current !== null && window.scrollY !== lockY.current) {
				window.scrollTo({ top: lockY.current, behavior: "instant" });
			}
		};
		const block = (event: Event) => event.preventDefault();
		const scrollKeys = [
			" ",
			"PageDown",
			"PageUp",
			"ArrowDown",
			"ArrowUp",
			"Home",
			"End",
		];
		const blockKeys = (event: KeyboardEvent) => {
			if (scrollKeys.includes(event.key)) event.preventDefault();
		};
		const release = () => {
			if (lockY.current === null) return;
			lockY.current = null;
			window.removeEventListener("scroll", clamp);
			window.removeEventListener("wheel", block);
			window.removeEventListener("touchmove", block);
			window.removeEventListener("keydown", blockKeys);
		};
		const engage = (top: number) => {
			if (lockY.current !== null) return;
			lockY.current = top;
			window.addEventListener("scroll", clamp, { passive: true });
			window.addEventListener("wheel", block, { passive: false });
			window.addEventListener("touchmove", block, { passive: false });
			window.addEventListener("keydown", blockKeys);
			window.scrollTo({ top, behavior: "instant" });
		};
		engageLockRef.current = engage;
		releaseLockRef.current = release;
		// The reduced branch never emits onTheater(false): a flip back would re-lock at progress 1.
		const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onPreferenceChange = () => {
			setMotionEpoch((epoch) => epoch + 1);
			if (reducedQuery.matches) {
				theaterOver.current = true;
				release();
			}
		};
		reducedQuery.addEventListener("change", onPreferenceChange);
		return () => {
			reducedQuery.removeEventListener("change", onPreferenceChange);
			release();
		};
	}, []);

	useGSAP(
		() => {
			// Live query, not a snapshot: a stale one would lock under a since-flipped preference.
			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			);

			ScrollTrigger.create({
				trigger: wrapper.current,
				start: "top top",
				end: "+=200%",
				onUpdate: (self) => {
					seedProgress.current = self.progress;
					// Lock at the trigger's exact end so a fast fling can't carry the showcase in.
					if (
						self.progress >= 1 &&
						!reducedMotion.matches &&
						!theaterOver.current
					) {
						engageLockRef.current(self.end);
					}
				},
				// Assign lockY before scrolling so the clamp listener chases the refreshed end.
				onRefresh: (self) => {
					if (lockY.current === null) return;
					lockY.current = self.end;
					window.scrollTo({ top: self.end, behavior: "instant" });
				},
			});

			const scrub = wrapper.current?.querySelector("[data-projects-scrub]");
			if (!scrub) return;

			ScrollTrigger.create({
				trigger: scrub,
				start: "top bottom",
				end: "bottom bottom",
				onUpdate: (self) => {
					sceneScroll.current = self.progress * (self.end - self.start);
				},
			});

			const locked = {
				trigger: scrub,
				start: "top top",
				end: "bottom bottom",
			} as const;
			// Raw scroll everywhere but iOS, where a catch-up hides the sparse samples.
			const railScrub = scrollScrub();
			// Both axes pinned so the pre-JS scale(0,0) class never leaks into the tween.
			const mm = gsap.matchMedia();
			mm.add("(min-width: 768px)", () => {
				gsap.fromTo(
					"[data-rail-fill]",
					{ scaleX: 1, scaleY: 0 },
					{
						scaleX: 1,
						scaleY: 1,
						ease: "none",
						scrollTrigger: { ...locked, scrub: railScrub },
					},
				);
				gsap.fromTo(
					"[data-rail-tip]",
					{ top: "0%", left: "0%" },
					{
						top: "100%",
						left: "0%",
						ease: "none",
						scrollTrigger: { ...locked, scrub: railScrub },
					},
				);
			});
			mm.add("(max-width: 767px)", () => {
				gsap.fromTo(
					"[data-rail-fill]",
					{ scaleX: 0, scaleY: 1 },
					{
						scaleX: 1,
						scaleY: 1,
						ease: "none",
						scrollTrigger: { ...locked, scrub: railScrub },
					},
				);
				gsap.fromTo(
					"[data-rail-tip]",
					{ left: "0%", top: "0%" },
					{
						left: "100%",
						top: "0%",
						ease: "none",
						scrollTrigger: { ...locked, scrub: railScrub },
					},
				);
			});

			// Clipping while pinned would crop focusable links on short viewports.
			ScrollTrigger.create({
				trigger: scrub,
				start: "bottom bottom",
				// Overflowing panel content must stay clipped until every pixel is offscreen.
				end: "bottom top-=50%",
				toggleClass: {
					targets: "[data-showcase-box]",
					className: "overflow-hidden",
				},
			});

			// Quantized pushes only: a state push per tick would re-render the showcase.
			scrubRef.current = ScrollTrigger.create({
				...locked,
				onUpdate: (self) => {
					const index = scrubIndex(self.progress, PROJECTS.length);
					setActive((prev) => (prev === index ? prev : index));
				},
			});
		},
		{ scope: wrapper },
	);

	const jumpTo = (index: number) => {
		const scrub = scrubRef.current;
		if (!scrub) return;
		const top = scrubJumpTarget(scrub, index, PROJECTS.length);
		// The smooth glide deliberately walks the scrub through every project on the way.
		const reduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)",
		).matches;
		window.scrollTo({ top, behavior: reduced ? "instant" : "smooth" });
	};

	return (
		<section
			ref={wrapper}
			data-surface="dusk-ink"
			data-motion-anchor="scrub"
			className="relative bg-dusk-ink"
		>
			<h2 className="sr-only">Other Tools &amp; Projects</h2>
			<div className="sticky top-0 h-screen overflow-hidden">
				<WarpStarfield
					key={motionEpoch}
					className="absolute inset-0"
					overlay={overlay}
					seedProgress={() => seedProgress.current}
					sceneScroll={() => sceneScroll.current}
					onTheater={(playing) => {
						if (!playing) {
							theaterOver.current = true;
							releaseLockRef.current();
						}
					}}
				/>
			</div>
			{/* The settled scene in document flow, over the stage and under the showcase
			    (z-30): its own track pins it through the lock and releases it at page speed. */}
			<WarpStarfieldOverlay
				key={motionEpoch}
				ref={overlay}
				headline={[["Other"], ["Tools", "&"], ["Projects"]]}
				astronautSrc="/projects/astronaut.webp"
			/>
			{/* Parks the showcase a quarter viewport past the fold at the lock, then a breath of
			    settled sky; reduced motion has no lock, so the headline hands straight to the showcase. */}
			<div aria-hidden="true" className="h-[225vh] motion-reduce:h-0" />
			{/* Motion height is (projectsScrubVh() + 1) * 100vh; the still edition keeps one
			    viewport per project (FRA-189). */}
			<div
				data-projects-scrub
				className="relative h-[1300vh] motion-reduce:h-[700vh]"
			>
				{/* z-30 stays above the landfall stage crossfading in over this section's
				    tail (landing README, invariant 11). */}
				<div
					data-showcase-box
					className="sticky top-0 z-30 flex h-screen items-center"
				>
					<ProjectShowcase
						projects={PROJECTS}
						activeIndex={active}
						onSelect={jumpTo}
					/>
				</div>
			</div>
		</section>
	);
}
