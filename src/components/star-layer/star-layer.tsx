import type { ReactElement } from "react";

// Seeded so server and client render identically and the scatter never reshuffles.

export type StarSpec = {
	/** Percent of layer width. */
	x: number;
	/** Percent of layer height. */
	y: number;
	/** Radius in px. */
	r: number;
	opacity: number;
	fill: string;
};

/** mulberry32: tiny seeded PRNG, plenty for star scatter. */
export function starRandom(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

const STAR_TINTS = ["#fff7e8", "#dbe9ff"];

export function starField(
	seed: number,
	count: number,
	minRadius: number,
	maxRadius: number,
): StarSpec[] {
	const rand = starRandom(seed);
	return Array.from({ length: count }, () => ({
		x: rand() * 100,
		y: rand() * 100,
		r: minRadius + rand() * (maxRadius - minRadius),
		opacity: 0.35 + rand() * 0.65,
		fill: rand() < 0.75 ? "#ffffff" : STAR_TINTS[rand() < 0.5 ? 0 : 1],
	}));
}

/** Percent positions stretch with the layer; px radii keep stars round at any size. */
export function StarLayer({
	seed,
	count,
	minRadius,
	maxRadius,
	className,
}: {
	seed: number;
	count: number;
	minRadius: number;
	maxRadius: number;
	className?: string;
}): ReactElement {
	const stars = starField(seed, count, minRadius, maxRadius);
	return (
		<svg className={className} aria-hidden="true">
			{stars.map((star, i) => (
				<circle
					// biome-ignore lint/suspicious/noArrayIndexKey: static seeded list, never reordered
					key={i}
					cx={`${star.x}%`}
					cy={`${star.y}%`}
					r={star.r}
					fill={star.fill}
					opacity={star.opacity}
				/>
			))}
		</svg>
	);
}
