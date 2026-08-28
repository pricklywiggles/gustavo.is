import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogPostHero } from "@/components/blog/blog-post-hero";
import { GroundStrata } from "@/components/blog/ground-strata";

/**
 * The reading page's opening. Contrast on Dusk Earth: eyebrow Noon Sun 5.08:1, title
 * 6.03:1, standfirst 4.88:1. The content column is the article's own 65ch measure, so
 * the hero's left edge lines up with the body copy below it.
 *
 * pt-28 clears the overlaid riding bar, which Storybook does not mount here.
 */
const meta = {
	title: "Blog/Post hero",
	component: BlogPostHero,
	parameters: { layout: "fullscreen" },
	args: {
		title: "One ramp, no dark mode",
		dateTime: "2026-06-02",
		dateLabel: "June 2, 2026",
	},
} satisfies Meta<typeof BlogPostHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Full: Story = {
	args: {
		standfirst:
			"Every surface colour on this site comes from a single warm ramp. Here is what that constraint bought me, and the two places I had to break it on purpose.",
		tags: ["design systems", "css", "colour"],
	},
	render: (args) => (
		<div className="min-h-screen bg-dusk-earth">
			<BlogPostHero {...args} />
			<div className="mx-auto w-full max-w-3xl px-6 sm:px-8">
				<div className="mx-auto max-w-[65ch]">
					<GroundStrata />
				</div>
			</div>
		</div>
	),
};

/** No standfirst and no tags: the title carries the whole hero. */
export const Minimal: Story = {
	args: { tags: [] },
};

/**
 * A long title wraps on its own balance point, and the standfirst delay steps back to
 * 0.16 when there are no tags to follow it.
 */
export const LongTitle: Story = {
	args: {
		title:
			"Pinning a scroll story without losing your mind, and what the measurement lies to you about",
		standfirst:
			"Measurement inside a pinned ScrollTrigger is wrong in ways that are entirely predictable once you know where the lie comes from.",
		tags: [],
	},
};
