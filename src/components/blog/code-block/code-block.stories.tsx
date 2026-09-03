import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "@/components/blog/code-block";
import { CodeSample, TS_SAMPLE } from "@/components/blog/code-sample";

const meta = {
	title: "Blog/Code block",
	component: CodeBlock,
	parameters: { layout: "fullscreen" },
	decorators: [
		(StoryComponent) => (
			<div className="min-h-screen bg-dusk-earth px-8 py-10">
				<div className="mx-auto max-w-[65ch]">
					<StoryComponent />
				</div>
			</div>
		),
	],
} satisfies Meta<typeof CodeBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {
	args: { children: <CodeSample lines={TS_SAMPLE} /> },
};

export const Titled: Story = {
	args: {
		title: "src/lib/ramp.ts",
		children: <CodeSample lines={TS_SAMPLE} />,
	},
};

export const NoCopy: Story = {
	args: {
		title: "src/lib/ramp.ts",
		allowCopy: "false",
		children: <CodeSample lines={TS_SAMPLE} />,
	},
};
