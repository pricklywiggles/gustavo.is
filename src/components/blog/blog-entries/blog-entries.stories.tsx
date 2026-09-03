import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BlogEntries, type BlogEntry } from "@/components/blog/blog-entries";

const meta = {
	title: "Blog/Blog entries",
	component: BlogEntries,
	parameters: { layout: "fullscreen" },
	decorators: [
		(StoryComponent) => (
			<div className="min-h-screen bg-dusk-earth px-8 py-14">
				<div className="mx-auto max-w-3xl">
					<StoryComponent />
				</div>
			</div>
		),
	],
} satisfies Meta<typeof BlogEntries>;

export default meta;
type Story = StoryObj<typeof meta>;

const ENTRIES: BlogEntry[] = [
	{
		url: "/blog/hello-world",
		title: "Hello world",
		description:
			"Why this site exists, what it is built on, and what I plan to write about now that there is somewhere to put it.",
		dateTime: "2026-07-16",
		dateLabel: "July 16, 2026",
	},
	{
		url: "/blog/one-ramp",
		title: "One ramp, no dark mode",
		description:
			"Every surface colour on this site comes from a single warm ramp. Here is what that constraint bought me, and the two places I had to break it on purpose.",
		dateTime: "2026-06-02",
		dateLabel: "June 2, 2026",
	},
	{
		url: "/blog/pinned-scroll",
		title: "Pinning a scroll story without losing your mind",
		description:
			"Measurement inside a pinned ScrollTrigger lies to you in ways that are entirely predictable once you know where the lie comes from.",
		dateTime: "2026-04-19",
		dateLabel: "April 19, 2026",
	},
];

export const Rail: Story = {
	args: { entries: ENTRIES },
};

export const WithCovers: Story = {
	args: {
		entries: ENTRIES.map((entry, i) =>
			i === 1
				? entry
				: {
						...entry,
						cover: { src: "/og/blog.jpg", width: 1200, height: 630, alt: "" },
					},
		),
	},
};

export const WithoutDescriptions: Story = {
	args: {
		entries: ENTRIES.map(({ description: _description, ...entry }) => entry),
	},
};

export const PastTheStaggerBatch: Story = {
	args: {
		entries: Array.from({ length: 7 }, (_, i) => ({
			...ENTRIES[i % ENTRIES.length],
			url: `/blog/entry-${i}`,
			title: `${ENTRIES[i % ENTRIES.length].title} (${i + 1})`,
		})),
	},
};
