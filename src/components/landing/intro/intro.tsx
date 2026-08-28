"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { m, type Variants } from "motion/react";
import { useEffect, useRef } from "react";
import { SayHelloButton } from "@/components/landing/say-hello-button";
import {
	HEADLINE_REVEAL_VH,
	REVEAL_COMPLETE_VH,
} from "@/components/landing/scroll-geometry";
import {
	ContactDialog,
	useContactDialogState,
	warmContactDialog,
} from "@/components/lazy-contact-dialog";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { cta } from "@/lib/cta";
import { rampAlpha } from "@/lib/ramp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Unique per trigger: the landfall CTA mints its own, so the dialog always
 * morphs from the button that opened it. */
const HELLO_MORPH_ID = "say-hello-morph";

/** Module-stable so SSR and reduced-motion clients render identical style
 * attributes; reduced motion disables the whileHover trigger instead. */
const NOD_VARIANTS: Variants = {
	rest: { y: 0, transition: { duration: 0.25, ease: "easeOut" } },
	hover: {
		y: [0, 5, 0],
		transition: {
			duration: 0.7,
			repeat: Number.POSITIVE_INFINITY,
			ease: "easeInOut",
		},
	},
};

// Absolute scroll positions: the intro is held by the hero's sticky reveal, so
// it can't measure its own trigger. Module-level for stable identity.
// Short of the very end: a seek to duration itself flags `ended`, and WebKit has
// painted stale frames on end-of-stream seeks.
const LAST_FRAME_BACKOFF_S = 0.05;

const headlineStart = () => window.innerHeight * REVEAL_COMPLETE_VH;
const bodyFadeStart = () =>
	window.innerHeight * (REVEAL_COMPLETE_VH + HEADLINE_REVEAL_VH);

/**
 * Revealed as the hero sheet scrolls away. Pale Dune deliberately matches the mobile
 * menu's sheet: both "reveal" surfaces share one color in the system.
 */
export function IntroSection() {
	const hello = useContactDialogState();
	const reducedMotion = useReducedMotionLive();
	const rootRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);

	// Reduced motion never plays the scene, so it rests on the last frame (Gustavo at the
	// desk, Kiwi asleep) instead of the empty room; a flip back rewinds for the hero's cue.
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !reducedMotion) return;
		const seekToEnd = () => {
			// A WebM without a Duration element reports Infinity, and the setter throws.
			if (!Number.isFinite(video.duration)) return;
			// A flip mid-play must not keep playing past the seek.
			video.pause();
			video.currentTime = Math.max(0, video.duration - LAST_FRAME_BACKOFF_S);
		};
		if (video.readyState >= HTMLMediaElement.HAVE_METADATA) seekToEnd();
		else video.addEventListener("loadedmetadata", seekToEnd, { once: true });
		return () => {
			video.removeEventListener("loadedmetadata", seekToEnd);
			video.pause();
			video.currentTime = 0;
		};
	}, [reducedMotion]);

	// Touch gets no hover beat for the intent prefetch; the first scroll or touch warms
	// the chunk viewports before any tap can reach a CTA.
	useEffect(() => {
		const warm = () => warmContactDialog();
		window.addEventListener("scroll", warm, { once: true, passive: true });
		window.addEventListener("touchstart", warm, { once: true, passive: true });
		return () => {
			window.removeEventListener("scroll", warm);
			window.removeEventListener("touchstart", warm);
		};
	}, []);

	// matchMedia leaves the body at its rendered visible state under reduced motion.
	useGSAP(
		() => {
			const el = bodyRef.current;
			if (!el) return;
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				gsap.set(el, { autoAlpha: 0, y: 12 });
				gsap.to(el, {
					autoAlpha: 1,
					y: 0,
					duration: 0.6,
					ease: "power2.out",
					scrollTrigger: {
						start: bodyFadeStart,
						end: () => bodyFadeStart() + 1,
						toggleActions: "play none none reverse",
						invalidateOnRefresh: true,
					},
				});
			});
			return () => mm.revert();
		},
		{ scope: rootRef },
	);

	return (
		<section
			aria-labelledby="intro-title"
			data-surface="pale-dune"
			className="flex h-full items-center bg-pale-dune"
		>
			<div className="mx-auto grid w-full max-w-6xl items-center gap-x-14 gap-y-10 px-6 sm:px-10 md:grid-cols-2">
				<video
					ref={videoRef}
					src="/scene_home.webm"
					muted
					playsInline
					preload="metadata"
					aria-hidden="true"
					tabIndex={-1}
					className="w-full max-w-lg justify-self-center md:justify-self-end"
					style={{
						// drop-shadow follows the webm's alpha silhouette (box-shadow draws a
						// rectangle); Dusk Earth, not black, keeps the shadow on the ramp.
						filter: `drop-shadow(0 10px 12px ${rampAlpha("dusk-earth", "0.28")}) drop-shadow(0 30px 44px ${rampAlpha("dusk-earth", "0.16")})`,
					}}
				/>
				<div
					ref={rootRef}
					className="max-w-[44ch] justify-self-center md:justify-self-start"
				>
					<ScrollRevealText
						as="h2"
						id="intro-title"
						trigger="viewport"
						start={headlineStart}
						end={bodyFadeStart}
						className="text-balance font-bold font-display text-[clamp(2.25rem,4.5vw,3.5rem)] text-dusk-ink leading-[1.08] tracking-[-0.01em]"
					>
						{"Hi, I'm Gustavo"}
					</ScrollRevealText>
					<div ref={bodyRef} className="mt-6">
						<p className="text-dusk-ink leading-[1.6]">
							I&apos;m a software engineer generalist in Los Angeles with 26
							years of experience in tech. I&apos;ve shipped everything from
							Microsoft Office features to AI-powered health apps, and the
							agents behind them. Most days you can find me pair programming
							with my dog Kiwi.
						</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<SayHelloButton
								onClick={hello.openDialog}
								onIntent={hello.onIntent}
								morphId={HELLO_MORPH_ID}
								tone="light"
							/>
							{/* Smooth scroll comes from the html element's motion-safe:scroll-smooth. */}
							<m.a
								href="#work"
								initial="rest"
								animate="rest"
								whileHover={reducedMotion ? undefined : "hover"}
								whileTap={reducedMotion ? undefined : { scale: 0.97 }}
								className={`${cta({ variant: "outline", tone: "light" })} border-dusk-earth/30 text-dusk-ink hover:border-dusk-earth/50 hover:bg-amber-mirage/60`}
							>
								See my work
								<m.span aria-hidden className="flex" variants={NOD_VARIANTS}>
									<ArrowDown className="size-[18px]" />
								</m.span>
							</m.a>
						</div>
					</div>
				</div>
			</div>
			{hello.mounted && (
				<ContactDialog
					open={hello.open}
					source="intro"
					onOpenChange={hello.setOpen}
					morphId={HELLO_MORPH_ID}
				/>
			)}
		</section>
	);
}
