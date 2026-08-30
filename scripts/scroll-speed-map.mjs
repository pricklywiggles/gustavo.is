/**
 * Prints the landing page's scroll pacing per budget viewport: every scrubbed tween's
 * travel over its scroll span, fastest peak first, then the budget offenders and each
 * chapter's exit window. `--json` dumps the rows instead.
 *   node scripts/scroll-speed-map.mjs [--json] [--all]
 * Rows with a mean under 0.5x are folded unless --all is passed.
 */
import { register } from "node:module";

register("./ts-resolve-hook.mjs", import.meta.url);
const {
	BUDGET_VIEWPORTS,
	budgetViolations,
	buildSpans,
	exitWindows,
	speedMap,
} = await import("../src/components/landing/scroll-speed-map.ts");

const json = process.argv.includes("--json");
const all = process.argv.includes("--all");

const fmt = (n) => (n === null ? "-" : n.toFixed(2));
const pad = (s, n) => String(s).padEnd(n);

const output = {};
for (const [name, viewport] of Object.entries(BUDGET_VIEWPORTS)) {
	const rows = speedMap(viewport);
	output[name] = { viewport, rows, violations: budgetViolations(rows) };
	if (json) continue;
	console.log(`\n== ${name} ${viewport.w}x${viewport.h} ==`);
	console.log(
		`${pad("section", 13)}${pad("phase", 30)}${pad("target", 52)}${pad("class", 10)}${pad("travel", 8)}${pad("span", 7)}${pad("flicks", 8)}${pad("s@1.5k", 8)}${pad("s@3k", 7)}${pad("mean", 7)}${pad("peak", 7)}ease`,
	);
	let folded = 0;
	for (const row of rows) {
		if (!all && row.meanRatio !== null && row.meanRatio < 0.5) {
			folded++;
			continue;
		}
		console.log(
			`${pad(row.section, 13)}${pad(row.phase, 30)}${pad(row.target, 52)}${pad(row.class, 10)}${pad(fmt(row.travelVh), 8)}${pad(fmt(row.spanVh), 7)}${pad(fmt(row.flicks), 8)}${pad(row.secondsBrowse.toFixed(1), 8)}${pad(row.secondsSkim.toFixed(1), 7)}${pad(fmt(row.meanRatio), 7)}${pad(fmt(row.peakRatio), 7)}${row.ease}${row.note ? `  (${row.note})` : ""}`,
		);
	}
	if (folded)
		console.log(`... ${folded} rows under 0.5x mean folded (--all shows them)`);
	const offenders = output[name].violations;
	console.log(
		offenders.length
			? `BUDGET OFFENDERS: ${offenders.map((r) => `${r.phase} ${r.target} ${fmt(r.meanRatio)}x/${fmt(r.peakRatio)}x`).join("; ")}`
			: "budget: clean",
	);
}
if (json) {
	console.log(
		JSON.stringify({ ...output, exitWindows: exitWindows() }, null, 1),
	);
} else {
	console.log(
		"\ncity builds on the phone (hard flicks, seconds browsing / skimming):",
	);
	for (const b of buildSpans(BUDGET_VIEWPORTS.phone))
		console.log(
			`  ${b.chapter}: ${fmt(b.spanVh)} vh, ${fmt(b.flicks)} flicks, ${b.secondsBrowse.toFixed(1)}s / ${b.secondsSkim.toFixed(1)}s`,
		);
	console.log("\nexit windows (last layer's end vs SCENE_OUT_VH):");
	for (const w of exitWindows())
		console.log(`  ${w.chapter}: ${fmt(w.endVh)} / ${fmt(w.lenVh)}`);
}
