import * as Sentry from "@sentry/nextjs";
import { initBotId } from "botid/client/core";
import { initAnalytics } from "@/lib/analytics";

try {
	// Mirrors the server init's privacy posture in instrumentation.ts.
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		// NEXT_PUBLIC_ mirror: the client bundle only inlines public env vars.
		environment: process.env.NEXT_PUBLIC_VERCEL_ENV ?? process.env.NODE_ENV,
		sendDefaultPii: false,
		tracesSampleRate: 0,
		enableLogs: false,
	});
} catch (error) {
	console.error("Sentry client init failed", error);
}

// Next loads one instrumentation-client file and src/ beats the root; a root copy is dead.
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

// initAnalytics() self-guards: it stays inert off production deploys.
try {
	initAnalytics();
} catch (error) {
	console.error("Plausible init failed", error);
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
