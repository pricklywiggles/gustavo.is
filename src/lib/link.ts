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

/** The site's one text-link recipe; the look lives unlayered in globals.css (`.site-link*`)
 * so the typography plugin's underline can't resurface. `tone` names the ground. */
export function textLink({
	tone,
}: Omit<VariantProps<typeof textLinkVariants>, "tone"> & { tone: Tone }) {
	return textLinkVariants({ tone });
}
