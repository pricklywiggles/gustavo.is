"use client";

import { blinds, curtains } from "motion-plus/curtains";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

// One curtain transaction at a time, released only when the reveal settles.
let inFlight = false;
// Destination-keyed token: ScrollReset consumes it on the arrival it was
// minted for, so back/forward keeps the browser's own scroll restoration.
let scrollResetPath: string | null = null;

export function consumeScrollReset(pathname: string) {
	if (scrollResetPath !== pathname) return false;
	scrollResetPath = null;
	return true;
}

/** The curtain only makes sense for plain, different-path internal urls;
 * anything else keeps stock Link behavior. */
function curtainHref(href: ComponentProps<typeof Link>["href"]) {
	if (typeof href !== "string" || !href.startsWith("/")) return null;
	if (href.includes("?") || href.includes("#")) return null;
	if (href === window.location.pathname) return null;
	return href;
}

/**
 * next/link that swaps pages behind a Motion+ blinds curtain. Commit is detected by
 * pathname or a [data-curtain-target] marker; a wall-clock deadline and a popstate
 * listener guarantee the reveal, so nothing can strand the visitor covered.
 */
export function CurtainLink({
	href,
	onClick,
	children,
	...rest
}: ComponentProps<typeof Link>) {
	const router = useRouter();

	const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
		onClick?.(event);
		if (
			event.defaultPrevented ||
			event.button !== 0 ||
			event.metaKey ||
			event.ctrlKey ||
			event.shiftKey ||
			event.altKey
		) {
			return;
		}
		if (inFlight) {
			// Coalesce rapid clicks: one transaction, no queued pushes.
			event.preventDefault();
			return;
		}
		const url = curtainHref(href);
		if (!url) return;
		event.preventDefault();
		inFlight = true;

		// The user's Back always wins: before the push it cancels it, after
		// the push it opens the blinds immediately.
		let popped = false;
		const onPopstate = () => {
			popped = true;
		};
		window.addEventListener("popstate", onPopstate);

		curtains(
			() => {
				if (popped) return;
				scrollResetPath = url;
				router.push(url);
				return new Promise<void>((resolve) => {
					let raf = 0;
					// Wall clock, not rAF: background tabs freeze frames.
					const timeout = setTimeout(settleSoon, 4000);
					function settleSoon() {
						clearTimeout(timeout);
						cancelAnimationFrame(raf);
						// Two extra frames so the committed route has painted
						// before the slats start opening.
						requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
					}
					const committed = () => {
						if (popped || window.location.pathname === url) return true;
						for (const el of document.querySelectorAll<HTMLElement>(
							"[data-curtain-target]",
						)) {
							if (el.dataset.curtainTarget === url) return true;
						}
						return false;
					};
					const check = () => {
						if (committed()) settleSoon();
						else raf = requestAnimationFrame(check);
					};
					check();
				});
			},
			{ effect: blinds({ size: 72 }), transition: { duration: 0.45 } },
		)
			.catch(() => {
				// The curtain is presentation; the push already navigated.
			})
			.finally(() => {
				window.removeEventListener("popstate", onPopstate);
				inFlight = false;
			});
	};

	return (
		<Link href={href} onClick={handleClick} {...rest}>
			{children}
		</Link>
	);
}
