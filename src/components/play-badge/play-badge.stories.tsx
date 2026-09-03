import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PlayBadge } from "@/components/play-badge";

/** Decorative by contract: the host carries the accessible name and the `group` class. */
const meta = {
	title: "Components/Play badge",
	component: PlayBadge,
	parameters: { layout: "centered" },
} satisfies Meta<typeof PlayBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Sizes: Story = {
	render: () => (
		<div className="flex items-end gap-8 bg-first-light p-12">
			{(["md", "lg"] as const).map((size) => (
				<div key={size} className="flex flex-col items-center gap-2">
					<button
						type="button"
						aria-label={`Play walkthrough (${size})`}
						className="group grid h-44 w-72 place-items-center rounded-xl bg-dusk-ink"
					>
						<PlayBadge size={size} />
					</button>
					<span className="text-dusk-ink/60 text-xs">
						{size} · hover the facade to swell
					</span>
				</div>
			))}
		</div>
	),
};
