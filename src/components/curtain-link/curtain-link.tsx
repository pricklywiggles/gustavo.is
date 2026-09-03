"use client";

import { blinds, curtains } from "motion-plus/curtains";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

let inFlight = false;
// Destination-keyed so ScrollReset fires only on the curtained arrival, never on back/forward.
let scrollResetPath: string | null = null;

export function consumeScrollReset(pathname: string) {
	if (scrollResetPath !== pathname) return false;
	scrollResetPath = null;
	return true;
}

function curtainHref(href: ComponentProps<typeof Link>["href"]) {
	if (typeof href !== "string" || !href.startsWith("/")) return null;
	if (href.includes("?") || href.includes("#")) return null;
	if (href === window.location.pathname) return null;
	return href;
}

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
			event.preventDefault();
			return;
		}
		const url = curtainHref(href);
		if (!url) return;
		event.preventDefault();
		inFlight = true;

		// The user's Back wins: it cancels a pending push, or opens the blinds on a committed one.
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
						// Two frames so the committed route has painted before the slats open.
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
