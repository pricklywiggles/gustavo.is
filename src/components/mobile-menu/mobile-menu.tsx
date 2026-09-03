"use client";

import { House, Mail, PenLine, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CurtainLink } from "@/components/curtain-link";
import { GLogo } from "@/components/icons";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { navPill } from "@/lib/cta";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import { EASE_OUT_EXPO, SUN_CREST_SPRING } from "@/lib/motion-tokens";
import { rampAlpha, rampColor } from "@/lib/ramp";
import {
	BLOG_LINK,
	CONTACT_LINK,
	HOME_LINK,
	SOCIAL_LINKS,
} from "@/lib/site-links";

type MenuLink = {
	href: string;
	label: string;
	Icon: React.ComponentType<{ className?: string }>;
	external?: boolean;
};

const BLOG_MENU_LINK: MenuLink = { ...BLOG_LINK, Icon: PenLine };
const HOME_MENU_LINK: MenuLink = { ...HOME_LINK, Icon: House };
const CONTACT_MENU_LINK: MenuLink = { ...CONTACT_LINK, Icon: Mail };
const SOCIAL_MENU_LINKS: MenuLink[] = [...SOCIAL_LINKS];

const LANDING_MENU_LINKS: MenuLink[] = [
	BLOG_MENU_LINK,
	CONTACT_MENU_LINK,
	...SOCIAL_MENU_LINKS,
];
const INNER_MENU_LINKS: MenuLink[] = [
	HOME_MENU_LINK,
	BLOG_MENU_LINK,
	CONTACT_MENU_LINK,
	...SOCIAL_MENU_LINKS,
];
const CONTACT_MENU_LINKS: MenuLink[] = [
	HOME_MENU_LINK,
	BLOG_MENU_LINK,
	...SOCIAL_MENU_LINKS,
];

export type BloomOrigin = { x: number; y: number };

// Roughly the hamburger's center in a top bar; used only before the host has measured.
const BLOOM_FALLBACK = "calc(100% - 38px) 32px";

/** Origin rides AnimatePresence `custom`: exit props freeze at the removal render. */
const circleAt = (origin: BloomOrigin | null, radius: string) =>
	`circle(${radius} at ${origin ? `${origin.x}px ${origin.y}px` : BLOOM_FALLBACK})`;

const BLOOM_VARIANTS = {
	closed: (origin: BloomOrigin | null) => ({
		clipPath: circleAt(origin, "0%"),
		transition: { duration: 0.45, ease: [0.4, 0, 0.15, 1] as const },
	}),
	open: (origin: BloomOrigin | null) => ({
		clipPath: circleAt(origin, "170%"),
		transition: { duration: 0.45, ease: [0.4, 0, 0.15, 1] as const },
	}),
};
const FADE_VARIANTS = {
	closed: { opacity: 0, transition: { duration: 0.2 } },
	open: { opacity: 1, transition: { duration: 0.2 } },
};

const INERT_SKIP_TAGS = new Set(["SCRIPT", "STYLE", "LINK", "TEMPLATE"]);

// Custom elements stay live so Next's route announcer can speak a mid-menu navigation.
function inertOutside(overlay: HTMLElement): () => void {
	const marked: Element[] = [];
	let node: Element = overlay;
	while (node !== document.body) {
		const parent = node.parentElement;
		if (!parent) break;
		for (const sibling of parent.children) {
			if (
				sibling === node ||
				sibling.hasAttribute("inert") ||
				INERT_SKIP_TAGS.has(sibling.tagName) ||
				sibling.tagName.includes("-")
			)
				continue;
			sibling.setAttribute("inert", "");
			marked.push(sibling);
		}
		node = parent;
	}
	return () => {
		for (const el of marked) el.removeAttribute("inert");
	};
}

export function MobileMenu({
	open,
	onClose,
	origin = null,
	onExitComplete,
}: {
	open: boolean;
	onClose: () => void;
	/** Measured center of the page toggle, viewport px; host keeps it fresh. */
	origin?: BloomOrigin | null;
	onExitComplete?: () => void;
}) {
	const overlayRef = useRef<HTMLDivElement>(null);
	const previouslyFocused = useRef<HTMLElement | null>(null);
	const releaseInert = useRef<(() => void) | null>(null);
	const reducedMotion = useReducedMotionLive();
	const pathname = usePathname();
	const links =
		pathname === "/"
			? LANDING_MENU_LINKS
			: pathname === "/contact"
				? CONTACT_MENU_LINKS
				: INNER_MENU_LINKS;

	// Stable identity: re-running the effect mid-open would rebuild the trap and steal focus.
	const onCloseRef = useRef(onClose);
	onCloseRef.current = onClose;

	// Held to the exit bloom's end: a trap released at close start lets Shift+Tab escape.
	const [present, setPresent] = useState(false);
	useEffect(() => {
		if (open) setPresent(true);
	}, [open]);

	useEffect(() => {
		if (!present) return;
		// The overlay is md:hidden: an open menu at the breakpoint is invisible and holds gestures.
		const mdQuery = window.matchMedia("(min-width: 768px)");
		if (mdQuery.matches) {
			onCloseRef.current();
			return;
		}
		previouslyFocused.current = document.activeElement as HTMLElement;

		const focusables = () =>
			Array.from(
				overlayRef.current?.querySelectorAll<HTMLElement>("a[href], button") ??
					[],
			);
		focusables()[0]?.focus({ preventScroll: true });

		if (overlayRef.current)
			releaseInert.current = inertOutside(overlayRef.current);

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onCloseRef.current();
				return;
			}
			if (e.key !== "Tab") return;
			const items = focusables();
			if (items.length === 0) return;
			const first = items[0];
			const last = items[items.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		};

		const onMdChange = (e: MediaQueryListEvent) => {
			if (e.matches) onCloseRef.current();
		};
		mdQuery.addEventListener("change", onMdChange);

		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("keydown", onKeyDown);
			mdQuery.removeEventListener("change", onMdChange);
			releaseInert.current?.();
			releaseInert.current = null;
		};
	}, [present]);

	// Restored after the exit bloom, since the control is covered at close start; a zero-size
	// rect carries no layout info. preventScroll: pulling the toggle into view moves the page.
	const handleExitComplete = () => {
		// focus() inside an inert subtree is a silent no-op.
		releaseInert.current?.();
		releaseInert.current = null;
		const el = previouslyFocused.current;
		previouslyFocused.current = null;
		if (el?.isConnected) {
			const r = el.getBoundingClientRect();
			const measuredOffscreen =
				r.width > 0 &&
				r.height > 0 &&
				(r.bottom <= 0 ||
					r.top >= window.innerHeight ||
					r.right <= 0 ||
					r.left >= window.innerWidth);
			if (!measuredOffscreen) el.focus({ preventScroll: true });
		}
		setPresent(false);
		onExitComplete?.();
	};

	return (
		<AnimatePresence custom={origin} onExitComplete={handleExitComplete}>
			{open && (
				<m.div
					ref={overlayRef}
					role="dialog"
					aria-modal="true"
					aria-label="Navigation menu"
					className="fixed inset-0 z-overlay flex flex-col overflow-hidden px-8 pt-24 pb-4 backdrop-blur-[20px] md:hidden"
					style={{ background: rampAlpha("pale-dune", "96%") }}
					variants={reducedMotion ? FADE_VARIANTS : BLOOM_VARIANTS}
					custom={origin}
					initial="closed"
					animate="open"
					exit="closed"
				>
					<m.div
						className="pointer-events-none absolute inset-0"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ delay: reducedMotion ? 0 : 0.3, duration: 0.4 }}
					>
						<MenuHorizonGraphic />
					</m.div>

					{/* Same geometry as the site bar, so a bar at the top reads as absorbed
					    into the sheet; the X here closes, the page toggle stays put underneath. */}
					<div className="absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between px-6 sm:px-10">
						<CurtainLink
							href="/"
							onClick={onClose}
							className={`rounded-sm text-dusk-ink ${FOCUS_OUTLINE.light}`}
						>
							<GLogo className="h-7.5 w-auto" />
							<span className="sr-only">gustavo.is</span>
						</CurtainLink>
						<button
							type="button"
							onClick={onClose}
							aria-label="Close menu"
							className={`${navPill({ variant: "icon", tone: "light" })} text-dusk-ink`}
						>
							<X className="size-[22px]" aria-hidden />
						</button>
					</div>

					<nav
						id="mobile-nav"
						className="mt-4 flex flex-col gap-6"
						aria-label="Mobile navigation"
					>
						{links.map((link) => (
							<MobileNavLink key={link.label} {...link} onClose={onClose} />
						))}
					</nav>

					{/* Sits over the graphic's dark ground bands, hence the light ink. */}
					<div className="relative z-10 mt-auto border-first-light/25 border-t pt-4">
						<HeartFooter />
					</div>
				</m.div>
			)}
		</AnimatePresence>
	);
}

function MobileNavLink({
	href,
	label,
	Icon,
	external,
	onClose,
}: MenuLink & { onClose: () => void }) {
	const className = `group relative flex items-center gap-4 rounded-lg py-1 text-2xl text-dusk-ink ${FOCUS_OUTLINE.light}`;
	const pill = (
		<span
			className="-inset-y-2 -inset-x-4 absolute rounded-xl bg-amber-mirage/65 opacity-0 transition-opacity duration-200 ease-out group-hover:opacity-100"
			aria-hidden
		/>
	);
	const content = (
		<>
			{pill}
			<span className="relative z-10">
				<Icon className="size-[22px]" />
			</span>
			<span className="relative z-10">{label}</span>
		</>
	);

	if (external) {
		return (
			<a
				href={href}
				target="_blank"
				rel="noreferrer"
				onClick={onClose}
				className={className}
			>
				{content}
			</a>
		);
	}
	return (
		<CurtainLink href={href} onClick={onClose} className={className}>
			{content}
		</CurtainLink>
	);
}

function HeartFooter() {
	const reducedMotion = useReducedMotionLive();
	return (
		<m.p
			className="flex items-center justify-end gap-1.5 font-sans text-first-light/90 text-xs tracking-widest"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ delay: reducedMotion ? 0 : 0.45, duration: 0.3 }}
		>
			Made with{" "}
			<m.span
				aria-hidden
				animate={reducedMotion ? {} : { scale: [1, 1.4, 1] }}
				transition={{
					duration: 0.6,
					repeat: Number.POSITIVE_INFINITY,
					repeatDelay: 1.2,
					ease: "easeInOut",
				}}
			>
				❤️
			</m.span>{" "}
			in Los Angeles
		</m.p>
	);
}

/** Each rect runs to the bottom under the next; `to` fans at the hero's ratio (30/44/66/100). */
const GROUND_BANDS = [
	{ fill: rampColor("dune-tan"), from: 760, to: 560 },
	{ fill: rampColor("desert-clay"), from: 772, to: 590 },
	{ fill: rampColor("canyon-brown"), from: 784, to: 634 },
	{ fill: rampColor("dusk-earth"), from: 796, to: 700 },
];

const BANDS_DELAY = 0.45; // bloom duration: the fan starts when the bloom lands

/** The hero's horizon miniaturized, so the menu reads as the same world. */
function MenuHorizonGraphic() {
	const reducedMotion = useReducedMotionLive();
	return (
		<svg
			viewBox="0 0 390 800"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			aria-hidden="true"
			className="h-full w-full"
			preserveAspectRatio="xMidYMax slice"
		>
			{/* The sun clips to the sky above the final horizon (y<560), so it can never
			    show while the bands are still fanning. */}
			<defs>
				<clipPath id="menu-sky">
					<rect x="-100" y="-100" width="590" height="660" />
				</clipPath>
			</defs>
			{/* The spring's delay covers the bands' whole fan, so the sun crests a
			    settled horizon. */}
			<m.circle
				cx="300"
				clipPath="url(#menu-sky)"
				fill={rampColor("noon-sun")}
				initial={reducedMotion ? false : { cy: 645, r: 61 }}
				animate={{ cy: 562, r: 72 }}
				transition={
					reducedMotion
						? { duration: 0 }
						: { ...SUN_CREST_SPRING, delay: 1.45, visualDuration: 0.85 }
				}
			/>
			{GROUND_BANDS.map(({ fill, from, to }, i) => (
				<m.rect
					key={fill}
					x="-100"
					width="590"
					height={820 - to}
					fill={fill}
					initial={reducedMotion ? false : { y: from }}
					animate={{ y: to }}
					transition={
						reducedMotion
							? { duration: 0 }
							: {
									delay: BANDS_DELAY + (GROUND_BANDS.length - 1 - i) * 0.06,
									duration: 0.85,
									ease: EASE_OUT_EXPO,
								}
					}
				/>
			))}
		</svg>
	);
}
