import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { AnimatedNumber } from "@/components/animated-number";
import { cta } from "@/lib/cta";

/**
 * Site-standard rolling counter. The point of the wrapper is directional
 * consistency: digits roll forward when the value grows and backward when
 * it shrinks, and widths never jitter thanks to tabular-nums.
 */
const meta = {
	title: "Components/Animated number",
	parameters: { layout: "centered" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const STEPS = [-100, -1, 1, 100];

function CounterDemo() {
	const [value, setValue] = useState(1024);
	return (
		<div className="flex flex-col items-center gap-8 bg-first-light p-12">
			<AnimatedNumber className="font-display text-6xl text-dusk-ink">
				{value}
			</AnimatedNumber>
			<div className="flex gap-3">
				{STEPS.map((step) => (
					<button
						key={step}
						type="button"
						onClick={() => setValue((v) => v + step)}
						className={`${cta({ variant: "outline", tone: "light" })} border-dusk-earth/30 text-dusk-ink hover:bg-sand-haze`}
					>
						{step > 0 ? `+${step}` : step}
					</button>
				))}
			</div>
		</div>
	);
}

export const Counter: Story = {
	render: () => <CounterDemo />,
};
