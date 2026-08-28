import { init, track as trackEvent } from "@plausible-analytics/tracker";
import { SITE_URL } from "@/lib/site";

/** Vercel stamps every deployment with NEXT_PUBLIC_VERCEL_ENV; anything but
 * production would report under the live domain. */
export const isProductionDeploy = () =>
	process.env.NEXT_PUBLIC_VERCEL_ENV === "production";

/** Dashboard goal names: each needs a matching custom-event goal in Plausible. */
export const EVENTS = {
	contactOpened: "Contact: Opened",
	contactSent: "Contact: Sent",
	contactFailed: "Contact: Failed",
	videoPlayed: "Video: Played",
	notFound: "404",
} as const;

export type EventName = (typeof EVENTS)[keyof typeof EVENTS];

/** Which surface hosted the contact form. */
export type ContactSource = "intro" | "landfall" | "header" | "page";

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

let ready = false;

export function initAnalytics() {
	if (ready || typeof window === "undefined" || !isProductionDeploy()) return;
	init({
		domain: new URL(SITE_URL).hostname,
		// Same-origin path, rewritten in vercel.json: no CSP carve-out, no ad-block hit.
		endpoint: "/api/pa",
		outboundLinks: true,
		// Every event says which edition of the site the visitor got.
		customProperties: () => ({
			motion: window.matchMedia(REDUCED_MOTION).matches ? "reduced" : "full",
		}),
	});
	ready = true;
}

/** No-op until initAnalytics ran (dev, tests, previews). Props stay
 * low-cardinality and never carry visitor input. */
export function track(event: EventName, props?: Record<string, string>) {
	if (!ready) return;
	try {
		trackEvent(event, { props });
	} catch {
		// Analytics must never break the interaction it observes.
	}
}
