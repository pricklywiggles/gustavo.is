"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";
import { WarpStarfield } from "@/components/landing/warp-starfield";
import { scrubIndex, scrubJumpTarget } from "@/lib/scrub";
import { ProjectShowcase } from "../project-showcase";
import { PROJECTS } from "../projects-data";

// Catch-up (seconds) for the rail scrubs; a bare `true` paints iOS Safari's sparse
// scroll samples as steps (see the hero's SCRUB).
const RAIL_SCRUB = 0.25;

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The warp opener plus the locked showcase over one sticky starfield stage; completing
 * the seed scrub locks the page while the theater plays, then 100vh of scrub per project.
 */
export function OtherProjectsSection() {
	const wrapper = useRef<HTMLElement>(null);
	const seedProgress = useRef(0);
	const sceneScroll = useRef(0);
	const scrubRef = useRef<ScrollTrigger | null>(null);
	/** Page scroll position held while the warp theater plays; null = free. */
	const lockY = useRef<number | null>(null);
	/** Once the theater has played, reaching the scrub end never locks again. */
	const theaterOver = useRef(false);
	const engageLockRef = useRef<(top: number) => void>(() => {});
	const releaseLockRef = useRef<() => void>(() => {});
	const [active, setActive] = useState(0);

	// Theater scroll lock: block inputs and snap back what slips through. Non-passive
	// listeners attach only while engaged, or every scroll frame site-wide pays for them.
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
		// A live reduced-motion flip must end the theater for good: the reduced branch never
		// emits onTheater(false), so a flip back would re-engage the lock at progress 1.
		const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
		const onPreferenceChange = () => {
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
			// Reduced motion never runs the theater, so it must never lock. The query stays
			// live: a snapshot would let the lock engage under a since-flipped preference.
			const reducedMotion = window.matchMedia(
				"(prefers-reduced-motion: reduce)",
			);

			ScrollTrigger.create({
				trigger: wrapper.current,
				start: "top top",
				end: "+=200%",
				onUpdate: (self) => {
					seedProgress.current = self.progress;
					// Lock at the trigger's exact end so even a fast fling can't carry the
					// showcase into view over the warp.
					if (
						self.progress >= 1 &&
						!reducedMotion.matches &&
						!theaterOver.current
					) {
						engageLockRef.current(self.end);
					}
				},
				// The refreshed end is the lock's authoritative position; assign lockY first
				// so the clamp listener chases the new spot.
				onRefresh: (self) => {
					if (lockY.current === null) return;
					lockY.current = self.end;
					window.scrollTo({ top: self.end, behavior: "instant" });
				},
			});

			const scrub = wrapper.current?.querySelector("[data-projects-scrub]");
			if (!scrub) return;

			// Pixels since the showcase began entering; drives the overlay exit and star parallax.
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
			// The rail flips orientation with the panel layout; both scale axes are pinned
			// explicitly so the pre-JS scale(0,0) class never leaks into the animated state.
			const mm = gsap.matchMedia();
			mm.add("(min-width: 768px)", () => {
				gsap.fromTo(
					"[data-rail-fill]",
					{ scaleX: 1, scaleY: 0 },
					{
						scaleX: 1,
						scaleY: 1,
						ease: "none",
						scrollTrigger: { ...locked, scrub: RAIL_SCRUB },
					},
				);
				gsap.fromTo(
					"[data-rail-tip]",
					{ top: "0%", left: "0%" },
					{
						top: "100%",
						left: "0%",
						ease: "none",
						scrollTrigger: { ...locked, scrub: RAIL_SCRUB },
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
						scrollTrigger: { ...locked, scrub: RAIL_SCRUB },
					},
				);
				gsap.fromTo(
					"[data-rail-tip]",
					{ left: "0%", top: "0%" },
					{
						left: "100%",
						top: "0%",
						ease: "none",
						scrollTrigger: { ...locked, scrub: RAIL_SCRUB },
					},
				);
			});

			// Clipping while pinned would crop focusable links on short viewports, so the
			// class toggles on only at release, while the showcase rides off.
			ScrollTrigger.create({
				trigger: scrub,
				start: "bottom bottom",
				// Half a viewport past full exit: overflowing panel content must stay clipped
				// until every pixel is offscreen.
				end: "bottom top-=50%",
				toggleClass: {
					targets: "[data-showcase-box]",
					className: "overflow-hidden",
				},
			});

			// Quantized state pushes only; the functional setState bails when unchanged.
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
		// A smooth glide walks through every project; reduced motion jumps directly.
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
					className="absolute inset-0"
					headline={[["Other"], ["Tools", "&"], ["Projects"]]}
					astronautSrc="/projects/astronaut.webp"
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
			{/* Parks the showcase a quarter viewport past the fold at the lock, then a breath of
			    settled sky; reduced motion has no lock, so the headline hands straight to the showcase. */}
			<div aria-hidden="true" className="h-[225vh] motion-reduce:h-0" />
			<div data-projects-scrub className="relative h-[700vh]">
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
