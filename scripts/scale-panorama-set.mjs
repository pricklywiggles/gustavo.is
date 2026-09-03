// Uniform scale from the masters keeps work-history-data.ts's layer percentages valid.
import { mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { sharp } from "./sharp.mjs";

const [mastersDir, outDir, scaleArg] = process.argv.slice(2);
if (!mastersDir || !outDir || !scaleArg) {
	console.error(
		"usage: scale-panorama-set.mjs <masters-dir> <out-dir> <scale>",
	);
	process.exit(1);
}
const scale = scaleArg.includes("/")
	? Number(scaleArg.split("/")[0]) / Number(scaleArg.split("/")[1])
	: Number(scaleArg);
if (!(scale > 0 && scale <= 1))
	throw new Error(`scale must be in (0, 1]: ${scaleArg}`);

// The layer box is CSS width times the natural ratio, so pick the rounding pair drifting least.
function bestDimensions(width, height, scale) {
	const ratio = height / width;
	let best;
	for (const w of [Math.floor(width * scale), Math.ceil(width * scale)]) {
		for (const h of [Math.floor(w * ratio), Math.ceil(w * ratio)]) {
			const error = Math.abs(h / w - ratio) / ratio;
			if (!best || error < best.error) best = { w, h, error };
		}
	}
	return best;
}

mkdirSync(outDir, { recursive: true });
const files = readdirSync(mastersDir)
	.filter((f) => f.endsWith(".webp"))
	.sort();

for (const file of files) {
	const src = join(mastersDir, file);
	const out = join(outDir, file);
	const { width, height } = await sharp(src).metadata();
	const { w, h } = bestDimensions(width, height, scale);
	let status = "written";
	try {
		if (statSync(out).mtimeMs > statSync(src).mtimeMs) status = "up to date";
	} catch {
		// statSync throws when the output is missing.
	}
	if (status === "written") {
		await sharp(src)
			.resize({ width: w, height: h, kernel: "lanczos3" })
			.webp({ quality: 82 })
			.toFile(out);
	}
	console.log(
		`${file.padEnd(26)} ${String(width).padStart(5)}x${String(height).padEnd(5)} -> ${String(w).padStart(5)}x${String(h).padEnd(5)} ${status}`,
	);
}
