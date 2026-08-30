import { readdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join } from "node:path";

// sharp is a transitive dependency (Next's image pipeline): resolve it out of the pnpm
// store instead of adding a root dep for dev-only scripts.
const require = createRequire(import.meta.url);
const sharpDir = readdirSync("node_modules/.pnpm").find((d) =>
	/^sharp@/.test(d),
);
if (!sharpDir) throw new Error("sharp not found in the pnpm store");

export const sharp = require(
	join(process.cwd(), "node_modules/.pnpm", sharpDir, "node_modules/sharp"),
);
