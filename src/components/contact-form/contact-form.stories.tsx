import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactForm } from "@/components/contact-form";

/** Storybook does not serve /api/contact, so a real submit lands on the server-error state. */
const meta = {
	title: "Components/Contact form",
	component: ContactForm,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LightTone: Story = {
	args: { tone: "light", source: "page" },
	render: (args) => (
		<div className="min-h-screen bg-first-light p-10">
			<div className="mx-auto max-w-xl">
				<ContactForm {...args} />
			</div>
		</div>
	),
};

export const DarkTone: Story = {
	args: { tone: "dark", source: "header", onCancel: () => {} },
	render: (args) => (
		<div className="min-h-screen bg-dusk-earth p-10">
			<div className="mx-auto max-w-xl">
				<ContactForm {...args} />
			</div>
		</div>
	),
};
