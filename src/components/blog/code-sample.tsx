import { codeTheme } from "@/lib/code-theme";

/** Storybook has no Shiki, so story samples are hand-tokenized and painted from codeTheme. */
export type Token = [text: string, scope?: string];

function paint(scope?: string) {
	if (!scope) return undefined;
	const rule = codeTheme.settings.find((r) => r.scope.includes(scope));
	const hex = rule?.settings.foreground;
	if (!hex) return undefined;
	return {
		color: codeTheme.colorReplacements[hex] ?? hex,
		fontStyle: rule.settings.fontStyle === "italic" ? "italic" : undefined,
	} as const;
}

export function CodeSample({ lines }: { lines: Token[][] }) {
	return (
		<code style={{ color: codeTheme.colors["editor.foreground"] }}>
			{lines.map((line, i) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: fixed, never reordered
				<span key={i} className="block min-h-[1.7em]">
					{line.map(([text, scope], j) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: fixed, never reordered
						<span key={j} style={paint(scope)}>
							{text}
						</span>
					))}
				</span>
			))}
		</code>
	);
}

export const TS_SAMPLE: Token[][] = [
	[["// The token as a CSS color string.", "comment"]],
	[
		["export ", "keyword"],
		["function ", "keyword"],
		["rampColor", "entity.name.function"],
		["(", "punctuation"],
		["token", "variable"],
		[": ", "punctuation"],
		["RampToken", "entity.name.type"],
		[")", "punctuation"],
		[": ", "punctuation"],
		["string", "support.type.primitive"],
		[" {", "punctuation"],
	],
	[
		["  return ", "keyword"],
		["`oklch(${", "string"],
		["RAMP_OKLCH", "variable"],
		["[", "punctuation"],
		["token", "variable"],
		["]", "punctuation"],
		["})`", "string"],
		[";", "punctuation"],
	],
	[["}", "punctuation"]],
];

export const CSS_SAMPLE: Token[][] = [
	[["/* The One Ramp: every surface colour lives here. */", "comment"]],
	[
		["@theme", "keyword"],
		[" {", "punctuation"],
	],
	[
		["  --color-dusk-earth", "variable.other.property"],
		[": ", "punctuation"],
		["oklch(0.4572 0.0543 59.52)", "string"],
		[";", "punctuation"],
	],
	[["}", "punctuation"]],
];
