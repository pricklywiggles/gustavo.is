// @vitest-environment node
import { readdirSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { sharp } from "../../../scripts/sharp.mjs";
import { PANORAMA_DIMENSIONS } from "./panorama-dimensions";

// The manifest is generated (scripts/panorama-dimensions.mjs); this pins it to the assets
// so a re-trimmed or re-scaled layer cannot silently skew the pacing math.
describe("panorama dimension manifest", () => {
	it("matches every panorama asset under public/", async () => {
		const files: string[] = [];
		for (const city of ["seattle", "san-francisco", "los-angeles"]) {
			for (const file of readdirSync(`public/${city}-panorama`)) {
				if (file.endsWith(".webp")) files.push(`/${city}-panorama/${file}`);
			}
		}
		expect(Object.keys(PANORAMA_DIMENSIONS).sort()).toEqual(files.sort());
		for (const src of files) {
			const { width, height } = await sharp(`public${src}`).metadata();
			expect(PANORAMA_DIMENSIONS[src], src).toEqual({ w: width, h: height });
		}
	});
});
