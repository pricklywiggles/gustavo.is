import gsap from "gsap";

// Even-odd path: the frame minus the hole; hero.tsx's clipPath sets clipRule="evenodd".
const LOBE_RADII = [1.0, 1.24, 0.8, 1.14, 0.88, 1.28, 0.76, 1.1];
const LOBE_PHASES = [0, 2.1, 4.4, 1.3, 5.2, 3.0, 0.7, 5.9];
const LOBE_COUNT = LOBE_RADII.length;
const UNDULATION = 0.14; // per-lobe radius swing
const SMOOTHING = 0.18; // Catmull-Rom-ish tangent factor for the closed curve
const CLOSED_PX = 0.5;

export type HoleGeometry = {
	vw: number;
	vh: number;
	/** Hole center, viewport px. */
	cx: number;
	cy: number;
	sheetVh: number;
	/** Hole scale, viewport heights. */
	s: number;
	/** Sheet travel (px): path coords are sheet-local, so the hole stays put on screen. */
	yOff: number;
	rotation: number;
	phase: number;
};

const px = new Array<number>(LOBE_COUNT);
const py = new Array<number>(LOBE_COUNT);

export function holePath({
	vw,
	vh,
	cx,
	cy,
	sheetVh,
	s,
	yOff,
	rotation,
	phase,
}: HoleGeometry): string {
	const S = s * vh;
	const frame = `M0,0 H${vw} V${sheetVh * vh} H0 Z`;
	if (S <= CLOSED_PX) return frame;
	const y0 = cy + yOff;
	const rot = (rotation * Math.PI) / 180;
	for (let i = 0; i < LOBE_COUNT; i++) {
		const angle = (i / LOBE_COUNT) * Math.PI * 2 + rot;
		const r =
			LOBE_RADII[i] * (1 + UNDULATION * Math.sin(phase + LOBE_PHASES[i])) * S;
		px[i] = cx + r * Math.cos(angle);
		py[i] = y0 + r * Math.sin(angle);
	}
	let d = `${frame} M ${px[0].toFixed(1)} ${py[0].toFixed(1)}`;
	for (let i = 0; i < LOBE_COUNT; i++) {
		const p0 = (i + LOBE_COUNT - 1) % LOBE_COUNT;
		const p2 = (i + 1) % LOBE_COUNT;
		const p3 = (i + 2) % LOBE_COUNT;
		const c1x = px[i] + (px[p2] - px[p0]) * SMOOTHING;
		const c1y = py[i] + (py[p2] - py[p0]) * SMOOTHING;
		const c2x = px[p2] - (px[p3] - px[i]) * SMOOTHING;
		const c2y = py[p2] - (py[p3] - py[i]) * SMOOTHING;
		d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${px[p2].toFixed(1)} ${py[p2].toFixed(1)}`;
	}
	return `${d} Z`;
}

export type ClipWriter = {
	/** Synchronous: a clip referencing an empty path hides the sheet for a frame. */
	write(): void;
	request(): void;
	hide(): void;
	show(): void;
	dispose(): void;
};

/** Each `d` write invalidates the clip sheet-wide, which iOS repaints on the main thread. */
export function createClipWriter({
	path,
	compute,
	// gsap.ticker.add(fn, true) returns a wrapper, so ticker.remove(fn) never matches.
	schedule = (fn) => {
		gsap.ticker.add(fn, true);
	},
}: {
	path: { setAttribute(name: string, value: string): void };
	compute: () => string;
	schedule?: (fn: () => void) => void;
}): ClipWriter {
	let last = "";
	let pending = false;
	let hidden = false;
	let disposed = false;
	const write = () => {
		pending = false;
		if (disposed || hidden) return;
		const d = compute();
		if (d === last) return;
		last = d;
		path.setAttribute("d", d);
	};
	return {
		write,
		request() {
			if (pending || disposed || hidden) return;
			pending = true;
			schedule(write);
		},
		hide() {
			hidden = true;
		},
		show() {
			hidden = false;
			write();
		},
		dispose() {
			disposed = true;
		},
	};
}
