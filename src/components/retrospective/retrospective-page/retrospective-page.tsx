import { JsonLd } from "@/components/json-ld";
import { ScrollReset } from "@/components/scroll-reset";
import { SiteFooter } from "@/components/site-footer";
import { retrospectiveJsonLd } from "@/lib/structured-data";
import { FeaturesSection } from "../features-section";
import { LessonsSection } from "../lessons-section";
import { PurposeSection } from "../purpose-section";
import { RetroHero } from "../retro-hero";
import type { Retrospective } from "../retrospective-data";
import { TechSection } from "../tech-section";

/**
 * data-curtain-target tells the landing's CurtainLink the route committed,
 * so the blinds only open once this page is really on screen.
 */
export function RetrospectivePage({
	retrospective,
}: {
	retrospective: Retrospective;
}) {
	return (
		<>
			<JsonLd data={retrospectiveJsonLd(retrospective)} />
			<main data-curtain-target={`/remembering/${retrospective.slug}`}>
				<ScrollReset />
				<RetroHero retrospective={retrospective} />
				<PurposeSection paragraphs={retrospective.purpose} />
				<FeaturesSection
					features={retrospective.features.map(
						({ highlights: _, ...card }) => card,
					)}
				/>
				<LessonsSection lessons={retrospective.lessons} />
				<TechSection technologies={retrospective.technologies} />
			</main>
			<SiteFooter />
		</>
	);
}
