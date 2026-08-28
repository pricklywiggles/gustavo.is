import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import type { PanoramaConfig } from "../work-history-data";
import { PanoramaScene, panoFocusLeft } from "./panorama-scene";

const CONFIG: PanoramaConfig = {
	aspect: "3 / 2",
	durVh: 0.5,
	stepVh: 0.2,
	lastStep: 1,
	mobileFocusX: 0.38,
	sun: {
		left: 60,
		top: 20,
		size: 10,
		endLeft: 40,
		endTop: 60,
		endScale: 3,
		mobile: { left: 42 },
	},
	layers: [
		{
			src: "/a.webp",
			style: { left: "10%", top: "20%", width: "30%" },
			mobile: { left: "40%" },
			step: 0,
		},
		{ src: "/b.webp", style: { left: "1%", top: "2%" }, step: 1 },
	],
};

const renderScene = () =>
	render(
		<PanoramaScene config={CONFIG} stageRef={createRef<HTMLDivElement>()} />,
	).container;

/** JS mirror of the CSS clamp, for numeric spot checks. */
const clampedLeft = (focusX: number, vw: number, vh: number) => {
	const stageW = Math.max(vw, 1.5 * vh);
	return Math.min(0, Math.max(vw - stageW, vw / 2 - focusX * stageW));
};

describe("panoFocusLeft", () => {
	it("emits the clamped, pre-multiplied expression", () => {
		expect(panoFocusLeft(0.38)).toBe(
			"clamp(calc(100% - var(--pano-w)), calc(50% - max(38vw, 57vh)), 0px)",
		);
	});

	it("recenters portrait phones and degrades to edge-flush when slack runs out", () => {
		// 390x844 portrait: desired shift fits inside the coverage slack.
		expect(clampedLeft(0.38, 390, 844)).toBeCloseTo(-286.08, 1);
		// 568x320 landscape: stage width equals the viewport, so a left bias
		// pins to the edge instead of exposing canvas.
		expect(clampedLeft(0.3, 568, 320)).toBe(0);
		// Centered focus never moves regardless of regime.
		expect(clampedLeft(0.5, 568, 320)).toBe(0);
	});
});

describe("PanoramaScene reduced motion", () => {
	it("becomes one in-flow screen, never hidden", () => {
		const root = renderScene().firstElementChild;
		expect(root?.className).toContain(
			"motion-reduce:relative motion-reduce:h-screen",
		);
		expect(root?.className).not.toContain("motion-reduce:hidden");
	});
});

describe("PanoramaScene mobile placement", () => {
	it("renders var-backed placement for layers carrying mobile, falling back per axis", () => {
		const a = renderScene().querySelector<HTMLElement>('img[src="/a.webp"]');
		expect(a?.className).toContain("max-sm:left-(--mp-lm)");
		expect(a?.style.getPropertyValue("--mp-l")).toBe("10%");
		expect(a?.style.getPropertyValue("--mp-lm")).toBe("40%");
		expect(a?.style.getPropertyValue("--mp-tm")).toBe("20%");
		expect(a?.style.left).toBe("");
	});

	it("leaves layers without mobile on plain inline placement", () => {
		const b = renderScene().querySelector<HTMLElement>('img[src="/b.webp"]');
		expect(b?.style.left).toBe("1%");
		expect(b?.style.getPropertyValue("--mp-l")).toBe("");
		expect(b?.className).not.toContain("--mp-lm");
	});

	it("gives the stage the clamped focus offset and single width source", () => {
		const stage = renderScene().querySelector<HTMLElement>(
			'[style*="--pano-w"]',
		);
		expect(stage?.style.getPropertyValue("--pano-w")).toBe("max(100vw, 150vh)");
		// Additive-only halved pair, generated from the same constants as
		// --pano-w so the two cannot drift.
		expect(stage?.style.getPropertyValue("--pano-left-base")).toBe(
			"calc(50% - max(50vw, 75vh))",
		);
		expect(stage?.style.getPropertyValue("--pano-left")).toBe(
			panoFocusLeft(0.38),
		);
		expect(stage?.style.width).toBe("var(--pano-w)");
		expect(stage?.className).toContain("left-(--pano-left-base)");
		expect(stage?.className).toContain("max-sm:left-(--pano-left)");
	});

	it("wires the sun's mobile knob through the same vars, box math included", () => {
		const track = renderScene().querySelector<HTMLElement>(
			"[data-pano-sun-track]",
		);
		// Desktop box: left 60 - 10/2 = 55%; mobile: 42 - 10/2 = 37%.
		expect(track?.style.getPropertyValue("--mp-l")).toBe("55%");
		expect(track?.style.getPropertyValue("--mp-lm")).toBe("37%");
		// top falls back to the desktop-derived box when mobile omits it.
		expect(track?.style.getPropertyValue("--mp-tm")).toBe(
			track?.style.getPropertyValue("--mp-t"),
		);
		expect(track?.className).toContain("max-sm:left-(--mp-lm)");
	});
});
