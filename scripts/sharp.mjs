import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

// sharp is Next's transitive dep; resolved from the pnpm store, not added as a root dep.
const require = createRequire(import.meta.url);
const sharpDir = readdirSync("node_modules/.pnpm").find((d) =>
	/^sharp@/.test(d),
);
if (!sharpDir) throw new Error("sharp not found in the pnpm store");

export const sharp = require(
	join(process.cwd(), "node_modules/.pnpm", sharpDir, "node_modules/sharp"),
);
