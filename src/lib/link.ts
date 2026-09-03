import { cva, type VariantProps } from "class-variance-authority";
import type { Tone } from "./focus-ring";

const textLinkVariants = cva("site-link", {
	variants: {
		tone: {
			dark: "site-link-dark",
			light: "site-link-light",
		},
	},
});

/** `.site-link*` is unlayered in globals.css: the typography plugin would otherwise win. */
export function textLink({
	tone,
}: Omit<VariantProps<typeof textLinkVariants>, "tone"> & { tone: Tone }) {
	return textLinkVariants({ tone });
}
