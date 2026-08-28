import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { AnimatedButton } from "@/components/animated-button";
import { cta } from "@/lib/cta";

/**
 * System rule (DESIGN.md): any button whose content changes with state uses
 * AnimatedButton so the box springs to the new size instead of snapping.
 * Shipped in the contact form's send/cancel pair.
 */
const meta = {
	title: "Buttons/Animated button",
	component: AnimatedButton,
	parameters: { layout: "centered" },
} satisfies Meta<typeof AnimatedButton>;

export default meta;
type Story = StoryObj<typeof meta>;

function SizeMorphDemo() {
	const [busy, setBusy] = useState(false);
	return (
		<div className="flex flex-col items-center gap-4 bg-first-light p-12">
			<AnimatedButton
				type="button"
				onClick={() => setBusy((value) => !value)}
				className={`${cta({ tone: "light" })} bg-dusk-earth text-first-light hover:bg-dusk-earth/85`}
			>
				{busy ? "Sending your message…" : "Send"}
			</AnimatedButton>
			<p className="text-dusk-ink/60 text-xs">
				Click to swap the label and watch the box spring to size
			</p>
		</div>
	);
}

export const SizeMorph: Story = {
	render: () => <SizeMorphDemo />,
};
