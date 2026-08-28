import { ScrollFadeIn } from "@/components/scroll-fade-in";
import { type Paragraph, paragraphText } from "../retrospective-data";
import { SectionHeading } from "../section-heading";
import { Runs } from "../text-runs";

export function PurposeSection({ paragraphs }: { paragraphs: Paragraph[] }) {
	return (
		<section data-surface="pale-dune" className="bg-pale-dune">
			<div className="mx-auto w-full max-w-6xl px-6 py-24 sm:px-10 md:py-32 lg:grid lg:grid-cols-12 lg:gap-x-12">
				<div className="lg:col-span-4">
					{/* The heading keeps the reader company down the column. */}
					<div className="lg:sticky lg:top-28">
						<SectionHeading tone="light">Inception and purpose</SectionHeading>
					</div>
				</div>
				<div className="mt-10 flex max-w-[66ch] flex-col gap-7 lg:col-span-8 lg:mt-0">
					{paragraphs.map((paragraph, index) => (
						<ScrollFadeIn
							key={paragraphText(paragraph)}
							as="p"
							delay={index * 0.08}
							className="text-[1.0625rem] leading-[1.75] text-dusk-ink/90"
						>
							<Runs paragraph={paragraph} />
						</ScrollFadeIn>
					))}
				</div>
			</div>
		</section>
	);
}
