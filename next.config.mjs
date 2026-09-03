import { withSentryConfig } from "@sentry/nextjs";
import { withBotId } from "botid/next/config";
import { createMDX } from "fumadocs-mdx/next";

const csp = [
	"default-src 'self'",
	// 'unsafe-inline' is unavoidable: RSC hydration inlines per-build scripts, and a nonce
	// CSP forces dynamic rendering site-wide. React's dev mode needs eval() for callstacks.
	`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self'",
	"frame-src https://player.vimeo.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	// Safari upgrades localhost subresources too, breaking the http dev server (WebKit 250776).
	...(process.env.NODE_ENV === "production"
		? ["upgrade-insecure-requests"]
		: []),
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	images: {
		// Empty port and search are deliberate: omitting either wildcards it.
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.ytimg.com",
				port: "",
				pathname: "/vi/**",
				search: "",
			},
		],
	},
	async redirects() {
		return [
			{
				source: "/remembering/ponder_blogs",
				destination: "/remembering/ponder-blogs",
				permanent: true,
			},
		];
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Content-Security-Policy", value: csp },
					// Safari alone caches HSTS from http://localhost, then force-upgrades the dev server.
					...(process.env.NODE_ENV === "production"
						? [
								{
									key: "Strict-Transport-Security",
									value: "max-age=63072000; includeSubDomains",
								},
							]
						: []),
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
					{ key: "X-Frame-Options", value: "DENY" },
					{
						key: "Permissions-Policy",
						value: "camera=(), microphone=(), geolocation=()",
					},
				],
			},
		];
	},
};

const withMDX = createMDX();

export default withSentryConfig(withBotId(withMDX(nextConfig)), {
	// Without SENTRY_AUTH_TOKEN the build skips source-map upload instead of failing.
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// Same-origin ingest: no connect-src carve-out needed, and ad blockers don't see sentry.io.
	tunnelRoute: "/sentry-tunnel",
	silent: !process.env.CI,
	telemetry: false,
});
