"use client";

import { Mail, Menu, X } from "lucide-react";
import { AnimatePresence, m } from "motion/react";
import { usePathname } from "next/navigation";
import type { BarTheme } from "@/components/bar-themes";
import { CurtainLink } from "@/components/curtain-link";
import { GLogo } from "@/components/icons";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { navPill } from "@/lib/cta";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import { SOCIAL_LINKS } from "@/lib/site-links";

/**
 * The bar itself, every positioning and overlay concern left to the caller; state lives
 * with the caller so a page's two bars share one contact dialog and mobile menu.
 */
export function SiteBar({
	links,
	theme,
	showContact,
	contactOpen,
	onContactIntent,
	onContactOpen,
	mobileOpen,
	onMobileToggle,
}: {
	links: readonly { href: string; label: string }[];
	theme: BarTheme;
	showContact: boolean;
	contactOpen: boolean;
	/** First sign of intent (hover/focus): prefetch the dialog chunk. */
	onContactIntent: () => void;
	onContactOpen: () => void;
	mobileOpen: boolean;
	onMobileToggle: () => void;
}) {
	const pathname = usePathname();
	const reducedMotion = useReducedMotionLive();
	const { text, hoverPill, tone } = theme;
	const pillTone = `${text} ${hoverPill}`;

	return (
		<div className="flex h-16 items-center justify-between px-6 sm:px-10">
			<CurtainLink
				href="/"
				className={`rounded-sm transition-colors duration-150 ${text} ${FOCUS_OUTLINE[tone]}`}
			>
				<GLogo className="h-7.5 w-auto" />
				<span className="sr-only">gustavo.is</span>
			</CurtainLink>
			<nav aria-label="Site" className="hidden md:block">
				<ul className="flex items-center gap-1">
					{links.map(({ href, label }) => {
						const active = pathname === href || pathname.startsWith(`${href}/`);
						return (
							<li key={href}>
								{/* aria-current stays for AT; no visual marker by design. */}
								<CurtainLink
									href={href}
									aria-current={active ? "page" : undefined}
									className={`${navPill({ tone })} ${pillTone}`}
								>
									{label}
								</CurtainLink>
							</li>
						);
					})}
					{showContact ? (
						<li>
							<button
								type="button"
								onClick={onContactOpen}
								onPointerEnter={onContactIntent}
								onFocus={onContactIntent}
								aria-label="Contact"
								aria-haspopup="dialog"
								aria-expanded={contactOpen}
								className={`${navPill({ variant: "icon", tone })} ${pillTone}`}
							>
								<Mail className="size-[18px]" aria-hidden />
							</button>
						</li>
					) : null}
					{SOCIAL_LINKS.map(({ href, label, Icon }) => (
						<li key={href}>
							<a
								href={href}
								target="_blank"
								rel="noreferrer"
								aria-label={label}
								className={`${navPill({ variant: "icon", tone })} ${pillTone}`}
							>
								<Icon className="size-[18px]" />
							</a>
						</li>
					))}
				</ul>
			</nav>
			{/* The bloom anchors to this button; while open it leaves the a11y tree, so the
			    menu's X is the only "Close menu" control assistive tech can reach. */}
			<button
				type="button"
				onClick={onMobileToggle}
				aria-label={mobileOpen ? "Close menu" : "Open menu"}
				aria-expanded={mobileOpen}
				aria-controls="mobile-nav"
				aria-hidden={mobileOpen || undefined}
				tabIndex={mobileOpen ? -1 : undefined}
				className={`${navPill({ variant: "icon", tone })} md:hidden ${pillTone}`}
			>
				<AnimatePresence mode="wait" initial={false}>
					{mobileOpen ? (
						<m.span
							key="close"
							className="block"
							initial={{ rotate: -45, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: 45, opacity: 0 }}
							transition={{ duration: reducedMotion ? 0 : 0.15 }}
						>
							<X className="size-[22px]" aria-hidden />
						</m.span>
					) : (
						<m.span
							key="menu"
							className="block"
							initial={{ rotate: 45, opacity: 0 }}
							animate={{ rotate: 0, opacity: 1 }}
							exit={{ rotate: -45, opacity: 0 }}
							transition={{ duration: reducedMotion ? 0 : 0.15 }}
						>
							<Menu className="size-[22px]" aria-hidden />
						</m.span>
					)}
				</AnimatePresence>
			</button>
		</div>
	);
}
