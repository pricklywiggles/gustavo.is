import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContactForm } from "@/components/contact-form";

/**
 * The reusable form behind /contact and the header dialog, one story per
 * tone. Client-side zod validation works here (submit empty to see the
 * field errors); a real submit hits /api/contact, which Storybook does not
 * serve, so it lands on the server-error state.
 */
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
