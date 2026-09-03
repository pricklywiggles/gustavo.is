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

/** One clock for every layer: intermediate frames are blends of the two authored states. */
const TRANSITION = {
	delay: 0.35,
	duration: 1.3,
	ease: EASE_OUT_EXPO,
};

/** Depth reuses the entrance deltas so parallax continues the same multiplane model. */
const PARALLAX_REACH = 0.4;
const settledHeightPx = () => (BLOG_PANO_SETTLED_VW / 100) * window.innerWidth;
const MAX_DY = Math.max(...BLOG_PANO_LAYERS.map((l) => l.dy));
const depthOf = (dy: number) => +(1 - dy / MAX_DY).toFixed(3);

/** Motion owns the load entrance on the inner images; GSAP owns the outer wrappers. */
export function BlogHero() {
	// False on the server and first client render, so SSR markup carries the full composition.
	const reducedMotion = useReducedMotionLive();
	const steady = useSteadyFrames();
	const stageRef = useRef<HTMLDivElement>(null);

	// The entrance waits for decode (1.5s cap): late images must not pop in mid-settle.
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

	// The post-hydration stall can outlast the move, snapping the scene to its end state.
	const play = reducedMotion || (steady && decoded);

	useGSAP(
		() => {
			const stage = stageRef.current;
			if (!stage) return;

			// matchMedia so a mid-session Reduce Motion toggle reverts the scrubs and rebuilds.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				for (const el of stage.querySelectorAll<HTMLElement>(
					"[data-blog-parallax]",
				)) {
					const depth = Number.parseFloat(el.dataset.blogParallax ?? "0");
					if (!depth) continue;
					gsap.to(el, {
						// The constant, never a live measurement: the height is still animating.
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

	// sizes is the layer's authored vw: 100vw would drag full-resolution sources onto phones.
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
				// The settle changes every layer's document position.
				onAnimationComplete={() => ScrollTrigger.refresh()}
			>
				{BLOG_PANO_LAYERS.map((layer) => {
					const { src, left, top, width, dx, dy } = layer;
					return (
						// w-full sizes to the wrapper's authored vw; max-w-none defeats preflight's clamp.
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
