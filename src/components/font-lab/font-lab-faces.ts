import { kitora, wotfard } from "@/app/fonts";

// Dev-only import: next/font emits CSS for everything in the module graph, so layout.tsx gates it.

// To audition: declare a face here from src/fonts/try/ (gitignored) with next/font/local,
// weight "100 900" so font-bold renders as drawn, preload: false. Trial licenses stay off main.

/** `id` doubles as the face's CSS variable: `var(--font-<id>)`. */
export const FACES = [
	{ id: "wotfard", label: "Wotfard", className: wotfard.variable },
	{ id: "kitora", label: "Kitora", className: kitora.variable },
] as const;

export type FaceId = (typeof FACES)[number]["id"];

/** layout.tsx puts these on <html> in dev; empty until a trial face is declared. */
export const labFaceVariables = "";
