import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { isProductionDeploy } from "@/lib/analytics";
import {
	AUTHOR_NAME,
	FEED_PATH,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
} from "@/lib/site";
import { ogImage } from "@/lib/site-metadata";
import { fontVariables } from "./fonts";
import "./globals.css";

// Pages restate alternates/openGraph through pageMetadata(); this is the floor for
// routes without their own (the 404 page).
export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	title: { default: AUTHOR_NAME, template: `%s | ${SITE_NAME}` },
	description: SITE_DESCRIPTION,
	authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
	creator: AUTHOR_NAME,
	alternates: { types: { "application/rss+xml": FEED_PATH } },
	openGraph: {
		type: "website",
		siteName: SITE_NAME,
		locale: "en_US",
		images: [ogImage("default")],
	},
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	// The NODE_ENV check is statically replaced at build time, so production never
	// imports the lab or its candidate faces (no lab chunk, no candidate @font-face);
	// the candidates' variables go on <html>, where the lab's indirection resolves.
	let fontLab: React.ReactNode = null;
	let labVariables = "";
	if (process.env.NODE_ENV === "development") {
		const [{ FontLab }, { labFaceVariables }] = await Promise.all([
			import("@/components/font-lab"),
			import("@/components/font-lab/font-lab-faces"),
		]);
		fontLab = <FontLab />;
		labVariables = ` ${labFaceVariables}`;
	}

	return (
		<html
			lang="en"
			className={`${fontVariables}${labVariables} motion-safe:scroll-smooth`}
		>
			{/* Headers are owned per route group: (with-header)/layout.tsx mounts
			    SiteHeader; the blog index mounts its own bar under its hero. */}
			<body className="font-sans antialiased">
				{children}
				{fontLab}
				{/* Plausible starts in instrumentation-client.ts. Speed Insights only on
				    production deploys: in dev it loads cross-origin (the CSP blocks it) and
				    previews would spend the Hobby event quota. */}
				{isProductionDeploy() && <SpeedInsights />}
			</body>
		</html>
	);
}
