import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ScrollRevealText } from "@/components/scroll-reveal-text";
import { cta } from "@/lib/cta";

/**
 * The signature letter reveal. Two bindings: Trigger plays once in real
 * time (replay remounts it), ScrollScrub ties the playhead to the page
 * scroll. The text control drives the first block (newlines become real
 * lines); the two blocks below it are fixed copy for a fuller feel.
 */
type TextArgs = {
	text?: string;
	font?: string;
	fontSize?: number;
	fontWeight?: number;
	lineHeight?: number;
	direction?: "left" | "right";
	order?: "normal" | "reverse";
	angle?: number;
	lineStagger?: number;
	speed?: number;
	delay?: number;
	triggerAt?: number;
	scrub?: number;
};

const meta = {
	title: "Text effects/Scroll reveal",
	parameters: { layout: "fullscreen" },
	args: {
		text: "Hi, I'm Gustavo.\nWelcome to the story.",
		font: "kitora",
		fontSize: 56,
		fontWeight: 700,
		lineHeight: 1.12,
		direction: "right",
		angle: 14,
		lineStagger: 0.4,
		speed: 1,
		delay: 0,
		triggerAt: 80,
	},
	argTypes: {
		font: {
			options: ["wotfard", "kitora"],
			mapping: { wotfard: "font-sans", kitora: "font-display" },
			control: { type: "radio" },
			description:
				"Kitora ships a single 700 cut; other weights render synthesized.",
		},
		fontSize: { control: { type: "range", min: 16, max: 120, step: 2 } },
		fontWeight: {
			options: [300, 400, 500, 600, 700],
			control: { type: "select" },
		},
		lineHeight: { control: { type: "range", min: 0.9, max: 2, step: 0.02 } },
		direction: { options: ["left", "right"], control: { type: "radio" } },
		order: {
			options: [undefined, "normal", "reverse"],
			control: { type: "radio" },
			description:
				"Which end of a line resolves first; unset fills toward the incoming side.",
		},
		angle: { control: { type: "range", min: 0, max: 40, step: 1 } },
		lineStagger: {
			control: { type: "range", min: 0, max: 1, step: 0.05 },
			description: "0 = lines together, 1 = strictly sequential.",
		},
		speed: { control: { type: "range", min: 0.25, max: 3, step: 0.25 } },
		delay: {
			control: { type: "range", min: 0, max: 2, step: 0.1 },
			description: "Trigger story only: lead before the cascade.",
		},
		triggerAt: {
			control: { type: "range", min: 0, max: 100, step: 5 },
			description: "Trigger story only: viewport % the block's top crosses.",
		},
		scrub: {
			control: { type: "range", min: 0, max: 2, step: 0.1 },
			description:
				"Scroll story only: catch-up smoothing seconds; unset locks.",
		},
	},
} satisfies Meta<TextArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

const EXTRA_BLOCKS = [
	"Twenty-six years in tech,\nstill in love with the craft.",
	"Most days you'll find me\npair programming with Kiwi.",
];

function RevealText({
	text = "",
	font = "font-sans",
	fontSize,
	fontWeight,
	lineHeight,
	mode,
	...reveal
}: TextArgs & { mode?: "scrub" | "trigger" }) {
	return (
		<ScrollRevealText
			as="p"
			mode={mode}
			className={`block whitespace-pre-line tracking-[-0.01em] ${font}`}
			style={{ fontSize, fontWeight, lineHeight }}
			{...reveal}
		>
			{text}
		</ScrollRevealText>
	);
}

function TriggerDemo(args: TextArgs) {
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
			<div key={run} className="mt-16 space-y-28">
				<RevealText {...args} mode="trigger" />
				{EXTRA_BLOCKS.map((block, i) => (
					<RevealText
						key={block}
						{...args}
						mode="trigger"
						text={block}
						delay={(args.delay ?? 0) + (i + 1) * 0.25}
					/>
				))}
			</div>
		</div>
	);
}

export const Trigger: Story = {
	render: (args) => <TriggerDemo {...args} />,
};

export const ScrollScrub: Story = {
	render: (args) => (
		<div className="bg-dusk-ink text-first-light">
			<div className="grid h-screen place-items-center text-first-light/50 text-sm">
				Scroll: each reveal scrubs with the page
			</div>
			<div className="space-y-[55vh] px-12">
				<RevealText {...args} />
				{EXTRA_BLOCKS.map((block) => (
					<RevealText key={block} {...args} text={block} />
				))}
			</div>
			<div className="h-[120vh]" />
		</div>
	),
};
