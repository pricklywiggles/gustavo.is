import * as Sentry from "@sentry/nextjs";

/**
 * Errors only, nothing personal: no tracing, replay, or logs, and sendDefaultPii stays
 * false so no IP, cookies, or headers attach (v10 gates IP inference behind it). Sentry
 * sets no cookies, so no consent obligations; without a DSN the SDK stays disabled.
 */
const options = {
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	// Sentry defaults events to "production"; VERCEL_ENV separates production from
	// preview (both build with NODE_ENV=production), NODE_ENV covers local dev.
	environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV,
	sendDefaultPii: false,
	tracesSampleRate: 0,
	enableLogs: false,
};

export function register() {
	if (process.env.NEXT_RUNTIME === "nodejs") {
		Sentry.init(options);
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		Sentry.init(options);
	}
}

/** Unhandled SSR and route-handler errors (the real 500s) land in Sentry. */
export const onRequestError = Sentry.captureRequestError;
