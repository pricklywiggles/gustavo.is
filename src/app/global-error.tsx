"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

/** Replaces the root layout: no fonts, no globals.css, so every style here is inline. */
export default function GlobalError({
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
		<html lang="en">
			<body
				style={{
					margin: 0,
					fontFamily: "ui-sans-serif, system-ui, sans-serif",
				}}
			>
				<main
					style={{
						minHeight: "100svh",
						maxWidth: "28rem",
						margin: "0 auto",
						padding: "0 1.5rem",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "1rem",
						textAlign: "center",
					}}
				>
					<h1 style={{ fontSize: "1.5rem", fontWeight: 600, margin: 0 }}>
						Something went wrong
					</h1>
					<p style={{ margin: 0 }}>
						The site hit an error it could not recover from. Trying again
						usually fixes it.
					</p>
					<button
						type="button"
						onClick={() => reset()}
						style={{
							font: "inherit",
							background: "none",
							border: "1px solid currentcolor",
							borderRadius: "6px",
							padding: "0.5rem 1rem",
							cursor: "pointer",
						}}
					>
						Try again
					</button>
				</main>
			</body>
		</html>
	);
}
