import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogPostHero } from "@/components/blog/blog-post-hero";
import { GroundStrata } from "@/components/blog/ground-strata";

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

export const Minimal: Story = {
	args: { tags: [] },
};

export const WithCover: Story = {
	args: {
		...Full.args,
		cover: {
			src: "/og/blog.jpg",
			width: 1200,
			height: 630,
			alt: "Lego Gustavo walking his dog Kiwi beneath the Hollywood sign",
		},
	},
	render: Full.render,
};

export const LongTitle: Story = {
	args: {
		title:
			"Pinning a scroll story without losing your mind, and what the measurement lies to you about",
		standfirst:
			"Measurement inside a pinned ScrollTrigger is wrong in ways that are entirely predictable once you know where the lie comes from.",
		tags: [],
	},
};
