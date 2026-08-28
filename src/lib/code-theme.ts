import { RAMP_HEX } from "./ramp";

type CodeToken = keyof typeof RAMP_HEX;

// Shiki looks colorReplacements keys up lowercased.
const hex = (token: CodeToken) => RAMP_HEX[token].toLowerCase();

function rule(token: CodeToken, scope: string[], fontStyle?: "italic") {
	return {
		scope,
		settings: { foreground: hex(token), ...(fontStyle && { fontStyle }) },
	};
}

const settings = [
	rule("pale-dune", [
		"variable",
		"support.variable",
		"variable.other.property",
		"meta.object-literal.key",
		"meta.property-name",
	]),
	rule("desert-clay", ["comment", "punctuation.definition.comment"], "italic"),
	rule("dune-tan", ["punctuation", "meta.brace", "keyword.operator"]),
	rule("horizon-blaze", [
		"keyword",
		"keyword.control",
		"keyword.operator.new",
		"keyword.operator.expression",
		"storage",
		"storage.type",
		"storage.modifier",
		"markup.deleted",
		"invalid",
	]),
	rule("noon-sun", [
		"string",
		"string.template",
		"punctuation.definition.string",
		"constant.numeric",
		"constant.language",
		"constant.character.escape",
		"markup.inserted",
	]),
	rule("amber-mirage", [
		"entity.name.function",
		"support.function",
		"entity.name.tag",
		"entity.name.command",
	]),
	rule("first-light", [
		"entity.name.type",
		"entity.name.class",
		"support.type",
		"support.type.primitive",
		"support.class",
		"entity.other.attribute-name",
	]),
];

const painted: CodeToken[] = [
	"dusk-ink",
	"pale-dune",
	"desert-clay",
	"dune-tan",
	"horizon-blaze",
	"noon-sun",
	"amber-mirage",
	"first-light",
];

// Ramp-built so every token clears AA on the Dusk Ink code surface.
export const codeTheme = {
	name: "desert-ramp",
	type: "dark" as const,
	colors: {
		"editor.background": hex("dusk-ink"),
		"editor.foreground": hex("pale-dune"),
	},
	settings,
	colorReplacements: Object.fromEntries(
		painted.map((token) => [hex(token), `var(--color-${token})`]),
	),
};
