"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { domMax, LazyMotion, m } from "motion/react";
import Image from "next/image";
import { type CSSProperties, useRef } from "react";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { useSteadyFrames } from "@/components/use-steady-frames";
import { EASE_OUT_EXPO, SUN_CREST_SPRING } from "@/lib/motion-tokens";
import { RAMP_HEX } from "@/lib/ramp";
import {
	PIN_VH,
	REVEAL_DELAY_VH,
	REVEAL_LENGTH_VH,
	SHEET_VH,
	TEXT_REVEAL_VH,
	WRAPPER_VH,
} from "../scroll-geometry";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const PARALLAX = {
	sky1: 0.02,
	sky2: 0.05,
	sky3: 0.08,
	sun: 0.06,
	ground1: 0.15,
	ground2: 0.25,
	ground3: 0.35,
	ground4: 0.45,
	character: 0.35, // matches ground3 so character stands on that band
};

// The tokens' exact sRGB twins (the palette was derived from this hero); hex because the
// entrance and GSAP tweens slide plain-style backgrounds around.
const COLORS = {
	sky1: RAMP_HEX["pale-dune"],
	sky2: RAMP_HEX["amber-mirage"],
	sky3: RAMP_HEX["horizon-blaze"],
	sun: RAMP_HEX["noon-sun"],
	ground1: RAMP_HEX["dune-tan"],
	ground2: RAMP_HEX["desert-clay"],
	ground3: RAMP_HEX["canyon-brown"],
	ground4: RAMP_HEX["dusk-earth"],
};

const HORIZON_PCT = 60;

// Visible sky band height grows by 3/2 toward the horizon within the 60% sky:
// s1 shows 12.6%, s2 18.9%, s3 28.4% (down to the horizon).
const SKY_TOPS = {
	s1: 0.0,
	s2: 11.6,
	s3: 20.5,
};

// Visible ground band height shrinks by 2/3 toward the horizon within the 40% below it:
// g4 shows 16.6%, g3 11.1%, g2 7.4%, g1 4.9%.
const GROUND_TOPS = {
	g1: 60.0,
	g2: 64.9,
	g3: 72.3,
	g4: 83.4,
};

// Scroll progress at which the ground bands have collapsed to the horizon:
// (g4 top - horizon) / ground4 factor = 23.4 / 45, about 0.52.
const CONVERGENCE_PROGRESS = 0.55;

const SHRINK_SCALE = 0.1;

// The entrance separates bands from a bunched pose (`bunchedTop`) to their tops, closest
// edges leading (`step`); g1 never moves, it IS the line the scene grows from. Entrance
// transforms live on INNER elements, GSAP scroll tweens on OUTER layers, never sharing one.
const SKY_BANDS = [
	{
		parallax: PARALLAX.sky2,
		top: SKY_TOPS.s2,
		color: COLORS.sky2,
		bunchedTop: 31,
		step: 1,
	},
	{
		parallax: PARALLAX.sky3,
		top: SKY_TOPS.s3,
		color: COLORS.sky3,
		bunchedTop: 35,
		step: 0,
	},
];

const GROUND_BANDS = [
	{
		parallax: PARALLAX.ground1,
		top: GROUND_TOPS.g1,
		color: COLORS.ground1,
		bunchedTop: 60, // the horizon anchor: zero travel
		step: 0,
	},
	{
		parallax: PARALLAX.ground2,
		top: GROUND_TOPS.g2,
		color: COLORS.ground2,
		bunchedTop: 62,
		step: 0,
	},
	{
		parallax: PARALLAX.ground3,
		top: GROUND_TOPS.g3,
		color: COLORS.ground3,
		bunchedTop: 64,
		step: 1,
	},
	{
		parallax: PARALLAX.ground4,
		top: GROUND_TOPS.g4,
		color: COLORS.ground4,
		bunchedTop: 66,
		step: 2,
	},
];

const entranceTransition = (step: number) => ({
	delay: 0.15 + step * 0.045,
	duration: 0.6,
	ease: EASE_OUT_EXPO,
});

// y is 155% of the sun's height: at scale 2 the disc doubles around its center, so a
// plain 100% offset would already poke above the horizon.
const SUN_ENTRANCE = { y: "155%", scale: 2 };
// Starts while the bands still separate; the clip hides it until it crests as they land.
const SUN_TRANSITION = { delay: 0.55, ...SUN_CREST_SPRING };

// The sheet's hole: an even-odd clip-path blob of 8 polar lobes, base radii fixed, each
// breathing on its own phase; `s` scales it in vh units.
const LOBE_RADII = [1.0, 1.24, 0.8, 1.14, 0.88, 1.28, 0.76, 1.1];
const LOBE_PHASES = [0, 2.1, 4.4, 1.3, 5.2, 3.0, 0.7, 5.9];
const LOBE_COUNT = LOBE_RADII.length;
const UNDULATION = 0.14; // per-lobe radius swing
const SMOOTHING = 0.18; // Catmull-Rom-ish tangent factor for the closed curve

// Reveal progress below which the intro video is held paused at frame 0.
const VIDEO_CUE = 0.1;

// Seconds of catch-up on every scrubbed tween. iOS Safari reports scroll positions
// sparsely and sometimes wrongly (the touchmove bug ScrollTrigger works around); with
// `scrub: true` each sample lands as a visible step, with a number the ticker
// interpolates between them. Small enough to read as direct on a mouse wheel.
const SCRUB = 0.25;

export function ParallaxHero({ reveal }: { reveal?: React.ReactNode }) {
	const wrapperRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const sceneRef = useRef<HTMLDivElement>(null);
	const characterRef = useRef<HTMLDivElement>(null);
	const sunRef = useRef<HTMLDivElement>(null);
	const revealRef = useRef<HTMLDivElement>(null);
	const blobRef = useRef<SVGPathElement>(null);
	// Live hook: false through SSR and hydration, so no SSR-visible branch may depend
	// on it; geometry collapses via motion-reduce classes instead (FRA-170).
	const reducedMotion = useReducedMotionLive();
	const steady = useSteadyFrames();
	// Hold the bunched pose until frames render steadily; tween clocks can't survive a stall.
	const play = reducedMotion || steady;

	useGSAP(
		() => {
			const scene = sceneRef.current;
			if (!wrapperRef.current || !scene || !characterRef.current) return;

			// Under reduced motion the sheet simply scrolls away over the pinned intro,
			// itself a designed reveal; matchMedia builds/reverts the pins on live flips.
			const mm = gsap.matchMedia();
			mm.add("(prefers-reduced-motion: no-preference)", () => {
				const video = revealRef.current?.querySelector("video") ?? null;

				// Re-measured on every refresh so tween distances and hole geometry never go stale.
				// The scene's box is the CSS `h-screen` the sticky geometry is built from; on iOS
				// that is the large viewport, while innerHeight is the toolbar-dependent visual
				// height and would pace the scrubs against a different, shifting number.
				const metrics = { vh: 0, vw: 0, cx: 0, cy: 0 };
				const measure = () => {
					metrics.vh = scene.offsetHeight || window.innerHeight;
					metrics.vw = scene.clientWidth || window.innerWidth;
					// Center the hole on the intro video while its underlay is still sticky-pinned
					// (the rect is the revealed position); deeper, fall back to proportional coords.
					const rect = video?.getBoundingClientRect();
					if (
						rect &&
						rect.width > 0 &&
						window.scrollY < (WRAPPER_VH - 1) * metrics.vh
					) {
						metrics.cx = rect.left + rect.width / 2;
						metrics.cy = rect.top + rect.height / 2;
					} else {
						metrics.cx = 0.28 * metrics.vw;
						metrics.cy = 0.5 * metrics.vh;
					}
				};
				measure();

				let rebuildFn: (() => void) | null = null;
				let cancelHoleWrite = () => {};
				const onRefreshInit = () => {
					measure();
					rebuildFn?.();
				};
				ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

				scene.querySelectorAll<HTMLElement>("[data-parallax]").forEach((el) => {
					const factor = parseFloat(el.dataset.parallax ?? "0");
					if (factor === 0) return;

					gsap.to(el, {
						y: () => -(factor * metrics.vh),
						ease: "none",
						scrollTrigger: {
							trigger: wrapperRef.current,
							start: "top top",
							end: () => `+=${metrics.vh}`,
							scrub: SCRUB,
							invalidateOnRefresh: true,
						},
					});
				});

				gsap.set(sunRef.current, { transformOrigin: "center center" });
				gsap.to(sunRef.current, {
					scale: 1.3,
					ease: "none",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: () => `top+=${CONVERGENCE_PROGRESS * metrics.vh} top`,
						end: () => `+=${0.9 * metrics.vh}`,
						scrub: SCRUB,
						invalidateOnRefresh: true,
					},
				});

				// transformOrigin keeps feet on the ground and left edge fixed as scale drops.
				gsap.set(characterRef.current, { transformOrigin: "bottom left" });
				gsap.to(characterRef.current, {
					scale: SHRINK_SCALE,
					ease: "none",
					scrollTrigger: {
						trigger: wrapperRef.current,
						start: () => `top+=${CONVERGENCE_PROGRESS * metrics.vh} top`,
						end: () => `+=${0.9 * metrics.vh}`,
						scrub: SCRUB,
						invalidateOnRefresh: true,
					},
				});

				// The hole grows through a staged curve as the sheet scrolls away; scrubbed, so
				// scrolling back up reverses it.
				if (blobRef.current && revealRef.current && sheetRef.current) {
					const blobPath = blobRef.current;
					const sheet = sheetRef.current;
					// yOff compensates the sheet's travel so the hole stays fixed over the video.
					const hole = { s: 0, yOff: 0 };
					const wobble = { r: -12 };
					const pulse = { t: 0 };
					const px = new Array<number>(LOBE_COUNT);
					const py = new Array<number>(LOBE_COUNT);

					const holePath = () => {
						const S = hole.s * metrics.vh;
						const frame = `M0,0 H${metrics.vw} V${SHEET_VH * metrics.vh} H0 Z`;
						if (S <= 0.5) return frame;
						const cx = metrics.cx;
						const cy = metrics.cy + hole.yOff;
						const rot = (wobble.r * Math.PI) / 180;
						for (let i = 0; i < LOBE_COUNT; i++) {
							const angle = (i / LOBE_COUNT) * Math.PI * 2 + rot;
							const r =
								LOBE_RADII[i] *
								(1 + UNDULATION * Math.sin(pulse.t + LOBE_PHASES[i])) *
								S;
							px[i] = cx + r * Math.cos(angle);
							py[i] = cy + r * Math.sin(angle);
						}
						let d = `${frame} M ${px[0].toFixed(1)} ${py[0].toFixed(1)}`;
						for (let i = 0; i < LOBE_COUNT; i++) {
							const p0 = (i + LOBE_COUNT - 1) % LOBE_COUNT;
							const p2 = (i + 1) % LOBE_COUNT;
							const p3 = (i + 2) % LOBE_COUNT;
							const c1x = px[i] + (px[p2] - px[p0]) * SMOOTHING;
							const c1y = py[i] + (py[p2] - py[p0]) * SMOOTHING;
							const c2x = px[p2] - (px[p3] - px[i]) * SMOOTHING;
							const c2y = py[p2] - (py[p3] - py[i]) * SMOOTHING;
							d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${px[p2].toFixed(1)} ${py[p2].toFixed(1)}`;
						}
						return `${d} Z`;
					};

					// Every write invalidates the clip over the whole sheet, which iOS repaints on
					// the main thread. Four callers (scroll, staged tween, sway, breath) collapse
					// to one write per frame, and none while the hole is closed, since the
					// frame-only path never changes.
					let lastPath = "";
					let pending = false;
					const write = () => {
						pending = false;
						const d = holePath();
						if (d === lastPath) return;
						lastPath = d;
						blobPath.setAttribute("d", d);
					};
					const rebuild = () => {
						if (pending) return;
						pending = true;
						gsap.ticker.add(write, true);
					};
					cancelHoleWrite = () => gsap.ticker.remove(write);

					// Synchronous on setup and refresh: a clip that references an empty path
					// would hide the sheet for a frame.
					rebuildFn = write;
					write();
					sheet.style.clipPath = "url(#hero-hole)";

					// Hidden past the reveal: the sheet's trailing edge rasterizes a hairline against
					// the intro. Driven off scrub progress; enter/leave callbacks never fired here.
					const syncSheet = (progress: number) => {
						sheet.style.visibility = progress < 1 ? "visible" : "hidden";
					};

					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: wrapperRef.current,
							start: () =>
								`top+=${(PIN_VH + REVEAL_DELAY_VH) * metrics.vh} top`,
							end: () => `+=${REVEAL_LENGTH_VH * metrics.vh}`,
							scrub: SCRUB,
							invalidateOnRefresh: true,
							onUpdate: (self) => {
								syncSheet(self.progress);
								// Sheet travel since release: the pre-reveal delay plus the scrubbed portion.
								hole.yOff =
									(REVEAL_DELAY_VH + self.progress * REVEAL_LENGTH_VH) *
									metrics.vh;
								rebuild();
								if (!video) return;
								// `ended` also reports paused; unguarded, every tick would restart a
								// finished video.
								if (self.progress > VIDEO_CUE && video.paused && !video.ended) {
									video.play().catch(() => {});
								} else if (self.progress <= VIDEO_CUE && !video.paused) {
									video.pause();
								}
							},
							onLeaveBack: () => {
								if (video) {
									video.pause();
									video.currentTime = 0;
								}
							},
						},
					});
					// onUpdate only runs once scroll moves; seed for a page loaded past the reveal.
					syncSheet(tl.scrollTrigger?.progress ?? 0);
					tl.to(hole, {
						s: 0.1,
						duration: 0.06,
						ease: "power2.out",
						onUpdate: rebuild,
					})
						.to(hole, {
							s: 0.13,
							duration: 0.24,
							ease: "none",
							onUpdate: rebuild,
						})
						.to(hole, {
							s: 0.5,
							duration: 0.4,
							ease: "power1.in",
							onUpdate: rebuild,
						})
						.to(hole, {
							s: 2.6,
							duration: 0.3,
							ease: "power3.in",
							onUpdate: rebuild,
						});

					// Time-based sway and breathing so the hole's edge keeps living while scroll parks.
					gsap.to(wobble, {
						r: 12,
						yoyo: true,
						repeat: -1,
						duration: 3,
						ease: "sine.inOut",
						onUpdate: rebuild,
					});
					gsap.to(pulse, {
						t: Math.PI * 2,
						repeat: -1,
						duration: 3.6,
						ease: "none",
						onUpdate: rebuild,
					});
				}

				return () => {
					ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
					cancelHoleWrite();
					// Manual style writes GSAP can't revert; a flip to reduced must not
					// strand the sheet clipped or hidden.
					if (sheetRef.current) {
						sheetRef.current.style.clipPath = "";
						sheetRef.current.style.visibility = "";
					}
				};
			});

			return () => mm.revert();
		},
		{ scope: wrapperRef },
	);

	return (
		<LazyMotion features={domMax}>
			{/* The intro stays pinned beneath for the full range plus TEXT_REVEAL_VH so its
			    text can scrub in while held; the extra tail is empty scroll over the intro.
			    Reduced motion: 2vh, one for the sheet to scroll off, one for the intro to leave. */}
			<div
				data-motion-anchor="scrub"
				className="relative h-[200vh] motion-safe:h-(--hero-track)"
				style={
					{
						"--hero-track": `${(WRAPPER_VH + TEXT_REVEAL_VH) * 100}vh`,
					} as CSSProperties
				}
			>
				{reveal && (
					<div className="absolute inset-0">
						<div ref={revealRef} className="sticky top-0 h-screen">
							{reveal}
						</div>
					</div>
				)}

				{/* Twice the viewport tall so the trailing edge arrives after the hole swallows
				    the screen; reduced motion drops the extension and the stick distance. */}
				{/* The transparent wrapper would swallow every click over the intro; the sheet
				    re-enables hit testing so it blocks input only where it visually covers. */}
				<div
					ref={wrapperRef}
					className="pointer-events-none relative z-10 h-screen motion-safe:h-(--hero-pin)"
					style={{ "--hero-pin": `${WRAPPER_VH * 100}vh` } as CSSProperties}
				>
					<div
						ref={sheetRef}
						className="pointer-events-auto sticky top-0 h-screen motion-safe:h-(--hero-sheet)"
						style={{ "--hero-sheet": `${SHEET_VH * 100}vh` } as CSSProperties}
					>
						<div
							ref={sceneRef}
							className="relative h-screen overflow-hidden"
							style={{ background: COLORS.sky1 }}
						>
							{/* Zenith base: its top edge is the viewport, so it has no entrance. */}
							<div
								data-parallax={PARALLAX.sky1}
								className="absolute w-full"
								style={{
									top: `${SKY_TOPS.s1}%`,
									height: "200%",
									background: COLORS.sky1,
								}}
							/>
							{/* The motion-reduce important override on every entrance m.div: the
							    server HTML carries the bunched-pose inline transforms, so
							    reduced-motion first paint must neutralize them from CSS (FRA-170). */}
							{SKY_BANDS.map(({ parallax, top, color, bunchedTop, step }) => (
								<div
									key={color}
									data-parallax={parallax}
									className="absolute w-full"
									style={{ top: `${top}%`, height: "200%" }}
								>
									<m.div
										className="motion-reduce:transform-none! absolute inset-0"
										style={{ background: color }}
										initial={
											reducedMotion ? false : { y: `${bunchedTop - top}vh` }
										}
										animate={{ y: play ? "0vh" : `${bunchedTop - top}vh` }}
										transition={
											reducedMotion ? { duration: 0 } : entranceTransition(step)
										}
									/>
								</div>
							))}

							{/* Clipped to the sky: the sun can never show below the horizon while
							    the bands are still separating. */}
							<div
								className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden"
								style={{ height: `${HORIZON_PCT}%` }}
							>
								<div
									ref={sunRef}
									data-parallax={PARALLAX.sun}
									className="absolute"
									style={{
										width: "min(38vw, 38vh)",
										height: "min(38vw, 38vh)",
										right: "1%",
										// Bottom third of the sun sits below the horizon (= wrapper bottom)
										top: "calc(100% - min(36vw, 36vh))",
									}}
								>
									<m.div
										className="motion-reduce:transform-none! absolute inset-0 rounded-full"
										style={{ background: COLORS.sun }}
										initial={reducedMotion ? false : SUN_ENTRANCE}
										animate={play ? { y: "0%", scale: 1 } : SUN_ENTRANCE}
										transition={
											reducedMotion ? { duration: 0 } : SUN_TRANSITION
										}
									/>
								</div>
							</div>

							{/* height: 200% ensures bands never expose a bottom edge as they parallax up */}
							{GROUND_BANDS.map(
								({ parallax, top, color, bunchedTop, step }) => (
									<div
										key={color}
										data-parallax={parallax}
										className="absolute w-full"
										style={{ top: `${top}%`, height: "200%" }}
									>
										<m.div
											className="motion-reduce:transform-none! absolute inset-0"
											style={{ background: color }}
											initial={
												reducedMotion ? false : { y: `${bunchedTop - top}vh` }
											}
											animate={{ y: play ? "0vh" : `${bunchedTop - top}vh` }}
											transition={
												reducedMotion
													? { duration: 0 }
													: entranceTransition(step)
											}
										/>
									</div>
								),
							)}

							{/* Feet anchored to g3's top edge via bottom positioning. */}
							<div
								ref={characterRef}
								data-parallax={PARALLAX.character}
								className="absolute left-[4%]"
								style={{ bottom: `${100 - GROUND_TOPS.g3}%` }}
							>
								{/* Offset and timing identical to ground band 3's, so the sneakers
								    stay planted on it as it slides down. */}
								<m.div
									className="motion-reduce:transform-none!"
									initial={
										reducedMotion
											? false
											: {
													y: `${GROUND_BANDS[2].bunchedTop - GROUND_TOPS.g3}vh`,
												}
									}
									animate={{
										y: play
											? "0vh"
											: `${GROUND_BANDS[2].bunchedTop - GROUND_TOPS.g3}vh`,
									}}
									transition={
										reducedMotion
											? { duration: 0 }
											: entranceTransition(GROUND_BANDS[2].step)
									}
								>
									<Image
										src="/lego-hero.webp"
										width={1024}
										height={1536}
										alt="Lego Gustavo looking at the horizon"
										priority
										sizes="(min-width: 640px) 200px, 130px"
										className="h-65 w-32.5 object-contain object-bottom sm:h-100 sm:w-50"
									/>
								</m.div>
							</div>
						</div>
						<div
							className="motion-reduce:hidden"
							style={{
								height: `${(SHEET_VH - 1) * 100}vh`,
								background: COLORS.ground4,
							}}
						/>
					</div>
				</div>

				{reveal && (
					<svg aria-hidden="true" className="absolute h-0 w-0">
						<defs>
							<clipPath id="hero-hole" clipPathUnits="userSpaceOnUse">
								<path ref={blobRef} clipRule="evenodd" />
							</clipPath>
						</defs>
					</svg>
				)}
			</div>
		</LazyMotion>
	);
}
