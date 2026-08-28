import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Mail } from "lucide-react";
import { navPill } from "./cta";
import type { Tone } from "./focus-ring";

/**
 * The header/footer pill: text pills for nav links, icon pills for the
 * contact trigger, socials, and menu toggles. Color and hover classes come
 * from the bar theme at the call site (src/components/bar-themes.ts); the
 * tones below are the shipped themes.
 */
const meta = {
	title: "Buttons/Nav pill",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const BARS: {
	name: string;
	ground: string;
	ring: Tone;
	tone: string;
	captionColor: string;
}[] = [
	{
		name: "First Light bar (return header on light sections)",
		ground: "bg-sand-haze",
		ring: "light",
		tone: "text-dusk-earth hover:bg-pale-dune",
		captionColor: "text-dusk-ink/60",
	},
	{
		name: "Sky bar (landing hero, blog)",
		ground: "bg-pale-dune",
		ring: "light",
		tone: "text-dusk-ink hover:bg-amber-mirage",
		captionColor: "text-dusk-ink/60",
	},
	{
		name: "Dark bar (retrospectives, 404, blog posts)",
		ground: "bg-dusk-earth",
		ring: "dark",
		tone: "text-pale-dune hover:bg-canyon-brown",
		captionColor: "text-first-light/60",
	},
];

export const Gallery: Story = {
	render: () => (
		<div className="flex min-h-screen flex-col">
			{BARS.map(({ name, ground, ring, tone, captionColor }) => (
				<section key={name} className={`flex-1 p-8 ${ground} ${captionColor}`}>
					<h2 className="mb-5 text-xs tracking-widest uppercase">{name}</h2>
					<div className="flex items-center gap-6">
						<div className="flex flex-col items-start gap-2">
							<a href="#top" className={`${navPill({ tone: ring })} ${tone}`}>
								Blog
							</a>
							<span className="text-xs">text · nav links</span>
						</div>
						<div className="flex flex-col items-start gap-2">
							<button
								type="button"
								aria-label="Contact"
								className={`${navPill({ variant: "icon", tone: ring })} ${tone}`}
							>
								<Mail className="size-[18px]" aria-hidden />
							</button>
							<span className="text-xs">icon · contact, socials, toggles</span>
						</div>
					</div>
				</section>
			))}
		</div>
	),
};
