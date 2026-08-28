import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
	BLOG_PANO_INITIAL_VW,
	BLOG_PANO_LAYERS,
	BLOG_PANO_SETTLED_VW,
} from "./blog-panorama-data";

// street-view's natural aspect (4032x1359): its rendered height in vw.
const STREET_VIEW_H_VW = 100 / (4032 / 1359);

const streetView = BLOG_PANO_LAYERS.find((l) =>
	l.src.includes("9-street-view"),
);

describe("blog panorama data", () => {
	it("references only assets that exist (the 3.2 rename trap)", () => {
		for (const { src, srcWidths } of BLOG_PANO_LAYERS) {
			expect(existsSync(join(process.cwd(), "public", src)), src).toBe(true);
			for (const w of srcWidths?.variants ?? []) {
				const variant = src.replace(/\.webp$/, `.w${w}.webp`);
				// Regenerate with scripts/generate-panorama-small-variants.mjs.
				expect(
					existsSync(join(process.cwd(), "public", variant)),
					variant,
				).toBe(true);
			}
		}
	});

	it("keeps street-view's plane as the fastest", () => {
		expect(streetView).toBeDefined();
		for (const layer of BLOG_PANO_LAYERS) {
			expect(layer.dy).toBeLessThanOrEqual(streetView?.dy ?? 0);
		}
	});

	it("glues the kiwi walk to street-view's plane at the bottom edge", () => {
		const kiwi = BLOG_PANO_LAYERS.find((l) => l.src.includes("walking-kiwi"));
		expect(kiwi).toBeDefined();
		expect(kiwi?.dy).toBe(streetView?.dy);
		// Feet flush with the settled container bottom.
		const kiwiH = 8.26;
		expect((kiwi?.top ?? 0) + kiwiH).toBeCloseTo(BLOG_PANO_SETTLED_VW, 1);
	});

	it("covers the hero's bottom edge through the whole entrance", () => {
		if (!streetView) throw new Error("street-view layer missing");
		// Linear blend t: 0 = initial composition, 1 = settled strip. The
		// easing maps onto t, so covering all t covers every eased frame.
		for (let t = 0; t <= 1.001; t += 0.05) {
			const heroH =
				BLOG_PANO_INITIAL_VW +
				(BLOG_PANO_SETTLED_VW - BLOG_PANO_INITIAL_VW) * t;
			const top = streetView.top + streetView.dy * (1 - t);
			expect(top + STREET_VIEW_H_VW).toBeGreaterThanOrEqual(heroH);
		}
	});

	it("moves deeper planes less than nearer ones at the depth anchors", () => {
		const dy = (needle: string) =>
			BLOG_PANO_LAYERS.find((l) => l.src.includes(needle))?.dy ?? Number.NaN;
		expect(dy("1-large-cloud")).toBeLessThan(dy("3-far-hill"));
		expect(dy("3-far-hill")).toBeLessThan(dy("3.5-middle-hill"));
		expect(dy("3.5-middle-hill")).toBeLessThan(dy("4-near-hill"));
		expect(dy("4-near-hill")).toBeLessThan(dy("7-near-city"));
		expect(dy("7-near-city")).toBeLessThan(dy("8-haze"));
		expect(dy("8-haze")).toBeLessThan(dy("9-street-view"));
	});
});
