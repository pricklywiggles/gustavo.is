"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { m, type Variants } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
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
import { isIOSDevice } from "@/lib/ios-device";
import { rampAlpha } from "@/lib/ramp";
import { scrollScrub } from "@/lib/scroll-scrub";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Per trigger: the dialog morphs from the button that opened it (landfall mints its own). */
const HELLO_MORPH_ID = "say-hello-morph";

/** Module-stable so SSR and reduced-motion clients emit identical style attributes. */
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

// Short of the very end: seeking to duration flags `ended`, and WebKit paints stale frames.
const LAST_FRAME_BACKOFF_S = 0.05;

// Only WebKit renders HEVC alpha and only WebKit exposes webkitPresentationMode; rest get VP9.
// A <source> list can't decide it: Firefox on macOS decodes the HEVC file too, opaque.
const sceneSrc = (video: HTMLVideoElement) =>
	"webkitPresentationMode" in video ? "/scene_home.mov" : "/scene_home.webm";

// offsetHeight, not innerHeight: iOS Safari's innerHeight tracks the toolbar, not the CSS vh.
const viewportHeight = (section: HTMLElement | null) =>
	section?.offsetHeight || window.innerHeight;

/** Pale Dune matches the mobile menu's sheet: reveal surfaces share one color. */
export function IntroSection() {
	const hello = useContactDialogState();
	const reducedMotion = useReducedMotionLive();
	const sectionRef = useRef<HTMLElement>(null);
	const rootRef = useRef<HTMLDivElement>(null);
	const bodyRef = useRef<HTMLDivElement>(null);
	const videoRef = useRef<HTMLVideoElement>(null);
	// Stable identities: AnimatedLines rebuilds its trigger when start/end change.
	const headlineStart = useCallback(
		() => viewportHeight(sectionRef.current) * REVEAL_COMPLETE_VH,
		[],
	);
	const bodyFadeStart = useCallback(
		() =>
			viewportHeight(sectionRef.current) *
			(REVEAL_COMPLETE_VH + HEADLINE_REVEAL_VH),
		[],
	);
	// No hydration risk: the scrub value reaches GSAP only, never the DOM.
	const headlineScrub = scrollScrub();

	// A filter on a playing video re-renders every video frame, under the hole's clip raster.
	useLayoutEffect(() => {
		const video = videoRef.current;
		if (video && isIOSDevice()) video.style.filter = "none";
	}, []);

	// Set here, not in markup: a listed source is fetched at parse time, before this can choose.
	// Ordered before the reduced-motion effect so the source precedes its metadata wait.
	useEffect(() => {
		const video = videoRef.current;
		if (video && !video.getAttribute("src")) video.src = sceneSrc(video);
	}, []);

	// Reduced motion rests on the finished-room last frame; a flip back rewinds for the cue.
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !reducedMotion) return;
		const seekToEnd = () => {
			// A WebM without a Duration element reports Infinity, and the setter throws.
			if (!Number.isFinite(video.duration)) return;
			// The flip can land mid-play.
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

	// Touch has no hover to prefetch on; the first scroll or touch warms the chunk instead.
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
			ref={sectionRef}
			aria-labelledby="intro-title"
			data-surface="pale-dune"
			className="flex h-full items-center bg-pale-dune"
		>
			<div className="mx-auto grid w-full max-w-6xl items-center gap-x-14 gap-y-10 px-6 sm:px-10 md:grid-cols-2">
				<video
					ref={videoRef}
					muted
					playsInline
					preload="metadata"
					aria-hidden="true"
					tabIndex={-1}
					className="w-full max-w-lg justify-self-center md:justify-self-end"
					style={{
						// Follows the alpha silhouette; Dusk Earth keeps the shadow on the ramp.
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
						scrub={headlineScrub}
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
