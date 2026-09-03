import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { textLink } from "@/lib/link";

// The classes are plain CSS, so a rename silently hands anchors back to the typography underline.
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
