import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StarLayer } from "@/components/star-layer";

const meta = {
	title: "Components/Star layer",
	component: StarLayer,
	parameters: { layout: "fullscreen" },
	args: {
		seed: 7,
		count: 140,
		minRadius: 0.5,
		maxRadius: 1.6,
	},
	argTypes: {
		seed: { control: { type: "number" } },
		count: { control: { type: "range", min: 10, max: 400, step: 10 } },
		minRadius: { control: { type: "range", min: 0.2, max: 3, step: 0.1 } },
		maxRadius: { control: { type: "range", min: 0.2, max: 4, step: 0.1 } },
	},
} satisfies Meta<typeof StarLayer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Field: Story = {
	render: (args) => (
		<div className="h-screen bg-dusk-ink">
			<StarLayer {...args} className="h-full w-full" />
		</div>
	),
};

export const Depths: Story = {
	render: () => (
		<div className="relative h-screen overflow-hidden bg-dusk-ink">
			<StarLayer
				seed={11}
				count={180}
				minRadius={0.4}
				maxRadius={0.9}
				className="absolute inset-0 h-full w-full opacity-60"
			/>
			<StarLayer
				seed={23}
				count={80}
				minRadius={0.8}
				maxRadius={1.4}
				className="absolute inset-0 h-full w-full opacity-80"
			/>
			<StarLayer
				seed={47}
				count={30}
				minRadius={1.2}
				maxRadius={2.2}
				className="absolute inset-0 h-full w-full"
			/>
		</div>
	),
};
