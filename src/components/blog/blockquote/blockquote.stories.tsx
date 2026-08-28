import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Blockquote } from "@/components/blog/blockquote";

/**
 * The MDX blockquote: a pull quote led by a Noon Sun mark rather than a card.
 * Markdown `>` quotes get the default mark; a post can pass its own via `icon`.
 * Always sits on the reading page's Dusk Earth ground.
 */
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

/** `icon` takes any node, so a post can lead with an emoji or its own mark. */
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

/** Multiple paragraphs keep the mark hanging beside the first cap line. */
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
