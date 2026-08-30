import { describe, expect, it } from "vitest";
import { PANORAMA_DIMENSIONS } from "./panorama-dimensions";
import { projectsScrubVh } from "./projects-geometry";
import {
	BUDGET_VIEWPORTS,
	budgetViolations,
	buildSpans,
	exitWindows,
	PACING_BUDGET,
	showcaseSpan,
	speedMap,
} from "./scroll-speed-map";
import { EXIT_SETTLE_VH } from "./story-phases";
import { CHAPTERS } from "./work-history-data";

const viewports = Object.entries(BUDGET_VIEWPORTS);

describe("scroll speed map (FRA-187)", () => {
	it("has a manifest entry for every panorama layer", () => {
		for (const chapter of CHAPTERS) {
			for (const layer of chapter.panorama.layers) {
				expect(PANORAMA_DIMENSIONS[layer.src], layer.src).toBeDefined();
			}
		}
	});

	// FRA-190: buildSceneExit unwinds vessel breath too; the map rated only the posed layers.
	it.each(
		viewports,
	)("unwinds every drift vessel's breath in the scene exit at %s", (_name, viewport) => {
		const rows = speedMap(viewport);
		let vessels = 0;
		CHAPTERS.slice(0, -1).forEach((chapter, i) => {
			for (const layer of chapter.panorama.layers) {
				if (!layer.drift || !layer.parallax) continue;
				vessels++;
				const target = `${chapter.id}/${layer.src.split("/").pop()}`;
				const row = rows.find(
					(row) => row.phase === `scene-out@${i}` && row.target === target,
				);
				expect(row, target).toBeDefined();
				expect(row?.travelVh, target).toBeGreaterThan(0);
				expect(row?.meanRatio, target).toBeLessThanOrEqual(
					PACING_BUDGET.large.mean,
				);
				// Drift layers get the settle floor and buildSceneExit's ease, not a stretch.
				expect(row?.spanVh, target).toBe(EXIT_SETTLE_VH);
				expect(row?.ease, target).toBe("power1.in");
			}
		});
		expect(vessels).toBe(3);
	});

	it("spans the projects showcase by its per-project scrub, not its box", () => {
		const showcase = speedMap(BUDGET_VIEWPORTS.desktop).find(
			(row) => row.section === "projects" && row.phase === "showcase",
		);
		expect(showcase?.spanVh).toBe(projectsScrubVh());
		expect(showcase?.travelVh).toBeNull();
	});

	// FRA-189: a hard flick travels about 3.2 phone viewports; at one viewport per
	// project it skipped about three. Two viewports caps the skip at one project.
	it("paces each showcase project as a must-see beat on the phone", () => {
		const beat = showcaseSpan(BUDGET_VIEWPORTS.phone);
		expect(beat.spanVh).toBeGreaterThanOrEqual(2);
		expect(beat.flicks).toBeGreaterThanOrEqual(0.6);
		const showcase = speedMap(BUDGET_VIEWPORTS.phone).find(
			(row) => row.section === "projects" && row.phase === "showcase",
		);
		expect(showcase?.spanVh).toBe(projectsScrubVh());
	});

	it.each(
		viewports,
	)("keeps every large and small tween inside the budget at %s", (_name, viewport) => {
		const offenders = budgetViolations(speedMap(viewport)).map(
			(row) =>
				`${row.phase} ${row.target}: ${row.meanRatio?.toFixed(2)}x mean, ${row.peakRatio?.toFixed(2)}x peak`,
		);
		expect(offenders).toEqual([]);
	});

	// A hard phone flick is about 2,700px; a city that fits inside one is skipped whole.
	it("gives every city's build more than one hard flick on the phone", () => {
		for (const build of buildSpans(BUDGET_VIEWPORTS.phone)) {
			expect(build.flicks, build.chapter).toBeGreaterThanOrEqual(1);
		}
	});

	it("ends every chapter's exit inside SCENE_OUT_VH", () => {
		for (const window of exitWindows()) {
			expect(window.endVh, window.chapter).toBeLessThanOrEqual(window.lenVh);
		}
	});

	it.each(
		viewports,
	)("streams the cloud deck under scroll speed, later slots faster, at %s", (_name, viewport) => {
		const clouds = speedMap(viewport)
			.filter((row) => row.section === "landfall" && row.phase === "clouds")
			.sort((a, b) => b.spanVh - a.spanVh);
		expect(clouds).toHaveLength(6);
		let last = 0;
		for (const cloud of clouds) {
			expect(cloud.meanRatio, cloud.target).toBeLessThanOrEqual(
				PACING_BUDGET.large.mean,
			);
			expect(cloud.meanRatio, cloud.target).toBeGreaterThan(last);
			last = cloud.meanRatio ?? 0;
		}
	});

	// The known fast rows: the hole's reveal curve and the towers' authored pop. Anything
	// else above 2x mean is a regression the budget classes would otherwise miss.
	it.each(
		viewports,
	)("leaves only reveals and cascade entrances above 2x mean at %s", (_name, viewport) => {
		const fast = speedMap(viewport).filter((row) => (row.meanRatio ?? 0) > 2);
		expect(fast.length).toBeGreaterThan(0);
		for (const row of fast) {
			expect(["reveal", "entrance"], `${row.phase} ${row.target}`).toContain(
				row.class,
			);
		}
	});
});
