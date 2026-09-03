import { describe, expect, it } from "vitest";
import { type Box, dockPose, heroPose } from "./year-pose";

const box = (
	left: number,
	top: number,
	width: number,
	height: number,
): Box => ({
	left,
	top,
	width,
	height,
	right: left + width,
});

// The 37vw string at 1440x900: right edge on the slot, 1235 wide, 533 tall.
const hero = box(157, 32, 1235, 533);
const host = box(0, 0, 1440, 900);

describe("heroPose", () => {
	it("fills the target width, centered on the host, about the top-right anchor", () => {
		const p = heroPose(hero, host, 0.85);
		expect(p.scale).toBeCloseTo(1224 / 1235, 6);
		expect(hero.right + p.x - (hero.width * p.scale) / 2).toBeCloseTo(720, 6);
		expect(hero.top + p.y + (hero.height * p.scale) / 2).toBeCloseTo(450, 6);
	});

	it("never scales up: a narrow string stays at 1 and just centers", () => {
		const narrow = box(392, 32, 1000, 430);
		const p = heroPose(narrow, host, 0.85);
		expect(p.scale).toBe(1);
		expect(narrow.right + p.x - narrow.width / 2).toBeCloseTo(720, 6);
	});
});

describe("dockPose", () => {
	// Measured at 1440x900: a 48.96px dock font puts the 1em line box 0.15em (7.34px) down.
	it("lands the string's line box on the odometer's centered line box", () => {
		const number = box(1278.5, 32, 113.5, 63.64);
		const p = dockPose(hero, number, 532.8, 48.96);
		expect(p.scale).toBeCloseTo(48.96 / 532.8, 6);
		expect(p.x).toBeCloseTo(0, 6);
		expect(p.y).toBeCloseTo(7.34, 2);
	});

	it("moves the transformed string onto a box with a different right edge", () => {
		const number = box(1200, 40, 113.5, 63.64);
		const p = dockPose(hero, number, 532.8, 48.96);
		expect(hero.right + p.x).toBeCloseTo(number.right, 6);
		expect(hero.top + p.y).toBeCloseTo(number.top + (63.64 - 48.96) / 2, 6);
		expect(hero.width * p.scale).toBeCloseTo(113.49, 2);
	});
});
