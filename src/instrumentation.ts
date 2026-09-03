import * as Sentry from "@sentry/nextjs";
import { isVercelDeploy } from "@/lib/deploy-env";

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
	// Local dev, CI builds, and vercel dev stay silent; only real deploys report.
	if (!isVercelDeploy()) return;
	if (process.env.NEXT_RUNTIME === "nodejs") {
		Sentry.init(options);
	}
	if (process.env.NEXT_RUNTIME === "edge") {
		Sentry.init(options);
	}
}

export const onRequestError = Sentry.captureRequestError;
