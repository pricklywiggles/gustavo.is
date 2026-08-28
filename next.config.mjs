import { withSentryConfig } from "@sentry/nextjs";
import { withBotId } from "botid/next/config";
import { createMDX } from "fumadocs-mdx/next";

const csp = [
	"default-src 'self'",
	// 'unsafe-inline' is deliberate: Next streams RSC hydration via inline scripts whose
	// content differs per page/build (not hash-allowlistable), and a nonce CSP requires
	// dynamic rendering site-wide. Accepted: nothing here reflects visitor content into
	// the page as raw HTML, so there is no injection point this directive would guard.
	// 'unsafe-eval' in dev only: React dev mode uses eval() for callstack reconstruction.
	`script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
	"style-src 'self' 'unsafe-inline'",
	"img-src 'self' data:",
	"font-src 'self'",
	// Only for the retrospectives' Vimeo walkthroughs.
	"frame-src https://player.vimeo.com",
	"object-src 'none'",
	"base-uri 'self'",
	"form-action 'self'",
	"frame-ancestors 'none'",
	// Production only: Safari applies this to localhost subresources (WebKit bug 250776),
	// upgrading every dev asset fetch to https against the plain-HTTP dev server.
	...(process.env.NODE_ENV === "production"
		? ["upgrade-insecure-requests"]
		: []),
].join("; ");

/** @type {import('next').NextConfig} */
const nextConfig = {
	poweredByHeader: false,
	images: {
		// The blog's YouTube-card thumbnails; the browser only fetches the same-origin
		// /_next/image URL. Explicit empty port and search: omitting them wildcards both.
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
		// The pre-redesign URL; external links and search results still point at it.
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
					// Production only: Safari caches HSTS from http://localhost (others ignore
					// it per RFC 6797) and then force-upgrades dev to https, which cannot connect.
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
	// Source maps upload only when SENTRY_AUTH_TOKEN is set; the build otherwise skips it.
	org: process.env.SENTRY_ORG,
	project: process.env.SENTRY_PROJECT,
	authToken: process.env.SENTRY_AUTH_TOKEN,
	// Same-origin ingest: the CSP has no connect-src carve-out (events ride default-src
	// 'self'), and ad blockers don't see sentry.io.
	tunnelRoute: "/sentry-tunnel",
	silent: !process.env.CI,
	telemetry: false,
});
