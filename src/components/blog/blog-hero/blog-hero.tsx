"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domAnimation, LazyMotion, m } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
	BLOG_PANO_INITIAL_VW,
	BLOG_PANO_LAYERS,
	BLOG_PANO_SETTLED_VW,
	BLOG_PANO_SKY,
} from "@/components/blog/blog-panorama-data";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { useSteadyFrames } from "@/components/use-steady-frames";
import { EASE_OUT_EXPO } from "@/lib/motion-tokens";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * One synchronized move: every layer travels its own delta on the same clock and ease,
 * so intermediate frames are coherent blends of the two authored states.
 */
const TRANSITION = {
	delay: 0.35,
	duration: 1.3,
	ease: EASE_OUT_EXPO,
};

/**
 * Depth derives from the entrance deltas (depth = 1 - dy/max) so the scroll parallax
 * continues the same multiplane model; the ground plane (depth 0) stays glued to the page.
 */
const PARALLAX_REACH = 0.4;
/** The settled strip's pixel height; vw-derived, so resize-stable via refresh. */
const settledHeightPx = () => (BLOG_PANO_SETTLED_VW / 100) * window.innerWidth;
const MAX_DY = Math.max(...BLOG_PANO_LAYERS.map((l) => l.dy));
const depthOf = (dy: number) => +(1 - dy / MAX_DY).toFixed(3);

/**
 * Loads at the full composition, then compresses upward to a settled strip. Motion owns
 * the load entrance on INNER elements; GSAP scroll tweens own the OUTER wrappers.
 */
export function BlogHero() {
	// False on the server and first client render, so SSR markup carries the full
	// composition; the re-render snaps reduced clients settled via the zero-duration path.
	const reducedMotion = useReducedMotionLive();
	const steady = useSteadyFrames();
	const stageRef = useRef<HTMLDivElement>(null);

	// Hold the entrance until the layers decode (bounded at 1.5s), so a slow connection
	// can't pop late images into the middle of the synchronized settle.
	const [decoded, setDecoded] = useState(false);
	useEffect(() => {
		let finished = false;
		const finish = () => {
			if (!finished) {
				finished = true;
				setDecoded(true);
			}
		};
		const timeout = setTimeout(finish, 1500);
		const imgs = Array.from(stageRef.current?.querySelectorAll("img") ?? []);
		Promise.allSettled(imgs.map((img) => img.decode())).then(finish);
		return () => clearTimeout(timeout);
	}, []);

	// Hold until frames render steadily: the post-hydration stall can outlast the whole
	// move, snapping the scene straight to its end state.
	const play = reducedMotion || (steady && decoded);

	useGSAP(
		() => {
			const stage = stageRef.current;
			if (!stage) return;

			// matchMedia, not a one-shot check: a mid-session Reduce Motion toggle reverts
			// the scrubs and re-creates them on the way back.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				for (const el of stage.querySelectorAll<HTMLElement>(
					"[data-blog-parallax]",
				)) {
					const depth = Number.parseFloat(el.dataset.blogParallax ?? "0");
					if (!depth) continue;
					gsap.to(el, {
						// The settled-height constant, never a live measurement: the height
						// animates after load, and mid-entrance geometry jumps at the refresh.
						y: () => PARALLAX_REACH * depth * settledHeightPx(),
						ease: "none",
						scrollTrigger: {
							trigger: stage,
							start: "top top",
							end: () => `+=${settledHeightPx()}`,
							scrub: true,
							invalidateOnRefresh: true,
						},
					});
				}
			});
			return () => mm.revert();
		},
		{ scope: stageRef },
	);

	const settle = (dx: number, dy: number) =>
		play ? { x: "0vw", y: "0vw" } : { x: `${dx}vw`, y: `${dy}vw` };

	// sizes is each layer's authored vw width: a blanket 100vw would let a 3.47vw tower
	// claim the viewport and drag the full-resolution source onto a phone.
	const srcSetOf = (layer: (typeof BLOG_PANO_LAYERS)[number]) =>
		layer.srcWidths
			? [
					...layer.srcWidths.variants.map(
						(w) => `${layer.src.replace(/\.webp$/, `.w${w}.webp`)} ${w}w`,
					),
					`${layer.src} ${layer.srcWidths.native}w`,
				].join(", ")
			: undefined;

	return (
		<LazyMotion features={domAnimation} strict>
			<m.div
				ref={stageRef}
				aria-hidden="true"
				className="relative w-full overflow-hidden"
				style={{ background: BLOG_PANO_SKY }}
				initial={
					reducedMotion ? false : { height: `${BLOG_PANO_INITIAL_VW}vw` }
				}
				animate={{
					height: play
						? `${BLOG_PANO_SETTLED_VW}vw`
						: `${BLOG_PANO_INITIAL_VW}vw`,
				}}
				transition={reducedMotion ? { duration: 0 } : TRANSITION}
				// The settle changes every layer's document position; refresh re-measures the tweens.
				onAnimationComplete={() => ScrollTrigger.refresh()}
			>
				{BLOG_PANO_LAYERS.map((layer) => {
					const { src, left, top, width, dx, dy } = layer;
					return (
						// Outer wrapper GSAP, inner image Motion. Preflight clamps img to
						// max-width 100%; w-full sizes it to the wrapper's authored width.
						<div
							key={src}
							data-blog-parallax={depthOf(dy)}
							className="absolute"
							style={{
								left: `${left}vw`,
								top: `${top}vw`,
								width: `${width}vw`,
							}}
						>
							{/* biome-ignore lint/performance/noImgElement: layered scene sprites animate as plain elements; next/image adds nothing here */}
							<m.img
								src={src}
								srcSet={srcSetOf(layer)}
								sizes={layer.srcWidths ? `${width}vw` : undefined}
								alt=""
								decoding="async"
								className="block w-full max-w-none"
								initial={reducedMotion ? false : { x: `${dx}vw`, y: `${dy}vw` }}
								animate={settle(dx, dy)}
								transition={reducedMotion ? { duration: 0 } : TRANSITION}
							/>
						</div>
					);
				})}
			</m.div>
		</LazyMotion>
	);
}
