"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";
import { StarLayer } from "@/components/star-layer";
import { scrollScrub } from "@/lib/scroll-scrub";
import { LandfallVista } from "../landfall-vista";
import { type PhaseSpec, resolvePhases } from "../scroll-phases";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/**
 * The descent scrub. Timeline seconds are viewport-heights; the 200vh pull-up plus the
 * fade and hold lengths are the handoff contract with other-projects.tsx (README inv. 11).
 */
const PHASES: PhaseSpec[] = [
	/** Crossfade over the pinned projects canvas; both skies motionless. */
	{ id: "fade", len: 1 },
	/** Pinned sky while the showcase panel exits above the stage. */
	{ id: "hold", len: 1 },
	/** Stars alone; the station crosses the frame. */
	{ id: "drift", len: 1.75 },
	/** The atmosphere's glow crests the bottom edge, then the limb itself. */
	{ id: "limb", len: 1.75 },
	/** Into the glow: deep blue floods up, stars wash out. */
	{ id: "entry", len: 1.5 },
	/** Daylight: deep blue crossfades to day sky, the sun blooms. */
	{ id: "day", len: 1.25 },
	/** The cloud deck streams past, overlapping the daylight turn. */
	{ id: "clouds", len: 1.75, with: "day", offset: 0.5 },
	/** Clean sky breather before the vista scrolls in. */
	{ id: "settle", len: 0.5 },
];
export const DESCENT_PHASE = resolvePhases(PHASES);

/** Deeper layers travel less; travel spans the full pin so the parallax never stops
 * while stars are visible (they fade during entry). */
const STAR_LAYERS = [
	{ name: "far", seed: 11, count: 90, min: 0.5, max: 1.0, travel: -22 },
	{ name: "mid", seed: 23, count: 60, min: 0.7, max: 1.4, travel: -48 },
	{ name: "near", seed: 47, count: 34, min: 0.9, max: 2.0, travel: -85 },
] as const;

/**
 * Cirrus leads, cumulus follow. Every slot ends exactly at the settle boundary, so a
 * later `at` means a faster cloud; travel derives from rendered height at run time.
 */
export const CLOUD_SLOTS = [
	{ src: "cloud9-high", w: 1463, h: 203, left: "8%", width: "44vw", at: 0 },
	{
		src: "cloud10-high",
		w: 1436,
		h: 141,
		left: "55%",
		width: "42vw",
		at: 0.15,
	},
	{ src: "cloud4", w: 1613, h: 382, left: "2%", width: "38vw", at: 0.65 },
	{ src: "cloud2", w: 1587, h: 699, left: "52%", width: "45vw", at: 0.8 },
	{ src: "cloud6", w: 1442, h: 514, left: "62%", width: "40vw", at: 1.05 },
	{ src: "cloud3", w: 1632, h: 745, left: "-8%", width: "55vw", at: 1.2 },
] as const;

/** The limb's glow, shared by the scrubbed earth and the reduced-motion still. */
const EARTH_RIM_GLOW = [
	"0 -1vh 3vh 0.5vh color-mix(in oklab, var(--color-day-sky) 80%, transparent)",
	"0 -4vh 14vh 2vh color-mix(in oklab, var(--color-zenith-blue) 55%, transparent)",
	"inset 0 2vh 3vh -1vh color-mix(in oklab, var(--color-first-light) 80%, transparent)",
].join(", ");

/** The still's sky: space at the top, the entry flood, day sky at the vista seam. */
const STILL_SKY =
	"linear-gradient(to bottom, var(--color-dusk-ink) 0%, var(--color-stratos) 40%, var(--color-zenith-blue) 62%, var(--color-day-sky) 100%)";

export function LandfallSection() {
	const wrapper = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			// Reduced motion collapses the scrub to one static frame; layers rest at CSS state.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const at = DESCENT_PHASE.at;
				const len = DESCENT_PHASE.len;
				const tl = gsap.timeline({
					defaults: { ease: "none" },
					scrollTrigger: {
						trigger: "[data-descent]",
						start: "top top",
						end: "bottom bottom",
						// Raw scroll everywhere but iOS, whose sparse samples stepped the earth's
						// swell and the cloud deck (FRA-185).
						scrub: scrollScrub(),
						// Cloud travel is a function of rendered height; re-derive on refresh.
						invalidateOnRefresh: true,
					},
				});

				// Handoff dissolve over the pinned projects canvas; immediateRender parks the
				// stage invisible until the fade starts.
				tl.fromTo(
					"[data-descent-stage]",
					{ autoAlpha: 0 },
					{ autoAlpha: 1, duration: len.fade },
					at.fade,
				);

				// Stars drift from the first pinned pixel; no pause at the handoff.
				for (const layer of STAR_LAYERS) {
					tl.fromTo(
						`[data-star-layer="${layer.name}"]`,
						{ y: "0vh" },
						{ y: `${layer.travel}vh`, duration: DESCENT_PHASE.total },
						0,
					);
				}

				// The start pose (top 24% + 80vh) keeps the station below the fold until its crossing.
				tl.fromTo(
					"[data-descent-station]",
					{ y: "80vh", x: "4vw", rotate: -7 },
					{
						y: "-80vh",
						x: "-3vw",
						rotate: 4,
						duration: at.entry - at.drift,
					},
					at.drift,
				);

				// Glow-first rise; the entry swell flattens the horizon as we fall toward it.
				tl.fromTo(
					"[data-descent-earth]",
					{ y: "0vh" },
					{
						y: "-56vh",
						duration: len.limb + len.entry * 0.6,
						ease: "power1.out",
					},
					at.limb,
				);
				tl.to(
					"[data-descent-earth]",
					{ scale: 1.9, duration: len.entry },
					at.entry,
				);

				tl.fromTo(
					"[data-descent-veil-entry]",
					{ autoAlpha: 0 },
					{ autoAlpha: 1, duration: len.entry * 0.9 },
					at.entry,
				);
				tl.to(
					"[data-descent-starfield]",
					{ autoAlpha: 0, duration: 1 },
					at.entry + 0.2,
				);

				tl.fromTo(
					"[data-descent-veil-day]",
					{ autoAlpha: 0 },
					{ autoAlpha: 1, duration: len.day },
					at.day,
				);
				for (const [i, cloud] of CLOUD_SLOTS.entries()) {
					const start = at.clouds + cloud.at;
					tl.fromTo(
						`[data-cloud-slot="${i}"]`,
						{ y: "0vh" },
						{
							// Clear the frame (viewport + own height + margin) by the settle
							// boundary, so the breather is a clean sky.
							y: () => {
								const el = document.querySelector<HTMLElement>(
									`[data-cloud-slot="${i}"]`,
								);
								const heightVh = el
									? (el.offsetHeight / window.innerHeight) * 100
									: 50;
								return `-${105 + heightVh}vh`;
							},
							duration: at.settle - start,
						},
						start,
					);
				}
			});
			return () => mm.revert();
		},
		{ scope: wrapper },
	);

	return (
		// No section background: nothing opaque may rise over the projects canvas before
		// the fade. Clip HERE so the bluff's entry offset cannot extend scroll past the
		// document end while vista sky art may still overflow its own block's top edge.
		<section
			ref={wrapper}
			data-landfall
			className="-mt-[200vh] relative overflow-y-clip motion-reduce:mt-0"
		>
			{/* noscript rather than @media (scripting): its support floor postdates the
			    target browsers. Accepted gap: hydration failure degrades to a hidden stage. */}
			<noscript>
				<style>{`
					[data-landfall] { margin-top: 0 !important; }
					[data-landfall] [data-descent] { height: auto !important; }
					[data-landfall] [data-descent-stage] { opacity: 1 !important; position: relative !important; }
					[data-landfall] [data-descent-still] { display: block !important; }
				`}</style>
			</noscript>
			{/* Height must stay (DESCENT_PHASE.total + 1) * 100vh; a test pins it. Reduced
			    motion: auto, so this one scrub anchor spans stage and still (README). */}
			<div
				data-descent
				data-surface="dusk-ink"
				data-motion-anchor="scrub"
				className="relative h-auto motion-safe:h-[1075vh]"
			>
				{/* motion-safe:opacity-0 mirrors the GSAP matchMedia condition: no pre-hydration
				    flash on motion loads; reduced motion keeps the static frame visible. */}
				<div
					data-descent-stage
					aria-hidden="true"
					className="sticky top-0 h-screen overflow-hidden bg-dusk-ink motion-safe:opacity-0 motion-reduce:relative"
				>
					{/* Taller than the stage so upward travel keeps revealing fresh sky from below. */}
					<div data-descent-starfield className="absolute inset-0">
						{STAR_LAYERS.map((layer) => (
							<div
								key={layer.name}
								data-star-layer={layer.name}
								className="absolute inset-x-0 top-0 h-[200vh]"
							>
								<StarLayer
									seed={layer.seed}
									count={layer.count}
									minRadius={layer.min}
									maxRadius={layer.max}
									className="size-full"
								/>
							</div>
						))}
					</div>

					<div
						data-descent-station
						className="absolute top-[24%] left-[54%] w-[clamp(260px,34vw,560px)]"
					>
						{/* The bob rides its own inner layer so it never fights the scroll tween. */}
						<div className="motion-safe:animate-[float-bob_3.4s_ease-in-out_infinite_alternate]">
							{/* biome-ignore lint/performance/noImgElement: transform-animated scene actor; next/image adds nothing here */}
							<img
								src="/cta-footer/space-station.webp"
								alt=""
								width={1657}
								height={906}
								loading="lazy"
								decoding="async"
								draggable={false}
								className="h-auto w-full max-w-none select-none"
							/>
						</div>
					</div>

					{/* Only the glowing upper limb shows; centered via margin so GSAP owns the
					    transform. */}
					<div
						data-descent-earth
						className="absolute top-full left-1/2 ml-[-160vw] aspect-square w-[320vw] origin-top rounded-full"
						style={{
							background:
								"linear-gradient(to bottom, var(--color-day-sky) 0%, var(--color-open-sea) 3%, var(--color-deep-sea) 9%, var(--color-dusk-ink) 22%)",
							boxShadow: EARTH_RIM_GLOW,
						}}
					/>

					{/* The veils animate opacity only, never background colors. */}
					<div
						data-descent-veil-entry
						className="absolute inset-0 opacity-0"
						style={{
							background:
								"linear-gradient(to bottom, var(--color-stratos), var(--color-zenith-blue))",
						}}
					/>
					<div
						data-descent-veil-day
						className="absolute inset-0 opacity-0"
						style={{
							background:
								"linear-gradient(to bottom, var(--color-zenith-blue), var(--color-day-sky) 55%)",
						}}
					/>
					<div className="absolute inset-0">
						{CLOUD_SLOTS.map((cloud, i) => (
							<div
								key={cloud.src}
								data-cloud-slot={i}
								className="absolute top-full"
								style={{ left: cloud.left, width: cloud.width }}
							>
								{/* biome-ignore lint/performance/noImgElement: transform-animated scene actor; next/image adds nothing here */}
								<img
									src={`/cta-footer/${cloud.src}.webp`}
									alt=""
									width={cloud.w}
									height={cloud.h}
									loading="lazy"
									decoding="async"
									draggable={false}
									className="h-auto w-full max-w-none select-none"
								/>
							</div>
						))}
					</div>
				</div>
				{/* Reduced motion only: the scrub's atmosphere beats as one still after the
				    stage. None of the timeline's data-* hooks may appear inside it. */}
				<div
					data-descent-still
					aria-hidden="true"
					className="relative hidden h-screen overflow-hidden motion-reduce:block"
					style={{ background: STILL_SKY }}
				>
					<div
						className="absolute inset-x-0 top-0 h-[62%]"
						style={{
							maskImage: "linear-gradient(to bottom, black 30%, transparent)",
						}}
					>
						<StarLayer
							seed={61}
							count={70}
							minRadius={0.5}
							maxRadius={1.2}
							className="size-full"
						/>
					</div>
					{/* Glow only: the still's own gradient is the planet's body. */}
					<div
						className="absolute top-[60%] left-1/2 ml-[-160vw] aspect-square w-[320vw] rounded-full"
						style={{ boxShadow: EARTH_RIM_GLOW }}
					/>
				</div>
			</div>
			<LandfallVista />
		</section>
	);
}
