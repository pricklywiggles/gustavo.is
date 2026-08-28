import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { domMax, LazyMotion } from "motion/react";
import { useState } from "react";
import { ContactDialog } from "@/components/contact-dialog";
import { cta } from "@/lib/cta";

/**
 * The say-hello dialog in its plain-modal mode (no morphId, so it fades in
 * on the settled color). The layoutId morph needs a shared trigger and a
 * page-level domMax provider; see the say-hello button story for the
 * trigger half. Provider is non-strict on purpose: the form inside uses
 * the full-motion AnimatedButton.
 */
const meta = {
	title: "Components/Contact dialog",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function DialogDemo() {
	const [open, setOpen] = useState(false);
	return (
		<LazyMotion features={domMax}>
			<div className="grid min-h-screen place-items-center bg-first-light">
				<button
					type="button"
					onClick={() => setOpen(true)}
					className={`${cta({ tone: "light" })} bg-dusk-earth text-first-light hover:bg-dusk-earth/85`}
				>
					Say hello
				</button>
				<ContactDialog open={open} onOpenChange={setOpen} source="header" />
			</div>
		</LazyMotion>
	);
}

export const PlainModal: Story = {
	render: () => <DialogDemo />,
};
