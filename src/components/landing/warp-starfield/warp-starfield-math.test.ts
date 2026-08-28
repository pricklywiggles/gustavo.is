import { describe, expect, it } from "vitest";
import {
	advance,
	FAR_Z,
	focalFor,
	MAX_SPEED,
	NEAR_Z,
	phaseAt,
	projectAt,
	REST_STAR_COUNT,
	restCapFor,
	seedTo,
	speedAt,
	TEXT_FLIGHT,
	TEXT_LEAD,
	TEXT_STAGGER,
	TEXT_START_Z,
	UFO_ENTRY_START,
	UFO_EXIT_GAP,
	UFO_EXIT_SECONDS,
	ufoPose,
	type Viewport,
	type WarpConfig,
	type WarpSim,
	warpT,
	wordDepth,
	wordProgress,
} from "./warp-starfield-math";

const config: WarpConfig = { starCount: 100, warpDuration: 5 };
const view: Viewport = { width: 800, height: 600, focal: focalFor(800, 600) };

const newSim = (over: Partial<WarpSim> = {}): WarpSim => ({
	elapsed: 0,
	stars: [],
	seeded: 0,
	spawnBudget: 0,
	warpAt: null,
	rest: [],
	restBudget: 0,
	restCap: REST_STAR_COUNT,
	...over,
});

// Deterministic LCG so spawn-heavy assertions are reproducible.
const seededRandom = (seed: number) => () => {
	seed = (seed * 1664525 + 1013904223) % 4294967296;
	return seed / 4294967296;
};

describe("speedAt", () => {
	it("keeps the camera still until the warp is triggered", () => {
		expect(speedAt(newSim({ elapsed: 100 }), config)).toBe(0);
		expect(speedAt(newSim({ elapsed: 3, warpAt: 3 }), config)).toBe(0);
	});

	it("ramps monotonically to full speed over the warp", () => {
		const samples = [0.1, 0.25, 0.5, 0.75, 1].map((t) =>
			speedAt(
				newSim({ warpAt: 2, elapsed: 2 + t * config.warpDuration }),
				config,
			),
		);
		for (let i = 1; i < samples.length; i++) {
			expect(samples[i]).toBeGreaterThan(samples[i - 1]);
		}
		expect(samples.at(-1)).toBe(MAX_SPEED);
		expect(
			speedAt(
				newSim({ warpAt: 2, elapsed: 2 + config.warpDuration + 10 }),
				config,
			),
		).toBe(MAX_SPEED);
	});

	it("starts the ramp gently (cubic ease-in)", () => {
		const early = speedAt(
			newSim({ warpAt: 0, elapsed: 0.1 * config.warpDuration }),
			config,
		);
		expect(early).toBeLessThan(MAX_SPEED * 0.01);
	});
});

describe("projectAt", () => {
	const star = { x: 2, y: -1, size: 1 };

	it("maps the camera axis to the canvas center", () => {
		const p = projectAt({ x: 0, y: 0, size: 1 }, 5, view);
		expect(p.x).toBeCloseTo(view.width / 2);
		expect(p.y).toBeCloseTo(view.height / 2);
	});

	it("doubles the offset from center when depth halves", () => {
		const far = projectAt(star, 8, view);
		const near = projectAt(star, 4, view);
		expect(near.x - view.width / 2).toBeCloseTo(2 * (far.x - view.width / 2));
		expect(near.y - view.height / 2).toBeCloseTo(2 * (far.y - view.height / 2));
	});

	it("shrinks the projected radius with depth", () => {
		expect(projectAt(star, 8, view).radius).toBeLessThan(
			projectAt(star, 2, view).radius,
		);
	});

	it("parallaxes nearer stars harder under a camera drift", () => {
		const camY = 0.2;
		const nearShift =
			projectAt(star, 2, view).y - projectAt(star, 2, view, camY).y;
		const farShift =
			projectAt(star, 14, view).y - projectAt(star, 14, view, camY).y;
		expect(nearShift).toBeGreaterThan(0);
		expect(nearShift / farShift).toBeCloseTo(7);
	});
});

describe("seedTo", () => {
	it("scrubs the field in both directions", () => {
		const sim = newSim();
		const random = seededRandom(1);
		seedTo(sim, 0.5, view, config, random);
		expect(sim.stars).toHaveLength(50);

		seedTo(sim, 0.2, view, config, random);
		expect(sim.stars).toHaveLength(20);

		seedTo(sim, 1.4, view, config, random);
		expect(sim.stars).toHaveLength(config.starCount);
	});

	it("keeps seed dots still while the camera is parked", () => {
		const sim = newSim();
		seedTo(sim, 1, view, config, seededRandom(2));
		const depths = sim.stars.map((s) => s.z);
		advance(sim, 1, view, config, seededRandom(3));
		for (const [i, z] of depths.entries()) {
			expect(sim.stars[i].z).toBe(z);
		}
	});

	it("spawns seeds across the whole frame, back-projected per depth", () => {
		const sim = newSim();
		seedTo(sim, 1, view, config, seededRandom(4));
		for (const star of sim.stars) {
			const p = projectAt(star, star.z, view);
			expect(p.x).toBeGreaterThan(-0.07 * view.width);
			expect(p.x).toBeLessThan(1.07 * view.width);
			expect(p.y).toBeGreaterThan(-0.07 * view.height);
			expect(p.y).toBeLessThan(1.07 * view.height);
		}
	});

	it("hands the field to the warp once triggered", () => {
		const sim = newSim({ warpAt: 0, elapsed: 0 });
		seedTo(sim, 0.5, view, config, seededRandom(5));
		expect(sim.stars).toHaveLength(0);
	});
});

describe("advance", () => {
	it("moves stars toward the camera at the ramp speed", () => {
		const sim = newSim({ warpAt: 0, elapsed: 0.9 * config.warpDuration });
		sim.stars.push({
			x: 1,
			y: 1,
			z: 10,
			size: 1,
			brightness: 1,
			hue: 0,
			sat: 0,
			light: 90,
			bornAt: 0,
			fadeSeconds: 0.1,
			twinkle: 0,
		});
		const dt = 0.016;
		advance(sim, dt, view, config, seededRandom(6));
		expect(sim.stars[0].z).toBeCloseTo(10 - speedAt(sim, config) * dt);
	});

	it("pours in new stars near FAR_Z while warping", () => {
		const sim = newSim({ warpAt: 0, elapsed: 0.9 * config.warpDuration });
		advance(sim, 0.1, view, config, seededRandom(7));
		expect(sim.stars.length).toBeGreaterThan(0);
		for (const star of sim.stars) {
			expect(star.z).toBeGreaterThan(FAR_Z * 0.6);
		}
	});

	it("culls stars past the near plane and finishes once empty", () => {
		const sim = newSim({ warpAt: 0, elapsed: config.warpDuration + 1 });
		sim.stars.push({
			x: 0.1,
			y: 0.1,
			z: NEAR_Z + 0.5,
			size: 1,
			brightness: 1,
			hue: 0,
			sat: 0,
			light: 90,
			bornAt: 0,
			fadeSeconds: 0.1,
			twinkle: 0,
		});
		expect(phaseAt(sim, config)).toBe("drain");

		advance(sim, 0.5, view, config, seededRandom(8));
		expect(sim.stars).toHaveLength(0);
		expect(phaseAt(sim, config)).toBe("done");

		// Drain never spawns: the field stays empty.
		advance(sim, 1, view, config, seededRandom(9));
		expect(sim.stars).toHaveLength(0);
	});

	it("assembles the stationary arrival field once the warp ends", () => {
		const sim = newSim({ warpAt: 0, elapsed: 0.5 * config.warpDuration });
		const random = seededRandom(10);
		advance(sim, 0.1, view, config, random);
		expect(sim.rest).toHaveLength(0);

		sim.elapsed = config.warpDuration;
		for (let i = 0; i < 40; i++) advance(sim, 0.05, view, config, random);
		expect(sim.rest).toHaveLength(REST_STAR_COUNT);

		// Arrival stars are parked: more time moves nothing.
		const depths = sim.rest.map((s) => s.z);
		advance(sim, 1, view, config, random);
		expect(sim.rest.map((s) => s.z)).toEqual(depths);
		for (const star of sim.rest) {
			expect(star.z).toBeGreaterThan(NEAR_Z);
			expect(star.z).toBeLessThanOrEqual(FAR_Z);
		}
	});

	it("trims the arrival field to the scroll-back cap and refills later", () => {
		const sim = newSim({ warpAt: 0, elapsed: config.warpDuration });
		const random = seededRandom(11);
		for (let i = 0; i < 40; i++) advance(sim, 0.05, view, config, random);
		expect(sim.rest).toHaveLength(REST_STAR_COUNT);

		sim.restCap = 20;
		advance(sim, 0.016, view, config, random);
		expect(sim.rest).toHaveLength(20);

		sim.restCap = REST_STAR_COUNT;
		for (let i = 0; i < 40; i++) advance(sim, 0.05, view, config, random);
		expect(sim.rest).toHaveLength(REST_STAR_COUNT);
	});
});

describe("restCapFor", () => {
	it("maps scroll-back progress to a blink-out of the field", () => {
		expect(restCapFor(0)).toBe(0);
		expect(restCapFor(0.08)).toBe(0);
		expect(restCapFor(1)).toBe(REST_STAR_COUNT);
		expect(restCapFor(0.9)).toBe(REST_STAR_COUNT);

		const mid = restCapFor(0.35);
		expect(mid).toBeGreaterThan(0);
		expect(mid).toBeLessThan(REST_STAR_COUNT);
		expect(restCapFor(0.5)).toBeGreaterThan(mid);
	});
});

describe("wordProgress", () => {
	const warpAt = 2;
	const launch = warpAt + config.warpDuration - TEXT_LEAD;
	const at = (elapsed: number) => newSim({ warpAt, elapsed });

	it("never launches while the warp has not been triggered", () => {
		expect(wordProgress(newSim({ elapsed: 100 }), config, 0)).toBe(0);
	});

	it("launches the first word just before the warp ends and clamps", () => {
		expect(wordProgress(at(launch - 0.1), config, 0)).toBe(0);
		expect(wordProgress(at(launch + TEXT_FLIGHT / 2), config, 0)).toBeCloseTo(
			0.5,
		);
		expect(wordProgress(at(launch + TEXT_FLIGHT + 1), config, 0)).toBe(1);
	});

	it("staggers each word by the same offset", () => {
		const t = launch + 0.5;
		expect(wordProgress(at(t), config, 1)).toBeCloseTo(
			wordProgress(at(t - TEXT_STAGGER), config, 0),
		);
		expect(wordProgress(at(t), config, 2)).toBeCloseTo(
			wordProgress(at(t - 2 * TEXT_STAGGER), config, 0),
		);
	});
});

describe("wordDepth", () => {
	it("glides from the launch depth to the screen plane, monotonically", () => {
		expect(wordDepth(0)).toBe(TEXT_START_Z);
		expect(wordDepth(1)).toBeCloseTo(1);
		const samples = [0, 0.25, 0.5, 0.75, 1].map(wordDepth);
		for (let i = 1; i < samples.length; i++) {
			expect(samples[i]).toBeLessThan(samples[i - 1]);
		}
	});
});

describe("ufoPose", () => {
	it("enters from below the camera, oversized and faded out", () => {
		const pose = ufoPose(newSim(), config, 0);
		expect(pose.y).toBeGreaterThan(0.5);
		expect(pose.scale).toBeGreaterThan(3);
		expect(pose.opacity).toBe(0);
	});

	it("stays out of sight until half the field has seeded", () => {
		const pose = ufoPose(newSim(), config, UFO_ENTRY_START);
		expect(pose.y).toBeGreaterThan(0.5);
		expect(pose.scale).toBeGreaterThan(3);
		expect(pose.opacity).toBe(0);

		const arriving = ufoPose(
			newSim(),
			config,
			UFO_ENTRY_START + (1 - UFO_ENTRY_START) / 2,
		);
		expect(arriving.opacity).toBe(1);
		expect(arriving.scale).toBeLessThan(3);
	});

	it("settles at center at rest scale when the scrub completes", () => {
		const pose = ufoPose(newSim(), config, 1);
		expect(Math.abs(pose.y)).toBeLessThan(0.02);
		expect(pose.scale).toBeCloseTo(1);
		expect(pose.opacity).toBe(1);
	});

	it("hovers at center through the warp until the exit window", () => {
		const pose = ufoPose(newSim({ warpAt: 0, elapsed: 1 }), config, 1);
		expect(Math.abs(pose.y)).toBeLessThan(0.02);
		expect(pose.scale).toBe(1);
		expect(pose.opacity).toBe(1);
	});

	it("shrinks away and is gone before the first word launches", () => {
		const exitStart =
			config.warpDuration - TEXT_LEAD - UFO_EXIT_GAP - UFO_EXIT_SECONDS;
		const scales = [0.2, 0.5, 0.8].map(
			(t) =>
				ufoPose(
					newSim({ warpAt: 0, elapsed: exitStart + t * UFO_EXIT_SECONDS }),
					config,
					1,
				).scale,
		);
		for (let i = 1; i < scales.length; i++) {
			expect(scales[i]).toBeLessThan(scales[i - 1]);
		}

		const gone = ufoPose(
			newSim({ warpAt: 0, elapsed: config.warpDuration - TEXT_LEAD }),
			config,
			1,
		);
		expect(gone.scale).toBe(0);
		expect(gone.opacity).toBe(0);
	});
});

describe("warpT", () => {
	it("clamps the ramp fraction to 0..1 around the warp window", () => {
		expect(warpT(newSim({ elapsed: 50 }), config)).toBe(0);
		expect(warpT(newSim({ warpAt: 1, elapsed: 1 }), config)).toBe(0);
		expect(
			warpT(
				newSim({ warpAt: 1, elapsed: 1 + config.warpDuration / 2 }),
				config,
			),
		).toBeCloseTo(0.5);
		expect(
			warpT(
				newSim({ warpAt: 1, elapsed: 1 + config.warpDuration + 5 }),
				config,
			),
		).toBe(1);
	});
});
