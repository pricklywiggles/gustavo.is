import type { ReactNode } from "react";
import { CurtainLink } from "@/components/curtain-link";
import { navPill } from "@/lib/cta";
import { FOCUS_OUTLINE } from "@/lib/focus-ring";
import { FOOTER_LINKS, SOCIAL_LINKS } from "@/lib/site-links";

/**
 * Sibling of <main>: nesting demotes <footer> to role generic. The opacities are
 * contrast-checked on Dusk Earth (/85 is 5.70:1, /75 is 4.86:1); do not lower them.
 */
export function SiteFooter({ callout }: { callout?: ReactNode }) {
	return (
		// MotionAnchor point, selectable only once the footer outgrows the viewport.
		<footer data-motion-anchor="flow" className="bg-dusk-earth">
			{callout}
			<div className="mx-auto w-full max-w-6xl px-6 pt-8 pb-10 sm:px-10">
				<div className="flex flex-wrap items-center justify-between gap-6">
					<nav aria-label="Footer">
						<ul className="flex items-center gap-6">
							{FOOTER_LINKS.map(({ href, label }) => (
								<li key={href}>
									<CurtainLink
										href={href}
										className={`rounded-sm font-medium text-[0.8125rem] text-first-light/85 tracking-[0.01em] transition-colors duration-150 hover:text-first-light ${FOCUS_OUTLINE.dark}`}
									>
										{label}
									</CurtainLink>
								</li>
							))}
						</ul>
					</nav>
					<ul className="flex items-center gap-2">
						{SOCIAL_LINKS.map(({ href, label, Icon }) => (
							<li key={href}>
								<a
									href={href}
									target="_blank"
									// rel="me" claims the profile as this site's owner (IndieWeb, Mastodon).
									rel="me noreferrer"
									aria-label={label}
									className={`${navPill({ variant: "icon", tone: "dark" })} text-first-light/85 hover:text-first-light`}
								>
									<Icon className="size-[18px]" />
								</a>
							</li>
						))}
					</ul>
				</div>
				<p className="mt-4 text-first-light/75 text-sm">
					&copy; {new Date().getFullYear()} Gustavo Gallegos
				</p>
			</div>
		</footer>
	);
}
