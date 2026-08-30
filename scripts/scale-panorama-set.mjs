/**
 * Writes a panorama layer set scaled uniformly from its masters, so every sprite keeps
 * its filename, crop extents, and aspect ratio and the layer percentages in
 * work-history-data.ts stay valid. Never upscales; skips up-to-date outputs.
 *   node scripts/scale-panorama-set.mjs <masters-dir> <out-dir> <scale>
 *   node scripts/scale-panorama-set.mjs assets/panorama-masters/los-angeles public/los-angeles-panorama 1/3
 */
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

// Integer pixels cannot keep the master's aspect ratio exactly; the layer box is CSS width
// times the natural ratio, so pick the rounding pair whose ratio drifts least.
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
		// statSync throws when the output is missing; fall through and write it.
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
