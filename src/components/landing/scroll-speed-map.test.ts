import { describe, expect, it } from "vitest";
import { PANORAMA_DIMENSIONS } from "./panorama-dimensions";
import {
	BUDGET_VIEWPORTS,
	budgetViolations,
	exitWindows,
	PACING_BUDGET,
	speedMap,
} from "./scroll-speed-map";
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

	it.each(
		viewports,
	)("keeps every large and small tween inside the budget at %s", (_name, viewport) => {
		const offenders = budgetViolations(speedMap(viewport)).map(
			(row) =>
				`${row.phase} ${row.target}: ${row.meanRatio?.toFixed(2)}x mean, ${row.peakRatio?.toFixed(2)}x peak`,
		);
		expect(offenders).toEqual([]);
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
