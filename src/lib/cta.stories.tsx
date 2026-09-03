import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { cta } from "./cta";
import type { Tone } from "./focus-ring";

const meta = {
	title: "Buttons/CTA recipe",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type Example = {
	caption: string;
	variant: "solid" | "outline";
	colors: string;
	as?: "a" | "button";
	disabled?: boolean;
};

const GROUNDS: {
	name: string;
	ground: string;
	tone: Tone;
	captionColor: string;
	examples: Example[];
}[] = [
	{
		name: "First Light ground (landing intro, /contact)",
		ground: "bg-first-light",
		tone: "light",
		captionColor: "text-dusk-ink/60",
		examples: [
			{
				caption: "contact send · say hello (default surface)",
				variant: "solid",
				colors: "bg-dusk-earth text-first-light hover:bg-dusk-earth/85",
			},
			{
				caption: "contact cancel",
				variant: "outline",
				colors: "border-dusk-earth/30 text-dusk-ink hover:bg-sand-haze",
			},
			{
				caption: 'intro "See my work" · renders as <a>',
				variant: "outline",
				colors:
					"border-dusk-earth/30 text-dusk-ink hover:border-dusk-earth/50 hover:bg-amber-mirage/60",
				as: "a",
			},
		],
	},
	{
		name: "Dusk Earth ground (contact dialog, dark tone)",
		ground: "bg-dusk-earth",
		tone: "dark",
		captionColor: "text-first-light/60",
		examples: [
			{
				caption: "dialog send",
				variant: "solid",
				colors: "bg-pale-dune text-dusk-earth hover:bg-amber-mirage",
			},
			{
				caption: "dialog cancel",
				variant: "outline",
				colors:
					"border-first-light/30 text-first-light hover:bg-first-light/10",
			},
		],
	},
	{
		name: "Dusk Ink ground (project showcase, 404, landfall)",
		ground: "bg-dusk-ink",
		tone: "dark",
		captionColor: "text-pale-dune/60",
		examples: [
			{
				caption: "showcase primary link · renders as <a> or CurtainLink",
				variant: "solid",
				colors: "bg-pale-dune text-dusk-ink hover:bg-noon-sun",
				as: "a",
			},
			{
				caption: "showcase secondary link",
				variant: "outline",
				colors: "border-pale-dune/40 text-pale-dune hover:bg-pale-dune/10",
				as: "a",
			},
			{
				caption: '404 "Warp back home" · renders as CurtainLink',
				variant: "solid",
				colors: "bg-dusk-earth text-pale-dune hover:bg-canyon-brown",
				as: "a",
			},
			{
				caption: "showcase unwired action · disabled",
				variant: "outline",
				colors: "border-pale-dune/40 text-pale-dune hover:bg-pale-dune/10",
				disabled: true,
			},
		],
	},
];

function CtaExample({
	caption,
	variant,
	colors,
	as,
	disabled,
	tone,
}: Example & { tone: Tone }) {
	const className = `${cta({ variant, tone })} ${colors}`;
	return (
		<div className="flex flex-col items-start gap-2">
			{as === "a" ? (
				<a href="#top" className={className}>
					Label
				</a>
			) : (
				<button type="button" disabled={disabled} className={className}>
					Label
				</button>
			)}
			<span className="text-xs">{caption}</span>
		</div>
	);
}

export const Gallery: Story = {
	render: () => (
		<div className="flex min-h-screen flex-col">
			{GROUNDS.map(({ name, ground, tone, captionColor, examples }) => (
				<section key={name} className={`flex-1 p-8 ${ground} ${captionColor}`}>
					<h2 className="mb-5 text-xs tracking-widest uppercase">{name}</h2>
					<div className="flex flex-wrap items-start gap-8">
						{examples.map((example) => (
							<CtaExample key={example.caption} tone={tone} {...example} />
						))}
					</div>
				</section>
			))}
		</div>
	),
};
