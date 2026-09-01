import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { describe, expect, it, vi } from "vitest";
import {
	attachCloudSway,
	attachVessels,
	buildYearCues,
	vesselSailStartPct,
} from "./panorama-phases";
import { CHAPTERS } from "./work-history-data";

gsap.registerPlugin(ScrollTrigger);

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

describe("attachCloudSway", () => {
	it("creates each sway paused at its seed; resume and pause keep the phase", () => {
		const seattle = CHAPTERS[0].panorama;
		const stage = document.createElement("div");
		for (const _ of seattle.layers.filter((l) => l.ambient)) {
			const el = document.createElement("div");
			el.setAttribute("data-pano-sway", "");
			stage.append(el);
		}
		const controls = attachCloudSway(stage, seattle);
		const tweens = [...stage.querySelectorAll("[data-pano-sway]")].flatMap(
			(el) => gsap.getTweensOf(el),
		);
		try {
			expect(tweens.length).toBeGreaterThan(0);
			tweens.forEach((tween, i) => {
				expect(tween.paused()).toBe(true);
				expect(tween.progress()).toBeCloseTo((0.17 + i * 0.37) % 1, 10);
			});
			const seeds = tweens.map((tween) => tween.progress());
			controls.resume();
			tweens.forEach((tween, i) => {
				expect(tween.paused()).toBe(false);
				expect(tween.progress()).toBeCloseTo(seeds[i], 10);
			});
			controls.pause();
			tweens.forEach((tween, i) => {
				expect(tween.paused()).toBe(true);
				expect(tween.progress()).toBeCloseTo(seeds[i], 10);
			});
		} finally {
			for (const tween of tweens) tween.kill();
		}
	});
});

describe("attachVessels", () => {
	it("resumes only cast-off sails; a cue enter then window leave ends paused", () => {
		const seattle = CHAPTERS[0].panorama;
		const stage = document.createElement("div");
		for (const _ of seattle.layers) {
			const el = document.createElement("div");
			el.setAttribute("data-pano-layer", "");
			stage.append(el);
		}
		const sails: gsap.core.Timeline[] = [];
		const spy = vi.spyOn(gsap, "timeline").mockImplementation((vars) => {
			const tl = new gsap.core.Timeline(vars);
			sails.push(tl);
			return tl;
		});
		const baseline = ScrollTrigger.getAll().length;
		const controls = attachVessels({
			stage,
			config: seattle,
			cueScrollY: () => () => 5000,
		});
		spy.mockRestore();
		const cues = ScrollTrigger.getAll().slice(baseline);
		try {
			expect(sails).toHaveLength(1);
			const sail = sails[0];
			expect(sail.paused()).toBe(true);
			// The window opens at the cascade, before the cue: no early sailing.
			controls.resume();
			expect(sail.paused()).toBe(true);
			cues[0].vars.onEnter?.(cues[0]);
			expect(sail.paused()).toBe(false);
			controls.pause();
			expect(sail.paused()).toBe(true);
			const progress = sail.progress();
			controls.resume();
			expect(sail.paused()).toBe(false);
			expect(sail.progress()).toBe(progress);
			// One-frame skip past the chapter: cue onEnter, then the window's leave.
			controls.pause();
			expect(sail.paused()).toBe(true);
			// Scroll-back below the cue rescinds cast-off: resume must not replay the sail.
			cues[0].vars.onLeaveBack?.(cues[0]);
			controls.resume();
			expect(sail.paused()).toBe(true);
		} finally {
			controls.cleanup();
			for (const cue of cues) cue.kill();
			for (const sail of sails) sail.kill();
			for (const el of stage.querySelectorAll("[data-pano-layer]")) {
				for (const tween of gsap.getTweensOf(el)) tween.kill();
			}
		}
	});
});
