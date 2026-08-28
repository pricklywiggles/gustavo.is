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

/**
 * The shape remarkCodeTab emits: consecutive fences carrying tab="Label" arrive as one
 * CodeBlockTabs around a trigger list and one CodeBlockTab per fence. The frame here
 * owns the chrome, so the CodeBlocks inside drop their own and their title strips sit
 * on the frame's ink instead of a Dune Tan band.
 *
 * The active pill is the Tabs.Indicator itself, sliding between labels. Panels are
 * keepMounted so every tab's code ships in the prerendered HTML.
 */
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

/** Click between tabs to watch the indicator slide. */
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

/** With per-fence titles, which sit on the frame's ink rather than their own band. */
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
