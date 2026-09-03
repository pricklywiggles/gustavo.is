"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import Image from "next/image";
import { type ReactNode, useRef, useState } from "react";
import { CurtainLink } from "@/components/curtain-link";
import { StarLayer } from "@/components/star-layer";
import { cta } from "@/lib/cta";
import { EASE_OUT_EXPO } from "@/lib/motion-tokens";

gsap.registerPlugin(useGSAP);

const STAR_PLANES = [
	{ seed: 404, count: 80, min: 0.5, max: 1.0 },
	{ seed: 405, count: 40, min: 0.7, max: 1.4 },
] as const;

/** #06070c dips below the One Ramp on purpose: a dusk-ink hole would vanish into the page. */
const CORE_GRADIENT =
	"radial-gradient(circle, #06070c 0%, #06070c 62%, var(--color-dusk-ink) 100%)";
const RING_GRADIENT =
	"conic-gradient(from 15deg, transparent 0deg, var(--color-amber-mirage) 70deg, var(--color-noon-sun) 150deg, color-mix(in oklab, var(--color-amber-mirage) 70%, transparent) 225deg, transparent 305deg)";
const RING_MASK =
	"radial-gradient(closest-side, transparent 58%, #000 66%, #000 86%, transparent 94%)";
const RING_GLOW = [
	"0 0 2.5vmin 0.3vmin color-mix(in oklab, var(--color-amber-mirage) 30%, transparent)",
	"0 0 7vmin 1vmin color-mix(in oklab, var(--color-noon-sun) 15%, transparent)",
].join(", ");
const RING_SPIN_SECONDS = 45;
const DISK_GRADIENT =
	"radial-gradient(ellipse closest-side, var(--color-noon-sun) 0%, var(--color-amber-mirage) 34%, color-mix(in oklab, var(--color-amber-mirage) 55%, transparent) 58%, transparent 100%)";

const CORE_END = 0.02;

type OrbitConfig = {
	name: string;
	duration: number;
	turns: number;
	startAngle: number;
	/** Spawn radius, as a fraction of the stage's min dimension. */
	outer: number;
	/** Starting progress: staggered so the actors' rhythms never sync. */
	seed: number;
	tumble: number;
	repeatDelay: number;
	parked: { angle: number; radius: string; tilt: number };
};

const LEGO_ORBIT: OrbitConfig = {
	name: "lego",
	duration: 9,
	turns: 2.25,
	startAngle: 80,
	outer: 0.42,
	seed: 0.6,
	tumble: 300,
	repeatDelay: 1,
	parked: { angle: 208, radius: "23vmin", tilt: -196 },
};
const UFO_ORBIT: OrbitConfig = {
	name: "ufo",
	duration: 13,
	turns: 1.6,
	startAngle: 150,
	outer: 0.5,
	seed: 0.35,
	tumble: -220,
	repeatDelay: 1.6,
	parked: { angle: 322, radius: "30vmin", tilt: -330 },
};
const STATION_ORBIT: OrbitConfig = {
	name: "station",
	duration: 16,
	turns: 1.35,
	startAngle: 265,
	outer: 0.52,
	seed: 0.45,
	tumble: 160,
	repeatDelay: 2,
	parked: { angle: 74, radius: "38vmin", tilt: -64 },
};
const ACTORS = [LEGO_ORBIT, UFO_ORBIT, STATION_ORBIT];

// Branching `initial` on reduced motion forks the SSR markup: only the transition varies.
const COPY_ENTRANCE = { opacity: 0, y: 18 };
const COPY_TARGET = { opacity: 1, y: 0 };
const COPY_TRANSITION = {
	delay: 0.25,
	duration: 0.55,
	ease: EASE_OUT_EXPO,
};
const INSTANT = { duration: 0 };

/** Nested zero-size layers compose the spiral from plain tweens, no MotionPathPlugin. */
function ActorRig({
	actor,
	children,
}: {
	actor: OrbitConfig;
	children: ReactNode;
}) {
	return (
		<span
			data-actor={actor.name}
			className="pointer-events-none absolute top-1/2 left-1/2 block size-0"
		>
			<span
				data-orbit
				className="block size-0"
				style={{ transform: `rotate(${actor.parked.angle}deg)` }}
			>
				<span
					data-arm
					className="block size-0"
					style={{ transform: `translateX(${actor.parked.radius})` }}
				>
					<span className="-translate-x-1/2 -translate-y-1/2 absolute top-0 left-0 block">
						<span
							data-actor-node
							className="block"
							style={{ transform: `rotate(${actor.parked.tilt}deg)` }}
						>
							{children}
						</span>
					</span>
				</span>
			</span>
		</span>
	);
}

/** GSAP owns the actors and ring, Motion the copy: never the same element (two-library rule). */
export function NotFoundScene() {
	const stageRef = useRef<HTMLElement>(null);
	// Mount snapshot on purpose: truthy on a reduced client's first render, so INSTANT wins.
	const reducedMotion = useReducedMotion();
	const [sizeEpoch, setSizeEpoch] = useState(0);

	useGSAP(
		() => {
			const stage = stageRef.current;
			if (!stage) return;

			// matchMedia so a live Reduce Motion flip reverts to the authored still and rebuilds.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const dim = Math.min(stage.clientWidth, stage.clientHeight);

				gsap.to(stage.querySelector("[data-hole-ring]"), {
					rotation: 360,
					duration: RING_SPIN_SECONDS,
					ease: "none",
					repeat: -1,
				});

				for (const actor of ACTORS) {
					const root = stage.querySelector(`[data-actor="${actor.name}"]`);
					if (!root) continue;
					const orbit = root.querySelector<HTMLElement>("[data-orbit]");
					const arm = root.querySelector<HTMLElement>("[data-arm]");
					const node = root.querySelector<HTMLElement>("[data-actor-node]");
					if (!orbit || !arm || !node) continue;

					const tl = gsap.timeline({
						repeat: -1,
						repeatDelay: actor.repeatDelay,
					});
					tl.fromTo(
						orbit,
						{ rotation: actor.startAngle },
						{
							rotation: actor.startAngle + 360 * actor.turns,
							duration: actor.duration,
							ease: "power1.in",
						},
						0,
					)
						.fromTo(
							arm,
							{ x: actor.outer * dim },
							{
								x: CORE_END * dim,
								duration: actor.duration,
								ease: "power2.in",
							},
							0,
						)
						.fromTo(
							node,
							{ rotation: 0, scale: 1 },
							{
								rotation: actor.tumble,
								scale: 0.08,
								duration: actor.duration,
								ease: "power1.in",
							},
							0,
						)
						.fromTo(
							node,
							{ opacity: 0 },
							{ opacity: 1, duration: actor.duration * 0.04, ease: "none" },
							0,
						)
						.to(
							node,
							{ opacity: 0, duration: actor.duration * 0.08, ease: "none" },
							actor.duration * 0.92,
						);
					tl.progress(actor.seed);
				}

				// Radii are px snapshots; a resize rebuilds, revertOnUpdate restoring the still.
				let debounce: ReturnType<typeof setTimeout> | undefined;
				const observer =
					typeof ResizeObserver === "undefined"
						? null
						: new ResizeObserver(() => {
								const next = Math.min(stage.clientWidth, stage.clientHeight);
								if (Math.abs(next - dim) < 2) return;
								clearTimeout(debounce);
								debounce = setTimeout(() => setSizeEpoch((e) => e + 1), 200);
							});
				observer?.observe(stage);
				return () => {
					observer?.disconnect();
					clearTimeout(debounce);
				};
			});
			return () => mm.revert();
		},
		{ scope: stageRef, dependencies: [sizeEpoch], revertOnUpdate: true },
	);

	return (
		<main
			ref={stageRef}
			data-surface="dusk-ink"
			className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden bg-dusk-ink px-6 py-16 text-center"
		>
			<div aria-hidden="true" className="absolute inset-0">
				{STAR_PLANES.map((plane) => (
					<StarLayer
						key={plane.seed}
						seed={plane.seed}
						count={plane.count}
						minRadius={plane.min}
						maxRadius={plane.max}
						className="absolute inset-0 size-full"
					/>
				))}
			</div>

			{/* Decorative digits: the real heading below carries the semantics. */}
			<div
				aria-hidden="true"
				className="isolate relative flex select-none items-center justify-center font-display text-[clamp(6rem,22vmin,12rem)] text-pale-dune leading-none"
			>
				{/* -z-1 inside the isolated row keeps the band behind the digits; the core
				    occludes its middle so it reads as passing behind the hole. */}
				<span
					className="-z-1 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 block h-[0.14em] w-[2.75em] rounded-[50%]"
					style={{ background: DISK_GRADIENT, filter: "blur(1.5px)" }}
				/>
				<span>4</span>
				<span className="relative mx-[0.05em] inline-flex h-[0.72em] w-[0.72em] items-center justify-center">
					<span
						className="absolute inset-[-0.06em] rounded-full"
						style={{ boxShadow: RING_GLOW }}
					/>
					<span
						data-hole-ring
						className="absolute inset-[-0.06em] rounded-full"
						style={{
							background: RING_GRADIENT,
							WebkitMask: RING_MASK,
							mask: RING_MASK,
						}}
					/>
					<span
						className="absolute inset-[0.02em] rounded-full"
						style={{ background: CORE_GRADIENT }}
					/>
					<ActorRig actor={LEGO_ORBIT}>
						<Image
							src="/lego-hero.webp"
							alt=""
							width={1024}
							height={1536}
							sizes="80px"
							draggable={false}
							// max-w-none: preflight's max-width:100% collapses to 0 in the zero-size rig.
							className="h-auto w-[clamp(44px,7vw,80px)] max-w-none select-none"
						/>
					</ActorRig>
					<ActorRig actor={UFO_ORBIT}>
						{/* biome-ignore lint/performance/noImgElement: next/image cannot
						    optimize an SVG; plain img matches the warp-starfield
						    precedent. */}
						<img
							src="/projects/ufo.svg"
							alt=""
							draggable={false}
							className="h-auto w-[clamp(56px,9vw,112px)] max-w-none select-none"
						/>
					</ActorRig>
					<ActorRig actor={STATION_ORBIT}>
						{/* biome-ignore lint/performance/noImgElement: transform-animated
						    scene actor; next/image adds nothing here (the landfall
						    precedent). */}
						<img
							src="/cta-footer/space-station.webp"
							alt=""
							width={1657}
							height={906}
							loading="lazy"
							decoding="async"
							draggable={false}
							className="h-auto w-[clamp(96px,14vw,180px)] max-w-none select-none"
						/>
					</ActorRig>
				</span>
				<span>4</span>
			</div>

			<LazyMotion features={domAnimation} strict>
				<m.div
					className="relative z-10 mt-8 flex max-w-md flex-col items-center gap-5"
					initial={COPY_ENTRANCE}
					animate={COPY_TARGET}
					transition={reducedMotion ? INSTANT : COPY_TRANSITION}
				>
					<h1 className="text-balance font-display text-[clamp(1.5rem,4vw,2rem)] text-pale-dune leading-[1.15]">
						This page fell past the event horizon.
					</h1>
					<p className="text-pale-dune/85 text-sm leading-[1.6] sm:text-base">
						The address you followed does not exist on gustavo.is. Please accept
						my supermassive apology.
					</p>
					<CurtainLink
						href="/"
						className={`${cta({ tone: "dark" })} mt-1 bg-dusk-earth text-pale-dune hover:bg-canyon-brown`}
					>
						Warp back home
					</CurtainLink>
				</m.div>
			</LazyMotion>
		</main>
	);
}
