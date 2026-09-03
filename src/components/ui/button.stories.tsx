import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Button } from "./button";

/** These stories are the only consumer of the semantic token layer (:root in globals.css). */
const meta = {
	title: "Buttons/UI Button",
	component: Button,
	parameters: { layout: "centered" },
	args: { children: "Button" },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
	args: { variant: "outline" },
};

export const Disabled: Story = {
	args: { disabled: true },
};

const VARIANTS = [
	{ variant: "default", tokens: "--primary / --primary-foreground" },
	{ variant: "secondary", tokens: "--secondary / --secondary-foreground" },
	{ variant: "outline", tokens: "--border / --background / --muted" },
	{ variant: "ghost", tokens: "--muted" },
	{ variant: "destructive", tokens: "--destructive" },
	{ variant: "link", tokens: "--primary" },
] as const;

export const Variants: Story = {
	render: () => (
		<div className="flex flex-col gap-4 bg-background p-10">
			{VARIANTS.map(({ variant, tokens }) => (
				<div key={variant} className="flex items-center gap-4">
					<Button variant={variant} className="w-32">
						{variant}
					</Button>
					<span className="font-mono text-foreground/60 text-xs">{tokens}</span>
				</div>
			))}
		</div>
	),
};
