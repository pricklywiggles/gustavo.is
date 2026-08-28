"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/**
 * Deliberately a bare wireframe (the designed page comes later) so a render failure
 * degrades gracefully; boundary-caught errors are not auto-reported, so capture here.
 */
export default function ErrorPage({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	useEffect(() => {
		Sentry.captureException(error);
	}, [error]);

	return (
		<main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
			<h1 className="font-semibold text-2xl">Something went wrong</h1>
			<p>This page hit an error. Trying again usually fixes it.</p>
			<button
				type="button"
				onClick={reset}
				className="rounded-md border px-4 py-2"
			>
				Try again
			</button>
		</main>
	);
}
