"use client";

import { Send } from "lucide-react";
import { domAnimation, LazyMotion, m, useReducedMotion } from "motion/react";
import { useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { EASE_OUT_EXPO, SUN_CREST_SPRING } from "@/lib/motion-tokens";

// The horizon sits low so the card reads against sky, not ground.
const HORIZON_PCT = 72;
const SKY_TOP = 44;
const GROUND_MID = 84;

// Unconditional module-stable poses: branching `initial` on reduced motion forks the SSR
// markup into a hydration mismatch; the transition collapses to INSTANT instead.
const SKY_ENTRANCE = { y: "18vh" };
const GROUND_ENTRANCE = { y: "-10vh" };
const CARD_ENTRANCE = { opacity: 0, y: 18 };
const INSTANT = { duration: 0 };

const bandTransition = (step: number) => ({
	delay: 0.1 + step * 0.05,
	duration: 0.55,
	ease: EASE_OUT_EXPO,
});

// 155% of the disc's own height: at scale 1.6 it grows 30% past its center,
// so a plain 100% offset would already crest the horizon before the spring.
const SUN_ENTRANCE = { y: "155%", scale: 1.6 };
// Starts while the bands are still separating, so the disc crests as they land.
const SUN_TRANSITION = { delay: 0.45, ...SUN_CREST_SPRING };

// Sky-layer-relative: below sm the disc rests high, where an own-height offset could
// never reach the ground; 80% leaves about half the disc peeking over the horizon.
const SUN_RISE_MOBILE = { y: "80%" };
const SUN_SCALE_ENTRANCE = { scale: 1.6 };

const CARD_TRANSITION = {
	delay: 0.35,
	duration: 0.5,
	ease: EASE_OUT_EXPO,
};

// Rotations stay small: the glyph's nose already points 45 degrees up.
const PLANE_FLIGHT = {
	x: ["3vw", "11vw", "24vw"],
	y: ["15vh", "4vh", "-4vh"],
	rotate: [-16, -6, 2],
	scale: [0.7, 1.1, 0.55],
	opacity: [0, 1, 0],
};
const PLANE_TRANSITION = {
	duration: 1.5,
	times: [0, 0.4, 1],
	ease: [0.22, 0.61, 0.36, 1] as const,
};

// A separate node so the success pulse never fights the entrance spring for scale.
function SunDisc({ pulsing }: { pulsing: boolean }) {
	return (
		<m.div
			className="size-full rounded-full bg-noon-sun"
			animate={pulsing ? { scale: [1, 1.08, 1] } : { scale: 1 }}
			transition={{ duration: 0.9, times: [0, 0.4, 1], ease: "easeInOut" }}
		/>
	);
}

/** A shareable direct link for emailing Gustavo; elsewhere the header's
 * dialog does this job. */
export function ContactScene() {
	const reducedMotion = useReducedMotion();
	const [flying, setFlying] = useState(false);

	return (
		<LazyMotion features={domAnimation}>
			{/* py-16 keeps the card clear of the riding header (h-16) at every
			    height; min-h-svh lets a short landscape viewport scroll rather
			    than clip the Send button. */}
			<section
				aria-labelledby="contact-title"
				data-surface="pale-dune"
				className="relative flex min-h-svh items-center justify-center overflow-hidden bg-pale-dune px-6 py-16"
			>
				<div aria-hidden className="absolute inset-0">
					{/* Bands run to 200% height so the entrance slide never exposes a far edge. */}
					<m.div
						className="absolute inset-x-0 bg-amber-mirage"
						style={{ top: `${SKY_TOP}%`, height: "200%" }}
						initial={SKY_ENTRANCE}
						animate={{ y: 0 }}
						transition={reducedMotion ? INSTANT : bandTransition(0)}
					/>

					{/* Clipped to the sky: the disc can never show below the horizon mid-spring. */}
					<div
						className="absolute inset-x-0 top-0 overflow-hidden"
						style={{ height: `${HORIZON_PCT}%` }}
					>
						{/* Below sm the card covers the horizon band, so the disc rests high; the
						    whole sky layer starts dropped so the rise begins behind the ground. */}
						<m.div
							className="absolute inset-0 sm:hidden"
							initial={SUN_RISE_MOBILE}
							animate={{ y: "0%" }}
							transition={reducedMotion ? INSTANT : SUN_TRANSITION}
						>
							<div className="absolute top-[9%] right-[6%] size-[min(30vw,20vh)]">
								<m.div
									className="absolute inset-0"
									initial={SUN_SCALE_ENTRANCE}
									animate={{ scale: 1 }}
									transition={reducedMotion ? INSTANT : SUN_TRANSITION}
								>
									<SunDisc pulsing={flying && !reducedMotion} />
								</m.div>
							</div>
						</m.div>
						{/* Rests at the horizon, so its own-height offset starts it fully hidden. */}
						<div className="absolute top-[calc(100%_-_min(25vw,25vh))] right-[8%] hidden size-[min(28vw,28vh)] sm:block">
							<m.div
								className="absolute inset-0"
								initial={SUN_ENTRANCE}
								animate={{ y: "0%", scale: 1 }}
								transition={reducedMotion ? INSTANT : SUN_TRANSITION}
							>
								<SunDisc pulsing={flying && !reducedMotion} />
							</m.div>
						</div>
					</div>

					{/* The horizon line the scene grows out of: no entrance travel. */}
					<div
						className="absolute inset-x-0 bg-canyon-brown"
						style={{ top: `${HORIZON_PCT}%`, height: "200%" }}
					/>
					{/* The left end is the reserved slot for the contact Lego figure, shipping later. */}
					<m.div
						className="absolute inset-x-0 bg-dusk-earth"
						style={{ top: `${GROUND_MID}%`, height: "200%" }}
						initial={GROUND_ENTRANCE}
						animate={{ y: 0 }}
						transition={reducedMotion ? INSTANT : bandTransition(1)}
					/>
				</div>

				{flying && !reducedMotion ? (
					<m.span
						aria-hidden
						className="pointer-events-none absolute top-1/2 left-1/2 z-20 text-dusk-earth"
						initial={{
							x: PLANE_FLIGHT.x[0],
							y: PLANE_FLIGHT.y[0],
							rotate: PLANE_FLIGHT.rotate[0],
							scale: PLANE_FLIGHT.scale[0],
							opacity: 0,
						}}
						animate={PLANE_FLIGHT}
						transition={PLANE_TRANSITION}
						onAnimationComplete={() => setFlying(false)}
					>
						<Send className="size-8" />
					</m.span>
				) : null}

				<m.div
					className="relative z-10 w-full max-w-md rounded-[14px] border border-sand-line bg-sand-haze p-6 shadow-pressed-soft sm:p-7"
					initial={CARD_ENTRANCE}
					animate={{ opacity: 1, y: 0 }}
					transition={reducedMotion ? INSTANT : CARD_TRANSITION}
				>
					<ScrollRevealText
						as="h1"
						id="contact-title"
						mode="trigger"
						delay={0.5}
						className="font-bold font-display text-[clamp(2rem,7vw,2.75rem)] text-dusk-ink leading-[1.05] tracking-[-0.01em]"
					>
						Say hello
					</ScrollRevealText>
					<p className="mt-2 text-dusk-ink/75 text-sm leading-[1.6]">
						I read everything that lands here. Tell me what you are building.
					</p>
					<div className="mt-5">
						<ContactForm
							tone="light"
							source="page"
							onSuccess={() => setFlying(true)}
						/>
					</div>
				</m.div>
			</section>
		</LazyMotion>
	);
}
