import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SiteFooter } from "@/components/site-footer";

const meta = {
	title: "Components/Site footer",
	component: SiteFooter,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithCallout: Story = {
	args: {
		callout: (
			<div className="mx-auto w-full max-w-6xl px-6 pt-10 sm:px-10">
				<p className="font-display text-2xl text-first-light">
					Have a project in mind?
				</p>
			</div>
		),
	},
};
