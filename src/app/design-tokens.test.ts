import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { RAMP_HEX, RAMP_OKLCH, rampColor, rampHex } from "@/lib/ramp";
import { PALETTE } from "../../.storybook/design/palette-data";

// globals.css @theme is the source of truth; DESIGN.md and ramp.ts must match it verbatim.

const globals = readFileSync("src/app/globals.css", "utf8");
const design = readFileSync("DESIGN.md", "utf8");

function themeColors(css: string): Map<string, string> {
	// Only the first plain `@theme {` block; `@theme static`/`inline` hold no palette tokens.
	const block = css.match(/@theme \{([\s\S]*?)\n\}/)?.[1] ?? "";
	const map = new Map<string, string>();
	for (const m of block.matchAll(/--color-([a-z0-9-]+):\s*([^;]+);/g)) {
		map.set(m[1], m[2].trim());
	}
	return map;
}

function designColors(md: string): Map<string, string> {
	const front = md.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
	const map = new Map<string, string>();
	for (const m of front.matchAll(
		/^ {2}([a-z][a-z0-9-]*): "(oklch\([^)]+\))"$/gm,
	)) {
		map.set(m[1], m[2]);
	}
	return map;
}

const source = themeColors(globals);

describe("palette token sync", () => {
	it("globals.css declares tokens", () => {
		expect(source.size).toBeGreaterThan(0);
	});

	it("the Storybook palette page describes every token, both directions", () => {
		const described = new Set(PALETTE.map((t) => t.slug));
		for (const slug of source.keys()) {
			expect(
				described.has(slug as keyof typeof RAMP_OKLCH),
				`--color-${slug} has no entry in .storybook/design/palette-data.ts`,
			).toBe(true);
		}
		for (const slug of described) {
			expect(
				source.has(slug),
				`palette-data.ts describes --color-${slug}, which globals.css no longer declares`,
			).toBe(true);
		}
	});

	it("DESIGN.md front matter matches globals.css verbatim, both directions", () => {
		const documented = designColors(design);
		for (const [slug, value] of source) {
			expect(
				documented.get(slug),
				`${slug} missing or stale in DESIGN.md front matter`,
			).toBe(value);
		}
		for (const slug of documented.keys()) {
			expect(
				source.has(slug),
				`DESIGN.md documents ${slug}, which globals.css no longer declares`,
			).toBe(true);
		}
	});

	it("src/lib/ramp.ts matches globals.css verbatim, both directions", () => {
		for (const [slug, value] of source) {
			expect(
				slug in RAMP_OKLCH && rampColor(slug as keyof typeof RAMP_OKLCH),
				`--color-${slug} missing or stale in src/lib/ramp.ts`,
			).toBe(value);
		}
		for (const slug of Object.keys(RAMP_OKLCH)) {
			expect(
				source.has(slug),
				`ramp.ts declares ${slug}, which globals.css no longer declares`,
			).toBe(true);
		}
	});

	it("every RAMP_HEX twin is its token's exact sRGB projection", () => {
		for (const [slug, hex] of Object.entries(RAMP_HEX)) {
			const token = source.get(slug);
			expect(
				token,
				`RAMP_HEX documents ${slug}, which globals.css no longer declares`,
			).toBeDefined();
			// A variant rampHex() can't parse must fail naming the slug, not project from NaN.
			expect(
				token,
				`--color-${slug} (${token}) is not in the bare oklch(L C H) number form rampHex() parses`,
			).toMatch(OKLCH_FORM);
			expect(
				rampHex(slug as keyof typeof RAMP_HEX),
				`RAMP_HEX["${slug}"] no longer projects from ${token}`,
			).toBe(hex);
		}
	});
});

const OKLCH_FORM = /^oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)$/;
