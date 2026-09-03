import * as Sentry from "@sentry/nextjs";

/** sendDefaultPii false also gates v10 IP inference; no cookies either, so no consent duty. */
const options = {
	dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
	// Previews build with NODE_ENV=production, so only VERCEL_ENV tells them apart.
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

export const onRequestError = Sentry.captureRequestError;
