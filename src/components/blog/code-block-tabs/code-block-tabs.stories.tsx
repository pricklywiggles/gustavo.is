import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "@/components/blog/code-block";
import {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
} from "@/components/blog/code-block-tabs";
import {
	CodeSample,
	CSS_SAMPLE,
	TS_SAMPLE,
} from "@/components/blog/code-sample";

const meta = {
	title: "Blog/Code block tabs",
	component: CodeBlockTabs,
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
} satisfies Meta<typeof CodeBlockTabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Tabs: Story = {
	args: {
		defaultValue: "ramp.ts",
		children: (
			<>
				<CodeBlockTabsList>
					<CodeBlockTabsTrigger value="ramp.ts">ramp.ts</CodeBlockTabsTrigger>
					<CodeBlockTabsTrigger value="globals.css">
						globals.css
					</CodeBlockTabsTrigger>
				</CodeBlockTabsList>
				<CodeBlockTab value="ramp.ts">
					<CodeBlock>
						<CodeSample lines={TS_SAMPLE} />
					</CodeBlock>
				</CodeBlockTab>
				<CodeBlockTab value="globals.css">
					<CodeBlock>
						<CodeSample lines={CSS_SAMPLE} />
					</CodeBlock>
				</CodeBlockTab>
			</>
		),
	},
};

export const TitledPanels: Story = {
	args: {
		defaultValue: "typescript",
		children: (
			<>
				<CodeBlockTabsList>
					<CodeBlockTabsTrigger value="typescript">
						TypeScript
					</CodeBlockTabsTrigger>
					<CodeBlockTabsTrigger value="css">CSS</CodeBlockTabsTrigger>
				</CodeBlockTabsList>
				<CodeBlockTab value="typescript">
					<CodeBlock title="src/lib/ramp.ts">
						<CodeSample lines={TS_SAMPLE} />
					</CodeBlock>
				</CodeBlockTab>
				<CodeBlockTab value="css">
					<CodeBlock title="src/app/globals.css">
						<CodeSample lines={CSS_SAMPLE} />
					</CodeBlock>
				</CodeBlockTab>
			</>
		),
	},
};
