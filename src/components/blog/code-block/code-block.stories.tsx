import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CodeBlock } from "@/components/blog/code-block";
import { CodeSample, TS_SAMPLE } from "@/components/blog/code-sample";

/**
 * The MDX `pre` replacement: the Dusk Ink frame, the optional title strip, and the
 * copy button. rehype-code meta arrives as props, so `title="file.ts"` comes through
 * verbatim and a `noCopy` fence arrives as allowCopy="false".
 *
 * The copy button hides until hover only where hover exists; on touch it rests visible
 * or it could never be found. Colours come from src/lib/code-theme.ts.
 */
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

/** A bare fence: frame, code, and the copy button. */
export const Plain: Story = {
	args: { children: <CodeSample lines={TS_SAMPLE} /> },
};

/** ```ts title="src/lib/ramp.ts" — the strip wears Dune Tan on the standalone frame. */
export const Titled: Story = {
	args: {
		title: "src/lib/ramp.ts",
		children: <CodeSample lines={TS_SAMPLE} />,
	},
};

/** A `noCopy` fence: same frame, no button. */
export const NoCopy: Story = {
	args: {
		title: "src/lib/ramp.ts",
		allowCopy: "false",
		children: <CodeSample lines={TS_SAMPLE} />,
	},
};
