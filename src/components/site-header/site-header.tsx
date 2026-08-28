"use client";

import {
	AnimatePresence,
	m,
	useMotionValueEvent,
	useScroll,
} from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BarHost } from "@/components/bar-host";
import {
	type BarTheme,
	DARK_BAR,
	SURFACE_THEMES,
	type Surface,
} from "@/components/bar-themes";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { INNER_TEXT_LINKS, LANDING_TEXT_LINKS } from "@/lib/site-links";

/**
 * Overlapping sections make document order lie, so the visual stack decides; the first
 * [data-surface] ancestor wins, unknown values keeping the first-light fallback.
 */
export function surfaceFromStack(stack: Element[]): Surface {
	for (const el of stack) {
		const declaring = el.closest?.("[data-surface]");
		if (declaring instanceof HTMLElement) {
			const declared = declaring.dataset.surface;
			return declared && declared in SURFACE_THEMES
				? (declared as Surface)
				: "first-light";
		}
	}
	return "first-light";
}

/**
 * A data-header-hold section owns the top edge while it fills the viewport: the bar
 * sliding in would land on its year readout. Reduced motion hides that readout and
 * stacks the section many screens tall, so the hold would only lock the bar out.
 */
export function headerHeld(
	rect: DOMRect | undefined,
	viewportHeight: number,
	reducedMotion: boolean,
): boolean {
	if (reducedMotion || !rect) return false;
	return rect.top <= 1 && rect.bottom >= viewportHeight - 1;
}

// Travel between backdrop re-samples; the bar is 64px tall, and surfaces only change
// across section boundaries, so finer sampling buys nothing.
const SURFACE_SAMPLE_PX = 64;

/**
 * Two headers, one bar: the transparent riding header leaves with the page, the return
 * header slides in on upward scroll. The blog index mounts its own BarHost, keeping one
 * header authority per route by construction.
 */
export function SiteHeader({
	onDarkSurface = false,
}: {
	/** Force the dark-surface label theme where no route predicate can
	 * (the 404 scene matches every unmatched pathname). */
	onDarkSurface?: boolean;
} = {}) {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const [returnVisible, setReturnVisible] = useState(false);
	const [surface, setSurface] = useState<Surface>("first-light");
	const reducedMotion = useReducedMotionLive();
	const { scrollY } = useScroll();
	const holdRef = useRef<HTMLElement | null>(null);
	// null while the return bar is hidden; else the scrollY of the last backdrop sample.
	const surfaceSampleY = useRef<number | null>(null);

	// The layout keeps this mounted across grouped navigations; without a reset the
	// previous page's return header and adopted theme survive onto the next.
	// biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, reset the return header on any route change
	useEffect(() => {
		setReturnVisible(false);
		setSurface("first-light");
		// Queried once per route, not per scroll tick; a page's section set is static.
		holdRef.current = document.querySelector("[data-header-hold]");
		surfaceSampleY.current = null;
	}, [pathname]);

	useMotionValueEvent(scrollY, "change", (y) => {
		const prev = scrollY.getPrevious() ?? 0;
		// Show only past the riding header and, on home, past the blob reveal (pin +
		// delay + scrub, about 2.4vh): the bar never competes with the growing hole.
		const threshold = (isHome ? window.innerHeight * 2.4 : 64) + 64;
		const held = headerHeld(
			holdRef.current?.getBoundingClientRect(),
			window.innerHeight,
			reducedMotion,
		);
		const visible = !held && y < prev && y > threshold;
		setReturnVisible(visible);
		if (!visible) {
			surfaceSampleY.current = null;
			return;
		}

		// Adopt the surface painted under the bar (see surfaceFromStack): sampled on
		// arrival, then per SURFACE_SAMPLE_PX; elementsFromPoint is a forced hit test,
		// too expensive for every tick.
		const lastY = surfaceSampleY.current;
		if (lastY === null || Math.abs(y - lastY) >= SURFACE_SAMPLE_PX) {
			surfaceSampleY.current = y;
			setSurface(
				surfaceFromStack(document.elementsFromPoint(window.innerWidth / 2, 32)),
			);
		}
	});

	// No bar ground: labels carry the contrast; light pill one ramp step below the surface.
	const onContact = pathname === "/contact";
	const scenicSky = isHome || onContact;
	// Retrospective heroes and blog posts open on dark earth, so labels flip light; the
	// /blog index keeps its panorama sky.
	const onDarkHero =
		onDarkSurface ||
		pathname.startsWith("/remembering") ||
		pathname.startsWith("/blog/");
	const ridingTheme: BarTheme = onDarkHero
		? { ...DARK_BAR, bar: "" }
		: {
				bar: "",
				text: "text-dusk-ink",
				hoverPill: scenicSky ? "hover:bg-amber-mirage" : "hover:bg-sand-haze",
				tone: "light",
			};

	return (
		<BarHost
			links={isHome ? LANDING_TEXT_LINKS : INNER_TEXT_LINKS}
			showContact={!onContact}
		>
			{(bar) => (
				<>
					{isHome ? (
						<header className="pointer-events-none absolute inset-x-0 top-0 z-bar h-[calc(100vh+4rem)]">
							<div className="pointer-events-auto sticky top-0">
								{bar(ridingTheme)}
							</div>
						</header>
					) : (
						<header className="absolute inset-x-0 top-0 z-bar">
							{bar(ridingTheme)}
						</header>
					)}
					<AnimatePresence>
						{returnVisible && (
							<m.div
								className="fixed inset-x-0 top-0 z-bar"
								initial={{ y: "-100%" }}
								animate={{ y: "0%" }}
								exit={{ y: "-100%" }}
								transition={
									reducedMotion
										? { duration: 0 }
										: { duration: 0.28, ease: [0.22, 1, 0.36, 1] }
								}
							>
								{bar(SURFACE_THEMES[surface])}
							</m.div>
						)}
					</AnimatePresence>
				</>
			)}
		</BarHost>
	);
}
