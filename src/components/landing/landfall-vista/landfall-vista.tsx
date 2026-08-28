"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domMax, LazyMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { SayHelloButton } from "@/components/landing/say-hello-button";
import {
	ContactDialog,
	useContactDialogState,
	warmContactDialog,
} from "@/components/lazy-contact-dialog";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { rampColor } from "@/lib/ramp";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CANYON_BROWN = rampColor("canyon-brown");

/**
 * The daytime Pacific vista the descent lands on, in normal flow so it scrolls in under
 * the settled sky stage; the footer lives inside the bluff, ending at document bottom.
 */

/** Sharing the intro's morph id would morph the dialog from the wrong corner. */
const LANDFALL_MORPH_ID = "landfall-hello-morph";

/** Element-based starts are unreliable here: the ground's entry offset can push the
 * measured start past the scrollable range. Module scope keeps the identity stable. */
const nearPageEnd = () =>
	ScrollTrigger.maxScroll(window) - window.innerHeight * 0.45;

/** "high" reads nearest and travels most, but every plane stays below the cliff's 14vh so
 * no sky layer outruns the rock; `to` doubles as the CSS rest pose. */
const CLOUD_PLANES = {
	low: { from: "2vh", to: "-2.5vh" },
	mid: { from: "3.5vh", to: "-5vh" },
	high: { from: "5vh", to: "-7vh" },
} as const;

/** The sun is the most distant object: the smallest travel of all. */
const SUN_TRAVEL = { from: "1.5vh", to: "-1vh" } as const;

/** Rendered back to front; sway timings are distinct and mixed-direction on purpose.
 * Every mobileBox class must carry the max-sm: prefix (Tailwind only generates classes it
 * can see; a test guards it). Exported for that guard only. */
export const SKY_CLOUDS = [
	{
		src: "cloud4",
		w: 1613,
		h: 382,
		plane: "high",
		box: "top-[6%] left-[3%] w-[clamp(160px,28vw,470px)]",
		mobileBox:
			"max-sm:top-[16%] max-sm:left-[3%] max-sm:w-[clamp(160px,28vw,470px)]",
		sway: "motion-safe:animate-[cloud-drift_44s_ease-in-out_infinite_alternate]",
	},
	{
		src: "cloud5",
		w: 1655,
		h: 401,
		plane: "mid",
		box: "top-[15%] right-[5%] w-[clamp(150px,26vw,440px)]",
		mobileBox:
			"max-sm:top-[32%] max-sm:right-[5%] max-sm:w-[clamp(150px,26vw,440px)]",
		sway: "motion-safe:animate-[cloud-drift_38s_ease-in-out_infinite_alternate-reverse]",
	},
	{
		src: "cloud2",
		w: 1587,
		h: 699,
		plane: "mid",
		box: "top-[11%] left-[29%] w-[clamp(160px,26vw,440px)]",
		mobileBox:
			"max-sm:top-[23%] max-sm:left-[29%] max-sm:w-[clamp(160px,26vw,440px)]",
		sway: "motion-safe:animate-[cloud-drift_32s_ease-in-out_infinite_alternate-reverse]",
	},
	{
		src: "cloud6",
		w: 1442,
		h: 514,
		plane: "mid",
		box: "top-[21%] left-[54%] w-[clamp(130px,20vw,340px)]",
		mobileBox:
			"max-sm:top-[21%] max-sm:left-[54%] max-sm:w-[clamp(130px,20vw,340px)]",
		sway: "motion-safe:animate-[cloud-drift_28s_ease-in-out_infinite_alternate]",
	},
	{
		src: "cloud1",
		w: 615,
		h: 900,
		plane: "low",
		box: "top-[17%] left-[7%] w-[clamp(110px,14vw,240px)]",
		mobileBox:
			"max-sm:top-[27%] max-sm:left-[10%] max-sm:w-[clamp(70px,14vw,240px)]",
		sway: "motion-safe:animate-[cloud-drift_24s_ease-in-out_infinite_alternate-reverse]",
	},
	{
		src: "cloud3",
		w: 1632,
		h: 745,
		plane: "high",
		box: "top-[5%] right-[3%] w-[clamp(150px,24vw,410px)]",
		mobileBox:
			"max-sm:top-[10%] max-sm:right-[3%] max-sm:w-[clamp(150px,24vw,410px)]",
		sway: "motion-safe:animate-[cloud-drift_21s_ease-in-out_infinite_alternate]",
	},
] as const;

export function LandfallVista() {
	const root = useRef<HTMLDivElement>(null);
	const hello = useContactDialogState();

	// The shimmer planes are two 150vmax compositor surfaces: animate them only near the
	// viewport. The same observer warms the dialog chunk; the CTA sits just below.
	useEffect(() => {
		const block = root.current?.querySelector<HTMLElement>(
			"[data-vista-shimmer]",
		);
		if (!block) return;
		const layers = [...block.children] as HTMLElement[];
		const setState = (state: string) => {
			for (const el of layers) el.style.animationPlayState = state;
		};
		if (typeof IntersectionObserver === "undefined") {
			setState("running");
			warmContactDialog();
			return;
		}
		const observer = new IntersectionObserver(
			([entry]) => {
				setState(entry.isIntersecting ? "running" : "paused");
				if (entry.isIntersecting) warmContactDialog();
			},
			{ rootMargin: "200px" },
		);
		observer.observe(block);
		return () => observer.disconnect();
	}, []);

	// Every CSS rest pose (inline style.transform; Tailwind's individual properties would
	// COMPOSE with GSAP's) equals its tween's end value, so reduced motion renders settled.
	useGSAP(
		() => {
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				// One timeline, one ScrollTrigger: seven triggers over the same range can
				// resolve fractionally different edges on refresh, desyncing the planes.
				const entryTl = gsap.timeline({
					defaults: { ease: "none", duration: 1 },
					scrollTrigger: {
						trigger: root.current,
						start: "top bottom",
						end: "bottom bottom",
						scrub: true,
					},
				});
				// Distant planes lag, foreground leads. The bank grows from natural size so its
				// side edges never pull into view; bottom origin keeps bases on the horizon.
				entryTl.fromTo(
					"[data-vista-horizon]",
					{ y: "-6vh", scale: 1, transformOrigin: "50% 100%" },
					{ y: "0vh", scale: 1.3 },
					0,
				);
				entryTl.fromTo("[data-vista-sea]", { y: "-3.5vh" }, { y: "0vh" }, 0);
				entryTl.fromTo(
					"[data-vista-sun]",
					{ y: SUN_TRAVEL.from },
					{ y: SUN_TRAVEL.to },
					0,
				);
				for (const [plane, travel] of Object.entries(CLOUD_PLANES)) {
					entryTl.fromTo(
						`[data-vista-cloud="${plane}"]`,
						{ y: travel.from },
						{ y: travel.to },
						0,
					);
				}
				entryTl.fromTo("[data-vista-cliff]", { y: "14vh" }, { y: "0vh" }, 0);
				entryTl.fromTo("[data-vista-ground]", { y: "20vh" }, { y: "0vh" }, 0);
				// Opacity only and one-way: a visibility toggle would drop the CTA from the
				// tab order, and a reversing reveal can hide a focused button.
				gsap.fromTo(
					"[data-vista-fade]",
					{ opacity: 0 },
					{
						opacity: 1,
						duration: 0.7,
						ease: "power2.out",
						stagger: 0.2,
						scrollTrigger: {
							start: nearPageEnd,
							end: () => nearPageEnd() + 1,
							toggleActions: "play none none none",
							invalidateOnRefresh: true,
						},
					},
				);
			});
			return () => mm.revert();
		},
		{ scope: root },
	);

	return (
		// No clipping: the planes settle above their layout spots and must overflow the sky
		// block's top edge; the section clips instead. The 2px tuck stops a subpixel seam.
		// data-surface umbrellas the whole vista; the ground's dusk-ink wins beneath.
		<div
			ref={root}
			data-surface="day-sky"
			data-motion-anchor="flow"
			className="-mt-[2px] relative"
		>
			{/* Day Sky at 0% meets the descent stage's seam; the #CFE4F4 hold sits under the
			    sea image's fade band. Below ~44% is only the loading fallback. */}
			<div
				aria-hidden="true"
				className="relative h-[110vh]"
				style={{
					background:
						"linear-gradient(to bottom, var(--color-day-sky) 0%, #cfe4f4 30%, #cfe4f4 44%, var(--color-open-sea) 47%, var(--color-deep-sea) 100%)",
				}}
			>
				<div
					data-vista-sun
					className="absolute top-[10%] left-[62%] size-[clamp(70px,9vw,130px)] rounded-full bg-noon-sun"
					style={{
						transform: `translateY(${SUN_TRAVEL.to})`,
						boxShadow:
							"0 0 6vh 2vh color-mix(in oklab, var(--color-noon-sun) 55%, transparent)",
					}}
				/>
				{/* The art's horizon sits at 16% of it; a 31.5% top puts that at ~42.5% of the
				    block, its fade over the #CFE4F4 hold. Wide viewports crop only deep water. */}
				<div
					data-vista-sea
					className="absolute inset-x-0 top-[31.5%] bottom-0 overflow-hidden"
				>
					{/* The sea art is perforated at its highlights; two hotspot layers behind it
					    counter-rotate at unrelated periods so their interference peaks different
					    regions at different times. */}
					{/* max(17%, 7.29vw) pins the top to the art's waterline in both cover regimes,
					    inside the opaque band (the glow ramp ends at 15.6% of the image, the first
					    glint hole starts at 18.6%); any higher shows through the glow ramp. */}
					{/* overflow-hidden is load-bearing: the rotating children otherwise paint past
					    this box through the glow ramp. */}
					<div
						data-vista-shimmer
						className="absolute inset-x-0 bottom-0 overflow-hidden bg-[#cee9fe]"
						style={{ top: "max(17%, 7.29vw)" }}
					>
						<div
							className="absolute top-1/2 left-1/2 size-[150vmax] motion-safe:animate-[shimmer-spin_5s_linear_infinite]"
							style={{
								transform: "translate(-50%, -50%)",
								animationPlayState: "paused",
								background: [
									"radial-gradient(circle at 28% 32%, #ffffff 0%, transparent 22%)",
									"radial-gradient(circle at 68% 58%, rgba(255,255,255,0.9) 0%, transparent 26%)",
									"radial-gradient(circle at 44% 78%, rgba(255,255,255,0.8) 0%, transparent 18%)",
								].join(", "),
							}}
						/>
						<div
							className="absolute top-1/2 left-1/2 size-[150vmax] motion-safe:animate-[shimmer-spin_8.1s_linear_infinite_reverse]"
							style={{
								transform: "translate(-50%, -50%)",
								animationPlayState: "paused",
								background: [
									"radial-gradient(circle at 62% 26%, rgba(255,255,255,0.85) 0%, transparent 24%)",
									"radial-gradient(circle at 24% 62%, rgba(255,255,255,0.9) 0%, transparent 20%)",
									"radial-gradient(circle at 76% 76%, rgba(255,255,255,0.75) 0%, transparent 22%)",
								].join(", "),
							}}
						/>
					</div>
					{/* Cover-aware sizes: the cropped pano renders at 2.33x the block height
					    (176vh), so portrait must pick the rung for the CONTENT width. */}
					{/* biome-ignore lint/performance/noImgElement: full-bleed scene layer; next/image adds nothing here */}
					<img
						src="/cta-footer/sea-perforated.webp"
						srcSet="/cta-footer/sea-perforated-1260.webp 1260w, /cta-footer/sea-perforated-2520.webp 2520w, /cta-footer/sea-perforated-3780.webp 3780w, /cta-footer/sea-perforated.webp 5040w"
						sizes="max(100vw, 176vh)"
						alt=""
						width={5040}
						height={2160}
						loading="lazy"
						decoding="async"
						draggable={false}
						className="absolute inset-0 size-full select-none object-cover object-top"
					/>
				</div>
				{/* Bottom 57% is the horizon plus a hair of overlap so the bases rest on water.
				    Sway rides an inner layer; 102% width keeps drift from exposing edge slivers. */}
				<div
					data-vista-horizon
					className="absolute inset-x-0 bottom-[57%]"
					style={{ transform: "scale(1.3)", transformOrigin: "50% 100%" }}
				>
					{/* biome-ignore lint/performance/noImgElement: full-bleed scene layer; next/image adds nothing here */}
					<img
						src="/cta-footer/horizon-clouds.webp"
						alt=""
						width={1536}
						height={385}
						loading="lazy"
						decoding="async"
						draggable={false}
						className="ml-[-1%] block h-auto w-[102%] max-w-none select-none motion-safe:will-change-transform motion-safe:animate-[cloud-drift_30s_ease-in-out_infinite_alternate]"
					/>
				</div>
				{/* Drift rides the inner layer so it never fights the entry tween. */}
				{SKY_CLOUDS.map((cloud) => (
					<div
						key={cloud.src}
						data-vista-cloud={cloud.plane}
						className={`absolute ${cloud.box} ${cloud.mobileBox}`}
						style={{
							transform: `translateY(${CLOUD_PLANES[cloud.plane].to})`,
						}}
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
							className={`h-auto w-full select-none motion-safe:will-change-transform ${cloud.sway}`}
						/>
					</div>
				))}
			</div>

			{/* The cliff and its #D5C6AA land are one piece; the footer ground slides over
			    the land in front. */}
			<div data-vista-cliff className="-mt-[30vh] relative">
				{/* Min-width box: the crest keeps its shape on narrow viewports and fam
				    coordinates stay relative to the art. */}
				<div className="-translate-x-1/2 relative left-1/2 w-[max(100%,880px)]">
					{/* The only in-flow image: intrinsic dimensions keep scrollHeight and the
					    nearPageEnd anchor stable pre-decode, so no refresh on load: the lazy
					    image lands mid-scrub and a forced refresh there dropped frames. */}
					{/* biome-ignore lint/performance/noImgElement: full-bleed scene layer; next/image adds nothing here */}
					<img
						src="/cta-footer/cliff.webp"
						alt=""
						width={2862}
						height={393}
						loading="lazy"
						decoding="async"
						draggable={false}
						className="block h-auto w-full max-w-none select-none"
					/>
					{/* No tween of their own; coordinates are fractions of the art box, so the
					    family stays pinned to the rock at any scroll or screen size. */}
					<div className="-translate-y-full pointer-events-none absolute top-[24%] left-[40%] w-[15%]">
						{/* biome-ignore lint/performance/noImgElement: scene actor inside the parallax plane; next/image adds nothing here */}
						<img
							src="/cta-footer/fam.webp"
							alt="Two figures and a dog sit on the cliff, watching the ocean."
							width={470}
							height={313}
							loading="lazy"
							decoding="async"
							draggable={false}
							className="h-auto w-full select-none"
						/>
					</div>
				</div>
				{/* Land under the cliff; the foreground covers all but a thin band at rest. */}
				<div className="h-[26vh] bg-[#d5c6aa]" />
			</div>
			{/* Rest leaves 2vh of land showing and the entry offset only moves it lower, so
			    it can never rise past the rock's bottom edge. Contrast measured on dusk-earth:
			    first-light copy 7.14:1, button white on canyon-brown 4.58:1. */}
			<div
				data-vista-ground
				data-surface="dusk-ink"
				className="mt-[-24vh] relative z-10 bg-dusk-earth pt-[6vh] pb-8"
			>
				<div className="mx-auto flex w-full max-w-6xl flex-col px-6 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
					<div>
						{/* Play-once: a scrub can't complete this close to the document end. */}
						<ScrollRevealText
							as="h2"
							id="landfall-title"
							direction="right"
							mode="trigger"
							trigger="viewport"
							start={nearPageEnd}
							className="block max-w-[24ch] text-balance font-display text-[clamp(2rem,4vw,3.25rem)] text-first-light leading-[1.1]"
						>
							{"Let's build something together"}
						</ScrollRevealText>
						<p
							data-vista-fade
							className="mt-4 max-w-[52ch] text-first-light/85 leading-[1.6]"
						>
							You made it all the way down. If something here resonated, or you
							have an idea worth building, I&apos;d love to hear about it.
						</p>
					</div>
					<LazyMotion features={domMax}>
						<div data-vista-fade className="mt-8 lg:mt-0 lg:shrink-0">
							<SayHelloButton
								onClick={hello.openDialog}
								onIntent={hello.onIntent}
								morphId={LANDFALL_MORPH_ID}
								surface="bg-canyon-brown text-white hover:bg-canyon-brown/85"
								tone="dark"
							/>
						</div>
						{hello.mounted && (
							<ContactDialog
								open={hello.open}
								source="landfall"
								onOpenChange={hello.setOpen}
								morphId={LANDFALL_MORPH_ID}
								initialColor={CANYON_BROWN}
								settledColor={CANYON_BROWN}
							/>
						)}
					</LazyMotion>
				</div>
			</div>
		</div>
	);
}
