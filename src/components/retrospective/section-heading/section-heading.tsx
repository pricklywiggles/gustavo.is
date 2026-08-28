import { ScrollFadeIn } from "@/components/scroll-fade-in";
import type { Tone } from "@/lib/focus-ring";

/** `tone` is the ground the heading sits on, as everywhere else on the site. */
export function SectionHeading({
	children,
	tone = "dark",
}: {
	children: string;
	tone?: Tone;
}) {
	return (
		<ScrollFadeIn>
			<h2
				className={`font-display text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.15] ${
					tone === "dark" ? "text-pale-dune" : "text-dusk-ink"
				}`}
			>
				{children}
			</h2>
		</ScrollFadeIn>
	);
}
