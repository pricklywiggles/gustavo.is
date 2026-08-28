import { kitora, wotfard } from "@/app/fonts";

// Imported only from dev builds (layout.tsx gates on NODE_ENV): next/font emits CSS for
// whatever the module graph includes, so the gate must live at the import.
//
// To audition a face locally: put the file under src/fonts/try/ (gitignored), declare it
// here with next/font/local (a single-weight cut wants weight "100 900" so font-bold
// renders as drawn, plus preload: false), append it to FACES with className: face.variable,
// and add face.variable to labFaceVariables. Keep the branch off main; trial licenses do
// not cover redistribution.

/**
 * Every face the lab can assign. `id` is also the face's CSS variable:
 * `var(--font-<id>)`.
 */
export const FACES = [
	{ id: "wotfard", label: "Wotfard", className: wotfard.variable },
	{ id: "kitora", label: "Kitora", className: kitora.variable },
] as const;

export type FaceId = (typeof FACES)[number]["id"];

/** Candidate faces' CSS variables; layout puts them on <html> in dev. */
export const labFaceVariables = "";
