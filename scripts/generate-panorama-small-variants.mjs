import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { sharp } from "./sharp.mjs";

const DIR = "public/los-angeles-panorama-small";
const MIN_NATIVE = 1200;
const FRACTIONS = [0.25, 0.5];

const files = readdirSync(DIR).filter(
	(f) => f.endsWith(".webp") && !/\.w\d+\.webp$/.test(f),
);

const rows = [];
for (const file of files) {
	const path = join(DIR, file);
	const { width } = await sharp(path).metadata();
	if (!width || width < MIN_NATIVE) {
		rows.push({ file, native: width, variants: [] });
		continue;
	}
	const variants = [];
	for (const fraction of FRACTIONS) {
		const w = Math.round(width * fraction);
		const out = join(DIR, file.replace(/\.webp$/, `.w${w}.webp`));
		variants.push(w);
		try {
			const src = statSync(path).mtimeMs;
			if (statSync(out).mtimeMs > src) continue;
		} catch {
			// statSync throws when the variant is missing.
		}
		await sharp(path)
			.resize({ width: w, kernel: "lanczos3" })
			.webp({ quality: 82 })
			.toFile(out);
	}
	rows.push({ file, native: width, variants });
}

console.log("srcWidths per layer (paste into blog-panorama-data.ts):");
for (const { file, native, variants } of rows) {
	console.log(
		`${file.padEnd(26)} native ${String(native).padStart(5)}  variants [${variants.join(", ")}]`,
	);
}
