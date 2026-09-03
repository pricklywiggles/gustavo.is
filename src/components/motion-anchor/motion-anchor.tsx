"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Re-anchors scroll across geometry reflows. One data-motion-anchor per top-level scroll
 * region; on resize "scrub" keeps normalized progress and "flow" pixels, flips keep pixels.
 */

export type AnchorMode = "scrub" | "flow";

/** Tops must be sorted. Ranges overlap (the landfall pull-up), so only tops decide. */
export function resolveAnchorIndex(
	tops: number[],
	scrollY: number,
): number | null {
	let found: number | null = null;
	for (const [i, top] of tops.entries()) {
		if (top <= scrollY) found = i;
	}
	return found;
}

export function compensatedScroll(
	offset: number,
	next: { top: number; height: number },
	viewportHeight: number,
): number {
	const clamped =
		offset <= next.height ? offset : Math.max(0, next.height - viewportHeight);
	return next.top + Math.max(0, clamped);
}

export function scrubFraction(
	scrollY: number,
	prev: { top: number; height: number },
	viewportHeight: number,
): number {
	const extent = Math.max(1, prev.height - viewportHeight);
	return Math.min(1, Math.max(0, (scrollY - prev.top) / extent));
}

export function scrubScroll(
	fraction: number,
	next: { top: number; height: number },
	viewportHeight: number,
): number {
	return next.top + fraction * Math.max(0, next.height - viewportHeight);
}

export function resizeScroll(
	pending: { mode: AnchorMode; offset: number; fraction: number },
	next: { top: number; height: number },
	viewportHeight: number,
): number {
	return pending.mode === "scrub"
		? scrubScroll(pending.fraction, next, viewportHeight)
		: compensatedScroll(pending.offset, next, viewportHeight);
}

type Snapshot = {
	el: HTMLElement;
	top: number;
	height: number;
	mode: AnchorMode;
};

type Pending =
	| { kind: "flip"; el: HTMLElement; offset: number }
	| {
			kind: "resize";
			el: HTMLElement;
			mode: AnchorMode;
			offset: number;
			fraction: number;
	  };

/** GSAP's pin moves the section out of flow; the pin-spacer carries the document position. */
function anchorBox(el: HTMLElement): HTMLElement {
	const parent = el.parentElement;
	return parent?.classList.contains("pin-spacer") ? parent : el;
}

/** gsap's core dispatcher: real since 3.11 (ScrollTrigger uses it), absent from the types. */
const gsapCore = gsap as unknown as {
	addEventListener(type: string, cb: () => void): void;
	removeEventListener(type: string, cb: () => void): void;
};

export function MotionAnchor() {
	useEffect(() => {
		const query = window.matchMedia("(prefers-reduced-motion: reduce)");
		let lastMatches = query.matches;
		let snapshot: Snapshot[] = [];
		let pending: Pending | null = null;
		// Scrub fractions divide by this cached pre-reflow height, never live innerHeight.
		let viewport = { width: window.innerWidth, height: window.innerHeight };

		// The reflow clamps scrollY and fires scroll BEFORE media listeners, poisoning the newest
		// samples; take the newest sample older than the frame (120ms clears it).
		let history: Array<{ at: number; y: number }> = [];
		// Backdated so the sample is immediately older than the 120ms filter.
		const seedHistory = () => {
			history = [{ at: performance.now() - 200, y: window.scrollY }];
		};
		const trackScroll = () => {
			if (pending !== null) return;
			history.push({ at: performance.now(), y: window.scrollY });
			if (history.length > 20) history.shift();
		};
		const preReflowScrollY = () => {
			const now = performance.now();
			for (let i = history.length - 1; i >= 0; i--) {
				if (now - history[i].at > 120) return history[i].y;
			}
			return history[0]?.y ?? window.scrollY;
		};

		const measure = () => {
			snapshot = Array.from(
				document.querySelectorAll<HTMLElement>("[data-motion-anchor]"),
			)
				.map((el) => {
					const rect = anchorBox(el).getBoundingClientRect();
					return {
						el,
						top: rect.top + window.scrollY,
						height: rect.height,
						mode:
							el.dataset.motionAnchor === "scrub"
								? ("scrub" as const)
								: ("flow" as const),
					};
				})
				.sort((a, b) => a.top - b.top);
			viewport = { width: window.innerWidth, height: window.innerHeight };
		};

		// The reflow is a burst of refreshes over several hundred ms, each restoring a stale scroll.
		let settleTimer: ReturnType<typeof setTimeout> | undefined;
		let fallbackTimer: ReturnType<typeof setTimeout> | undefined;
		const cancelSettle = () => {
			clearTimeout(settleTimer);
			settleTimer = undefined;
		};
		const release = () => {
			settleTimer = undefined;
			pending = null;
			seedHistory();
			measure();
		};
		const restartSettle = () => {
			clearTimeout(settleTimer);
			settleTimer = setTimeout(release, 600);
		};
		const applyPending = () => {
			if (!pending) return;
			clearTimeout(fallbackTimer);
			// A control focused since arming means a keyboard may own the viewport; drop the apply.
			if (pending.kind === "resize" && formControlFocused()) {
				cancelSettle();
				release();
				return;
			}
			const rect = anchorBox(pending.el).getBoundingClientRect();
			// rect.top is viewport-relative; adding even a clamped scrollY yields the true top.
			const next = { top: rect.top + window.scrollY, height: rect.height };
			window.scrollTo({
				top:
					pending.kind === "resize"
						? resizeScroll(pending, next, window.innerHeight)
						: compensatedScroll(pending.offset, next, window.innerHeight),
				behavior: "instant",
			});
			// Re-base so an overwriting flip or resize resolves from the just-applied world.
			seedHistory();
			measure();
			restartSettle();
		};

		// Applies anyway if gsap gated the refresh; 500 is past ScrollTrigger's 200ms debounce.
		const armFallback = () => {
			clearTimeout(fallbackTimer);
			fallbackTimer = setTimeout(applyPending, 500);
		};

		// Mobile keyboards resize the window past every threshold and must never move the page.
		const formControlFocused = () => {
			const el = document.activeElement;
			return (
				el instanceof HTMLElement &&
				(el.tagName === "INPUT" ||
					el.tagName === "TEXTAREA" ||
					el.isContentEditable)
			);
		};

		const armResize = () => {
			if (formControlFocused()) return;
			const scrollY = preReflowScrollY();
			// Purge the drag's clamp samples, as onInit does for flips.
			history = [{ at: performance.now() - 200, y: scrollY }];
			const index = resolveAnchorIndex(
				snapshot.map((a) => a.top),
				scrollY,
			);
			if (index === null) return;
			const anchor = snapshot[index];
			pending = {
				kind: "resize",
				el: anchor.el,
				mode: anchor.mode,
				offset: scrollY - anchor.top,
				fraction: scrubFraction(scrollY, anchor, viewport.height),
			};
			cancelSettle();
			armFallback();
		};

		// Mirrors ScrollTrigger's _setBaseDimensions gate, so pending arms only when a refresh follows.
		let baseWidth = window.innerWidth;
		let baseHeight = window.innerHeight;
		const portrait = window.matchMedia("(orientation: portrait)");
		const rebaseDims = () => {
			baseWidth = window.innerWidth;
			baseHeight = window.innerHeight;
		};
		const gatedOut = () =>
			ScrollTrigger.isTouch === 1 &&
			baseWidth === window.innerWidth &&
			Math.abs(window.innerHeight - baseHeight) <= window.innerHeight * 0.25;

		const onResize = () => {
			// Never re-resolve mid-burst; the first event froze the pre-resize world.
			if (pending?.kind === "resize") {
				if (settleTimer !== undefined) restartSettle();
				armFallback();
				return;
			}
			if (gatedOut()) return;
			// A resize mid-flip deliberately overwrites the flip pending.
			armResize();
		};

		// At matchMediaInit the layout already flipped: resolve from the caches before gsap refreshes.
		const onInit = () => {
			if (query.matches === lastMatches) {
				// A width-media crossing (767/768) refreshes BEFORE resize; arm or onRefresh clobbers it.
				if (
					pending === null &&
					(viewport.width !== window.innerWidth ||
						viewport.height !== window.innerHeight)
				) {
					armResize();
				}
				return;
			}
			lastMatches = query.matches;
			const scrollY = preReflowScrollY();
			// This flip's clamp sample must not survive into a rapid follow-up flip.
			history = [{ at: performance.now() - 200, y: scrollY }];
			const index = resolveAnchorIndex(
				snapshot.map((a) => a.top),
				scrollY,
			);
			if (index === null) return;
			pending = {
				kind: "flip",
				el: snapshot[index].el,
				offset: scrollY - snapshot[index].top,
			};
			cancelSettle();
			clearTimeout(fallbackTimer);
		};

		const onSettled = () => applyPending();

		const onRefresh = () => {
			if (pending === null) measure();
			else applyPending();
		};

		measure();
		// Seeded on mount and bfcache restore, so a deep restore never falls back to a clamped value.
		seedHistory();
		window.addEventListener("pageshow", seedHistory);
		window.addEventListener("scroll", trackScroll, { passive: true });
		window.addEventListener("resize", onResize);
		portrait.addEventListener("change", rebaseDims);
		ScrollTrigger.addEventListener("refresh", onRefresh);
		gsapCore.addEventListener("matchMediaInit", onInit);
		ScrollTrigger.addEventListener("matchMedia", onSettled);
		return () => {
			clearTimeout(settleTimer);
			clearTimeout(fallbackTimer);
			window.removeEventListener("pageshow", seedHistory);
			window.removeEventListener("scroll", trackScroll);
			window.removeEventListener("resize", onResize);
			portrait.removeEventListener("change", rebaseDims);
			ScrollTrigger.removeEventListener("refresh", onRefresh);
			gsapCore.removeEventListener("matchMediaInit", onInit);
			ScrollTrigger.removeEventListener("matchMedia", onSettled);
		};
	}, []);

	return null;
}
