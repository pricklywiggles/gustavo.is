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

/** Overlapping sections make document order lie, so the painted stack decides. */
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
 * A data-header-hold section owns the top edge: the sliding bar would land on its year
 * readout. Reduced motion hides that readout and stacks the section many screens tall.
 */
export function headerHeld(
	rect: DOMRect | undefined,
	viewportHeight: number,
	reducedMotion: boolean,
): boolean {
	if (reducedMotion || !rect) return false;
	return rect.top <= 1 && rect.bottom >= viewportHeight - 1;
}

// Re-sample travel: the bar is 64px tall and surfaces change only at section boundaries.
const SURFACE_SAMPLE_PX = 64;

/**
 * Two headers, one bar: the riding header leaves with the page, the return header slides
 * in on upward scroll. The blog index mounts its own BarHost, one authority per route.
 */
export function SiteHeader({
	onDarkSurface = false,
}: {
	/** Forces dark labels where no route predicate can: 404 matches every unmatched path. */
	onDarkSurface?: boolean;
} = {}) {
	const pathname = usePathname();
	const isHome = pathname === "/";
	const [returnVisible, setReturnVisible] = useState(false);
	const [surface, setSurface] = useState<Surface>("first-light");
	const reducedMotion = useReducedMotionLive();
	const { scrollY } = useScroll();
	const holdRef = useRef<HTMLElement | null>(null);
	const surfaceSampleY = useRef<number | null>(null);

	// Kept mounted across grouped navigations, so the previous page's header and theme leak.
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
		// Past the riding header and, on home, the blob reveal (~2.4vh); the bar never competes.
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

		// elementsFromPoint forces a hit test, too expensive for every tick.
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
	// Retrospectives and blog posts open on dark earth; the /blog index keeps its panorama sky.
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
