/** Camera space: flight shrinks z. Seeding is scroll-driven until sim.warpAt starts sim time. */

export type Star = {
	x: number;
	y: number;
	z: number;
	size: number;
	/** Peak alpha, 0..1. */
	brightness: number;
	hue: number;
	sat: number;
	light: number;
	/** Sim time (seconds) the star appeared. */
	bornAt: number;
	fadeSeconds: number;
	twinkle: number;
};

export type Viewport = { width: number; height: number; focal: number };

export type WarpPhase = "seed" | "warp" | "drain" | "done";

export type WarpConfig = {
	starCount: number;
	warpDuration: number;
};

export type WarpSim = {
	elapsed: number;
	stars: Star[];
	seeded: number;
	spawnBudget: number;
	/** Sim time the jump began; null while seeding. */
	warpAt: number | null;
	/** Stationary arrival stars; z is kept only for the scroll parallax in projectAt. */
	rest: Star[];
	restBudget: number;
	/** Arrival-field ceiling, driven by scroll so the field tears down on the way back up. */
	restCap: number;
};

/** Cull depth; the star has passed the camera. */
export const NEAR_Z = 0.1;
export const FAR_Z = 16;
export const MAX_SPEED = 46;
const SEED_MIN_Z = 1.4;
/** Cubic: a barely perceptible drift, then the rush. */
const RAMP_EXPONENT = 3;
/** Peak spawn rate; the rate tracks ramp progress, not speed, so the field keeps thickening. */
const WARP_SPAWN_PER_SECOND = 700;
const MAX_LIVE_STARS = 900;
/** Stars seed past the frame so streaks exit the edges instead of dying on them. */
const OVERSCAN = 1.12;
const SEED_FADE_SECONDS = 0.45;
const WARP_FADE_SECONDS = 0.12;
export const REST_STAR_COUNT = 90;
const REST_SPAWN_SECONDS = 1.2;
const REST_FADE_SECONDS = 0.8;
const REST_OUT_END = 0.08;
const REST_OUT_SPAN = 0.55;
const SIZE_SCALE = 0.01;
const MIN_RADIUS = 0.5;
const MAX_RADIUS = 2.75;

/** Word launch depth; scale is 1/z, so a word starts at ~1% and inflates on approach. */
export const TEXT_START_Z = 80;
/** Lead before warp end, so the word trails overlap the last streaks. */
export const TEXT_LEAD = 0.5;
export const TEXT_STAGGER = 0.35;
export const TEXT_FLIGHT = 0.65;

export const UFO_EXIT_SECONDS = 1;
/** Gap between the UFO's exit and the first word launch. */
export const UFO_EXIT_GAP = 0.3;
/** Late entry so the seed scrub reads as two beats: field alone, then the ship. */
export const UFO_ENTRY_START = 0.5;
const UFO_ENTRY_SCALE = 5;
/** Entry start, viewport-height fractions below center. */
const UFO_ENTRY_DROP = 0.65;
/** Upward drift on exit, so departure reads as flight. */
const UFO_EXIT_RISE = 0.05;
const UFO_EXIT_END_SCALE = 0.02;

export function focalFor(width: number, height: number): number {
	return 0.8 * Math.min(width, height);
}

export function warpT(sim: WarpSim, config: WarpConfig): number {
	if (sim.warpAt === null) return 0;
	const t = (sim.elapsed - sim.warpAt) / config.warpDuration;
	if (t <= 0) return 0;
	if (t >= 1) return 1;
	return t;
}

export function speedAt(sim: WarpSim, config: WarpConfig): number {
	return MAX_SPEED * warpT(sim, config) ** RAMP_EXPONENT;
}

export function phaseAt(sim: WarpSim, config: WarpConfig): WarpPhase {
	if (sim.warpAt === null) return "seed";
	if (warpT(sim, config) < 1) return "warp";
	return sim.stars.length > 0 ? "drain" : "done";
}

/** Seeds the field to a 0..1 progress; scrolling back pops the newest seeds first. */
export function seedTo(
	sim: WarpSim,
	progress: number,
	view: Viewport,
	config: WarpConfig,
	random: () => number = Math.random,
): void {
	if (sim.warpAt !== null) return;
	const due = Math.min(
		config.starCount,
		Math.max(0, Math.floor(progress * config.starCount)),
	);
	while (sim.seeded < due) {
		const z = SEED_MIN_Z + random() * (FAR_Z - SEED_MIN_Z);
		sim.stars.push(makeStar(z, view, sim.elapsed, SEED_FADE_SECONDS, random));
		sim.seeded++;
	}
	while (sim.seeded > due) {
		sim.stars.pop();
		sim.seeded--;
	}
}

export function advance(
	sim: WarpSim,
	dt: number,
	view: Viewport,
	config: WarpConfig,
	random: () => number = Math.random,
): void {
	sim.elapsed += dt;
	const speed = speedAt(sim, config);

	if (speed > 0) {
		let live = 0;
		for (const star of sim.stars) {
			star.z -= speed * dt;
			if (star.z > NEAR_Z) sim.stars[live++] = star;
		}
		sim.stars.length = live;
	}

	if (phaseAt(sim, config) === "warp") {
		sim.spawnBudget += WARP_SPAWN_PER_SECOND * warpT(sim, config) * dt;
		while (sim.spawnBudget >= 1) {
			sim.spawnBudget -= 1;
			if (sim.stars.length >= MAX_LIVE_STARS) continue;
			const z = FAR_Z * (0.75 + random() * 0.25);
			sim.stars.push(makeStar(z, view, sim.elapsed, WARP_FADE_SECONDS, random));
		}
	}

	if (sim.warpAt !== null && warpT(sim, config) >= 1) {
		const target = Math.min(REST_STAR_COUNT, Math.max(0, sim.restCap));
		while (sim.rest.length > target) sim.rest.pop();
		if (sim.rest.length >= target) {
			sim.restBudget = 0;
		} else {
			sim.restBudget += (REST_STAR_COUNT / REST_SPAWN_SECONDS) * dt;
			while (sim.restBudget >= 1 && sim.rest.length < target) {
				sim.restBudget -= 1;
				const z = SEED_MIN_Z + random() * (FAR_Z - SEED_MIN_Z);
				sim.rest.push(
					makeStar(z, view, sim.elapsed, REST_FADE_SECONDS, random),
				);
			}
		}
	}
}

/** Arrival-field ceiling: full up top, empty just before the section releases. */
export function restCapFor(progress: number): number {
	const t = (progress - REST_OUT_END) / REST_OUT_SPAN;
	if (t <= 0) return 0;
	if (t >= 1) return REST_STAR_COUNT;
	return Math.round(REST_STAR_COUNT * t);
}

/** Linear flight progress of word `index`; the ease is the caller's. */
export function wordProgress(
	sim: WarpSim,
	config: WarpConfig,
	index: number,
): number {
	if (sim.warpAt === null) return 0;
	const start =
		sim.warpAt + config.warpDuration - TEXT_LEAD + index * TEXT_STAGGER;
	const t = (sim.elapsed - start) / TEXT_FLIGHT;
	if (t <= 0) return 0;
	if (t >= 1) return 1;
	return t;
}

/** Exponential glide from TEXT_START_Z to 1: perceived zoom rate stays steady. */
export function wordDepth(t: number): number {
	return TEXT_START_Z ** (1 - t);
}

/** Pose: y in viewport-height fractions from center (positive down), scale relative to hover. */
export function ufoPose(
	sim: WarpSim,
	config: WarpConfig,
	seedProgress: number,
): { y: number; scale: number; opacity: number } {
	const bob = Math.sin(sim.elapsed * 2.4) * 0.008;

	if (sim.warpAt === null) {
		const p = Math.min(
			Math.max((seedProgress - UFO_ENTRY_START) / (1 - UFO_ENTRY_START), 0),
			1,
		);
		const easeOut = 1 - (1 - p) ** 2;
		return {
			y: (1 - easeOut) * UFO_ENTRY_DROP + bob * easeOut,
			scale: UFO_ENTRY_SCALE ** (1 - easeOut),
			opacity: Math.min(p / 0.1, 1),
		};
	}

	const exitStart =
		sim.warpAt +
		config.warpDuration -
		TEXT_LEAD -
		UFO_EXIT_GAP -
		UFO_EXIT_SECONDS;
	const t = (sim.elapsed - exitStart) / UFO_EXIT_SECONDS;
	if (t <= 0) return { y: bob, scale: 1, opacity: 1 };
	if (t >= 1) return { y: -UFO_EXIT_RISE, scale: 0, opacity: 0 };
	const easeIn = t ** 3;
	return {
		y: bob * (1 - easeIn) - UFO_EXIT_RISE * easeIn,
		scale: UFO_EXIT_END_SCALE ** easeIn,
		opacity: t < 0.85 ? 1 : (1 - t) / 0.15,
	};
}

/** Uniform in screen space, back-projected to z, so the field covers the frame at every depth. */
function makeStar(
	z: number,
	view: Viewport,
	bornAt: number,
	fadeSeconds: number,
	random: () => number,
): Star {
	const scale = view.focal / z;
	const sx = (random() - 0.5) * view.width * OVERSCAN;
	const sy = (random() - 0.5) * view.height * OVERSCAN;
	return {
		x: sx / scale,
		y: sy / scale,
		z,
		size: 0.5 + random() * 0.9,
		brightness: 0.5 + random() * 0.5,
		...pickColor(random),
		bornAt,
		fadeSeconds,
		twinkle: random() * Math.PI * 2,
	};
}

/** Projects at an arbitrary z (the tail draws a past depth); camY is a world-unit offset. */
export function projectAt(
	star: Pick<Star, "x" | "y" | "size">,
	z: number,
	view: Viewport,
	camY = 0,
): { x: number; y: number; radius: number } {
	const scale = view.focal / z;
	return {
		x: view.width / 2 + star.x * scale,
		y: view.height / 2 + (star.y - camY) * scale,
		radius: Math.min(
			Math.max(star.size * scale * SIZE_SCALE, MIN_RADIUS),
			MAX_RADIUS,
		),
	};
}

/** The hue mix echoes the reference frame. */
function pickColor(random: () => number): {
	hue: number;
	sat: number;
	light: number;
} {
	const roll = random();
	if (roll < 0.55) return { hue: 40 + random() * 20, sat: 12, light: 92 };
	if (roll < 0.75) return { hue: 185 + random() * 20, sat: 90, light: 74 };
	if (roll < 0.86) return { hue: 215 + random() * 25, sat: 90, light: 72 };
	return { hue: 320 + random() * 30, sat: 85, light: 74 };
}
