import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { textLink } from "@/lib/link";

// The recipe's classes are plain CSS in globals.css, so nothing type-checks the link
// between the two; a rename on either side silently hands the anchors back to the
// typography plugin's underline.
const globals = readFileSync("src/app/globals.css", "utf8");

describe("textLink", () => {
	for (const tone of ["dark", "light"] as const) {
		it(`emits classes that globals.css defines for the ${tone} tone`, () => {
			const classes = textLink({ tone }).split(" ");
			expect(classes).toContain("site-link");
			expect(classes).toContain(`site-link-${tone}`);
			for (const cls of classes) {
				expect(globals).toMatch(new RegExp(`^\\.${cls} \\{`, "m"));
			}
			// The swipe is the only focus indicator; the recipe sets no ring.
			expect(globals).toContain(`.site-link-${tone}:focus-visible {`);
		});
	}
});
