import { JsonLd } from "@/components/json-ld";
import { ParallaxHero } from "@/components/landing/hero";
import { IntroSection } from "@/components/landing/intro";
import { LandfallSection } from "@/components/landing/landfall";
import { OtherProjectsSection } from "@/components/landing/other-projects";
import { WorkHistorySection } from "@/components/landing/work-history";
import { MotionAnchor } from "@/components/motion-anchor";
import { SiteFooter } from "@/components/site-footer";
import { AUTHOR_NAME, SITE_DESCRIPTION } from "@/lib/site";
import { pageMetadata } from "@/lib/site-metadata";
import { siteJsonLd } from "@/lib/structured-data";

export const metadata = pageMetadata({
	path: "/",
	title: AUTHOR_NAME,
	absoluteTitle: true,
	description: SITE_DESCRIPTION,
});

/** SiteFooter stays a sibling of <main>: nested, the landmark demotes to role generic. */
export default function HomePage() {
	return (
		<>
			<JsonLd data={siteJsonLd()} />
			<main>
				<h1 className="sr-only">Gustavo Gallegos</h1>
				{/* Scroll compensation for live reduced-motion flips (data-motion-anchor). */}
				<MotionAnchor />
				<ParallaxHero reveal={<IntroSection />} />
				<WorkHistorySection />
				<OtherProjectsSection />
				<LandfallSection />
			</main>
			<SiteFooter />
		</>
	);
}
