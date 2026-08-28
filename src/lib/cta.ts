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

/** DESIGN.md's CTA archetype (44px, rounded-lg, press physics); color classes stay
 * with the call site. `tone` is required: cva can't demand a variant, and an omitted
 * tone would render no ring at all. */
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

/** The bar/footer pill archetype (rounded-full nav links and icon buttons); color and
 * hover classes come from the call site's bar theme, whose `tone` is passed through. */
export function navPill({
	tone,
	...props
}: Omit<VariantProps<typeof navPillVariants>, "tone"> & { tone: Tone }) {
	return navPillVariants({ tone, ...props });
}
