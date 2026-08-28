import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";
import { initAnalytics } from "@/lib/analytics";

// Each init is guarded so a throw in one cannot skip the other.
try {
	// Same privacy posture as the server init in instrumentation.ts: errors
	// only, sendDefaultPii false, no replay, no cookies set by the SDK.
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		// Same derivation as instrumentation.ts, via the NEXT_PUBLIC_ mirror
		// because the client bundle only inlines public env vars.
		environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
		sendDefaultPii: false,
		tracesSampleRate: 0,
		enableLogs: false,
	});
} catch (error) {
	console.error("Sentry client init failed", error);
}

// Next loads one instrumentation-client file and src/ beats the root; a root copy is
// dead and checkBotId() then rejects every real visitor on Vercel.
try {
	initBotId({
		protect: [{ path: "/api/contact", method: "POST" }],
	});
} catch (error) {
	console.error(
		"BotID client init failed; /api/contact will reject real visitors on Vercel",
		error,
	);
	Sentry.captureException(error);
}

// Inert off production deploys (see initAnalytics): previews never report as gustavo.is.
try {
	initAnalytics();
} catch (error) {
	console.error("Plausible init failed", error);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
