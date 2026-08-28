import { describe, expect, it } from "vitest";
import { codeTheme } from "./code-theme";

const AA_BODY_TEXT = 4.5;

function luminance(hex: string): number {
	const n = Number.parseInt(hex.slice(1), 16);
	const channel = (byte: number) => {
		const c = byte / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	};
	return (
		0.2126 * channel((n >> 16) & 0xff) +
		0.7152 * channel((n >> 8) & 0xff) +
		0.0722 * channel(n & 0xff)
	);
}

function contrast(a: string, b: string): number {
	const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
	return (hi + 0.05) / (lo + 0.05);
}

const surface = codeTheme.colors["editor.background"];

describe("desert-ramp code theme", () => {
	it("keeps the editor foreground at AA on the code surface", () => {
		expect(
			contrast(codeTheme.colors["editor.foreground"], surface),
		).toBeGreaterThanOrEqual(AA_BODY_TEXT);
	});

	it("keeps every token foreground at AA on the code surface", () => {
		expect(codeTheme.settings.length).toBeGreaterThan(0);
		for (const { scope, settings } of codeTheme.settings) {
			expect(
				contrast(settings.foreground, surface),
				`${scope.join(", ")} at ${settings.foreground}`,
			).toBeGreaterThanOrEqual(AA_BODY_TEXT);
		}
	});

	it("maps every color it paints to a CSS token, keyed the way shiki looks them up", () => {
		const replacements = codeTheme.colorReplacements;
		const painted = new Set([
			surface,
			codeTheme.colors["editor.foreground"],
			...codeTheme.settings.map((rule) => rule.settings.foreground),
		]);
		for (const color of painted) {
			expect(color).toBe(color.toLowerCase());
			expect(replacements[color], `${color} has no CSS token`).toMatch(
				/^var\(--color-[a-z-]+\)$/,
			);
		}
	});
});
