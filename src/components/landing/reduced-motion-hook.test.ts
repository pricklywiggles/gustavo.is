import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

// useReducedMotion is true on a reduced client's first render (landing README, reduced motion).
// A hydration test cannot catch it: jsdom's window is present on the "server" pass too.
const GUARDED = ["src/components/landing", "src/components/contact-dialog"];
const SNAPSHOT_IMPORT =
	/import\s*{[^}]*\buseReducedMotion\b[^}]*}\s*from\s*"motion\/react"/;

const sourcesUnder = (dir: string) =>
	readdirSync(dir, { recursive: true, withFileTypes: true })
		.filter(
			(entry) =>
				entry.isFile() &&
				/\.tsx?$/.test(entry.name) &&
				!/\.(test|stories)\.tsx?$/.test(entry.name),
		)
		.map((entry) => path.join(entry.parentPath, entry.name));

describe("reduced-motion hook rule", () => {
	it("keeps Motion's snapshot hook off the landing path", () => {
		const offenders = GUARDED.flatMap(sourcesUnder).filter((file) =>
			SNAPSHOT_IMPORT.test(readFileSync(file, "utf8")),
		);
		expect(offenders).toEqual([]);
	});
});
