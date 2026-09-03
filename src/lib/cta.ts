import { cva, type VariantProps } from "class-variance-authority";
import { FOCUS_RING, type Tone } from "./focus-ring";

const ctaVariants = cva(
	"flex h-11 items-center gap-2.5 rounded-lg px-5 font-medium text-sm transition-colors duration-150 active:translate-y-px disabled:pointer-events-none disabled:opacity-60",
	{
		variants: {
			variant: {
				solid: "active:shadow-pressed",
				outline: "border",
			},
			tone: FOCUS_RING,
		},
		defaultVariants: {
			variant: "solid",
		},
	},
);

/** `tone` is required: cva can't demand a variant, and no tone means no focus ring. */
export function cta({
	tone,
	...props
}: Omit<VariantProps<typeof ctaVariants>, "tone"> & { tone: Tone }) {
	return ctaVariants({ tone, ...props });
}

const navPillVariants = cva("rounded-full transition-colors duration-150", {
	variants: {
		variant: {
			text: "px-3.5 py-1.5 font-medium text-[0.8125rem] tracking-[0.01em]",
			icon: "flex p-2",
		},
		tone: FOCUS_RING,
	},
	defaultVariants: {
		variant: "text",
	},
});

export function navPill({
	tone,
	...props
}: Omit<VariantProps<typeof navPillVariants>, "tone"> & { tone: Tone }) {
	return navPillVariants({ tone, ...props });
}
