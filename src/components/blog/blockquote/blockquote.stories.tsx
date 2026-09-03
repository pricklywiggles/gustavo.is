import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Blockquote } from "@/components/blog/blockquote";

const meta = {
	title: "Blog/Blockquote",
	component: Blockquote,
	parameters: { layout: "fullscreen" },
	decorators: [
		(StoryComponent) => (
			<div className="min-h-screen bg-dusk-earth px-8 py-6">
				<div className="mx-auto max-w-[65ch]">
					<StoryComponent />
				</div>
			</div>
		),
	],
} satisfies Meta<typeof Blockquote>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		children: (
			<p>
				The best code is the code you did not have to write, and the second best
				is the code somebody else can delete without asking you first.
			</p>
		),
	},
};

export const CustomIcon: Story = {
	args: {
		icon: "🥝",
		children: (
			<p>
				Kiwi reviews every pull request. Her approval rate is high and her
				feedback is mostly about whether it is dinner time.
			</p>
		),
	},
};

export const MultiParagraph: Story = {
	args: {
		children: (
			<>
				<p>
					Twenty-six years in and the part that still holds up is the same part
					that held up on day one.
				</p>
				<p>Someone has to care about the thing after you ship it.</p>
			</>
		),
	},
};
