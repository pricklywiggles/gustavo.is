import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GroundStrata } from "@/components/blog/ground-strata";

/**
 * The hero's ground bands compressed to hairline seams. The reading page uses both
 * orientations: the opening seam is content-width under the title (full bleed read as
 * a wall between title and body), the closing seam is full bleed and flipped so it
 * thickens toward the article it is closing.
 */
const meta = {
	title: "Blog/Ground strata",
	component: GroundStrata,
	parameters: { layout: "fullscreen" },
} satisfies Meta<typeof GroundStrata>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Both seams as the reading page stacks them, with the article body between. */
export const InPlace: Story = {
	render: () => (
		<div className="min-h-screen bg-dusk-earth">
			<div className="mx-auto w-full max-w-3xl px-8 pt-16">
				<div className="mx-auto max-w-[65ch]">
					<p className="pb-10 font-display text-3xl text-pale-dune">
						A post title sits here
					</p>
					<GroundStrata />
				</div>
			</div>
			<div className="mx-auto max-w-[65ch] px-8 py-16 text-pale-dune/85">
				<p>
					Body copy runs between the two seams. The opening seam is
					content-width; the closing one below is full bleed and flipped, so
					each thickens toward the article.
				</p>
			</div>
			<GroundStrata flip />
		</div>
	),
};

/** The two orientations side by side, enlarged, so the mirror is legible. */
export const Orientations: Story = {
	render: () => (
		<div className="grid min-h-screen grid-cols-2 gap-10 bg-dusk-earth p-12">
			{[
				{ flip: false, label: "default · thickens downward" },
				{ flip: true, label: "flip · thickens upward" },
			].map(({ flip, label }) => (
				<div key={label} className="flex flex-col gap-4">
					<GroundStrata flip={flip} />
					<span className="text-pale-dune/60 text-xs">{label}</span>
				</div>
			))}
		</div>
	),
};
