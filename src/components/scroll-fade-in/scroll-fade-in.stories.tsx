import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ScrollFadeIn } from "@/components/scroll-fade-in";
import { cta } from "@/lib/cta";

/**
 * The body-copy entrance: gsap.from, so children are authored at rest and
 * read fine with no JS or reduced motion. It plays once when scrolled into
 * view; InView starts on screen (replay remounts), OnScroll starts below
 * the fold. The text control drives the first block; two fixed blocks
 * follow for a fuller feel.
 */
type TextArgs = {
	text?: string;
	font?: string;
	fontSize?: number;
	fontWeight?: number;
	lineHeight?: number;
	delay?: number;
};

const meta = {
	title: "Text effects/Scroll fade in",
	parameters: { layout: "fullscreen" },
	args: {
		text: "Most days you can find me pair programming with my dog Kiwi.\nShe reviews everything.",
		font: "wotfard",
		fontSize: 20,
		fontWeight: 400,
		lineHeight: 1.6,
		delay: 0,
	},
	argTypes: {
		font: {
			options: ["wotfard", "kitora"],
			mapping: { wotfard: "font-sans", kitora: "font-display" },
			control: { type: "radio" },
			description:
				"Kitora ships a single 700 cut; other weights render synthesized.",
		},
		fontSize: { control: { type: "range", min: 12, max: 72, step: 1 } },
		fontWeight: {
			options: [300, 400, 500, 600, 700],
			control: { type: "select" },
		},
		lineHeight: { control: { type: "range", min: 0.9, max: 2.4, step: 0.05 } },
		delay: { control: { type: "range", min: 0, max: 2, step: 0.1 } },
	},
} satisfies Meta<TextArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const EXTRA_BLOCKS = [
	"I've shipped everything from Microsoft Office features to AI-powered health apps, and the agents behind them.",
	"The retrospectives dig into what each project was and what it taught me.",
];

function FadeCopy({
	text = "",
	font = "font-sans",
	fontSize,
	fontWeight,
	lineHeight,
	delay,
}: TextArgs) {
	return (
		<ScrollFadeIn
			as="p"
			delay={delay}
			className={`max-w-[48ch] whitespace-pre-line ${font}`}
		>
			<span style={{ fontSize, fontWeight, lineHeight }}>{text}</span>
		</ScrollFadeIn>
	);
}

function InViewDemo(args: TextArgs) {
	const [run, setRun] = useState(0);
	return (
		<div className="min-h-screen bg-dusk-ink p-12 text-first-light">
			<button
				type="button"
				onClick={() => setRun((r) => r + 1)}
				className={`${cta({ variant: "outline", tone: "dark" })} border-pale-dune/40 text-pale-dune hover:bg-pale-dune/10`}
			>
				Replay
			</button>
			<div key={run} className="mt-14 space-y-20">
				<FadeCopy {...args} />
				{EXTRA_BLOCKS.map((block, i) => (
					<FadeCopy
						key={block}
						{...args}
						text={block}
						delay={(args.delay ?? 0) + (i + 1) * 0.2}
					/>
				))}
			</div>
		</div>
	);
}

export const InView: Story = {
	render: (args) => <InViewDemo {...args} />,
};

export const OnScroll: Story = {
	render: (args) => (
		<div className="bg-dusk-ink text-first-light">
			<div className="grid h-screen place-items-center text-first-light/50 text-sm">
				Scroll: each block fades up as it enters the viewport
			</div>
			<div className="space-y-[45vh] px-12">
				<FadeCopy {...args} />
				{EXTRA_BLOCKS.map((block) => (
					<FadeCopy key={block} {...args} text={block} />
				))}
			</div>
			<div className="h-[120vh]" />
		</div>
	),
};
