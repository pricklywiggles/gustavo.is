import gsap from "gsap";
import { describe, expect, it } from "vitest";
import { buildYearCues, vesselSailStartPct } from "./panorama-phases";
import { CHAPTERS } from "./work-history-data";

// 390x844 portrait: stage 1266 wide. Centered puts its left edge at -438;
// Seattle's 0.3 focus shifts it to -253 (clamped calc), SF's 0.38 to -286.
const VESSEL = { fromSide: "right", leftPct: 26, widthPct: 31.5 } as const;

const enterXpx = (pct: number, geo: { stageWidth: number }) => {
	const spriteWidth = (VESSEL.widthPct / 100) * geo.stageWidth;
	const restX = (VESSEL.leftPct / 100) * geo.stageWidth;
	return restX + (pct / 100) * spriteWidth;
};

describe("vesselSailStartPct", () => {
	it("matches the old centered formula when the stage is centered", () => {
		const geo = { stageWidth: 1266, stageLeft: -438, viewportWidth: 390 };
		const oldEnterX = (1266 + 390) / 2 - 390 * 0.05;
		expect(enterXpx(vesselSailStartPct(geo, VESSEL), geo)).toBeCloseTo(
			oldEnterX,
			6,
		);
	});

	it("keeps a right-entering bow at the real viewport edge on a shifted stage", () => {
		const geo = { stageWidth: 1266, stageLeft: -253, viewportWidth: 390 };
		const enterX = enterXpx(vesselSailStartPct(geo, VESSEL), geo);
		// Bow (left edge) sits 5% of the viewport inside the right screen edge.
		expect(enterX + geo.stageLeft).toBeCloseTo(390 * 0.95, 6);
	});

	it("keeps a left-entering stern at the real viewport edge on a shifted stage", () => {
		const vessel = { fromSide: "left", leftPct: 60, widthPct: 20 } as const;
		const geo = { stageWidth: 1266, stageLeft: -286, viewportWidth: 390 };
		const pct = vesselSailStartPct(geo, vessel);
		const spriteWidth = (vessel.widthPct / 100) * geo.stageWidth;
		const enterX =
			(vessel.leftPct / 100) * geo.stageWidth + (pct / 100) * spriteWidth;
		// Stern (right edge) sits 5% of the viewport inside the left screen edge.
		expect(enterX + spriteWidth + geo.stageLeft).toBeCloseTo(390 * 0.05, 6);
	});
});

describe("buildYearCues", () => {
	it("places the Salesforce Tower's rise at its cued year's scrub position", () => {
		const sf = CHAPTERS[1];
		const stage = document.createElement("div");
		for (const _ of sf.panorama.layers) {
			const el = document.createElement("div");
			el.setAttribute("data-pano-layer", "");
			stage.append(el);
		}
		const tl = gsap.timeline({ paused: true });
		const scrubAt = 10;
		buildYearCues(
			tl,
			{ at: scrubAt, vhPerYear: 0.5, spanStart: sf.span[0] },
			stage,
			sf.panorama,
		);

		const cued = sf.panorama.layers.filter((l) => l.yearCue !== undefined);
		expect(cued.map((l) => l.yearCue)).toEqual([2015]);
		// Two tweens per cued layer (rise + fade), both parked at the cue:
		// 2015 sits (2015 - 2005) * 0.5vh = 5vh into the scrub.
		const starts = tl.getChildren().map((t) => t.startTime());
		expect(starts).toEqual([15, 15]);
		tl.kill();
	});
});
