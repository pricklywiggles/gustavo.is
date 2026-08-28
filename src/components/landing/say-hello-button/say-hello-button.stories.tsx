import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { domMax, LazyMotion } from "motion/react";
import { SayHelloButton } from "@/components/landing/say-hello-button";

/**
 * The shared contact trigger: the mail glyph waves on hover, and with a
 * morphId the contact dialog morphs out of the button. The surface prop
 * carries the colors so each section grounds it on its own scene.
 */
const meta = {
	title: "Buttons/Say hello",
	component: SayHelloButton,
	parameters: { layout: "fullscreen" },
	args: { onClick: () => {}, tone: "light" },
	decorators: [
		(StoryComponent) => (
			<LazyMotion strict features={domMax}>
				<StoryComponent />
			</LazyMotion>
		),
	],
} satisfies Meta<typeof SayHelloButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const IntroSurface: Story = {
	render: (args) => (
		<div className="bg-first-light p-12">
			<SayHelloButton {...args} />
		</div>
	),
};

export const LandfallSurface: Story = {
	args: {
		surface: "bg-canyon-brown text-white hover:bg-canyon-brown/85",
		tone: "dark",
	},
	render: (args) => (
		<div className="bg-dusk-ink p-12">
			<SayHelloButton {...args} />
		</div>
	),
};
