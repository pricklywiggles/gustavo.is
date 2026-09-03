import { describe, expect, it, vi } from "vitest";
import { createClipWriter, type HoleGeometry, holePath } from "./hero-hole";

const geometry: HoleGeometry = {
	vw: 400,
	vh: 800,
	cx: 120,
	cy: 400,
	sheetVh: 2.4,
	s: 0.5,
	yOff: 0,
	rotation: 0,
	phase: 0,
};

const FRAME = "M0,0 H400 V1920 H0 Z";

// The lobe anchors are the `M` and the last point of every `C`.
const anchors = (d: string) =>
	Array.from(d.matchAll(/(?:M|C[^C]*?) (-?[\d.]+) (-?[\d.]+)(?= C| Z)/g)).map(
		([, x, y]) => [Number(x), Number(y)] as const,
	);

describe("holePath", () => {
	it("is the bare frame while the hole is closed", () => {
		expect(holePath({ ...geometry, s: 0 })).toBe(FRAME);
		expect(holePath({ ...geometry, s: 0.0005 })).toBe(FRAME);
	});

	it("cuts the blob out of the frame, centered on the target", () => {
		const d = holePath(geometry);
		expect(d.startsWith(`${FRAME} M `)).toBe(true);
		expect(d.endsWith(" Z")).toBe(true);
		const closed = anchors(d);
		// 8 lobes plus the closing anchor back on `M`.
		expect(closed).toHaveLength(9);
		expect(closed[8]).toEqual(closed[0]);
		const points = closed.slice(0, 8);
		const mean = points.reduce(
			([x, y], [px, py]) => [x + px / 8, y + py / 8],
			[0, 0],
		);
		// Lobe radii differ, so the centroid sits near, not on, the center.
		expect(mean[0]).toBeCloseTo(geometry.cx, -2);
		expect(mean[1]).toBeCloseTo(geometry.cy, -2);
	});

	it("climbs the sheet by exactly the sheet's travel", () => {
		const rest = anchors(holePath(geometry));
		const travelled = anchors(holePath({ ...geometry, yOff: 333 }));
		for (const [i, [x, y]] of rest.entries()) {
			expect(travelled[i][0]).toBeCloseTo(x, 5);
			expect(travelled[i][1]).toBeCloseTo(y + 333, 5);
		}
	});
});

describe("createClipWriter", () => {
	const setup = () => {
		const path = { setAttribute: vi.fn() };
		let d = "a";
		const compute = vi.fn(() => d);
		const scheduled: Array<() => void> = [];
		const writer = createClipWriter({
			path,
			compute,
			schedule: (fn) => {
				scheduled.push(fn);
			},
		});
		const flush = () => {
			for (const fn of scheduled.splice(0)) fn();
		};
		return {
			path,
			writer,
			scheduled,
			flush,
			setPath: (next: string) => (d = next),
		};
	};

	it("writes synchronously only when the path changed", () => {
		const { path, writer, setPath } = setup();
		writer.write();
		writer.write();
		expect(path.setAttribute).toHaveBeenCalledTimes(1);
		expect(path.setAttribute).toHaveBeenCalledWith("d", "a");
		setPath("b");
		writer.write();
		expect(path.setAttribute).toHaveBeenCalledTimes(2);
	});

	it("coalesces any number of requests into one scheduled write", () => {
		const { path, writer, scheduled, flush, setPath } = setup();
		writer.request();
		writer.request();
		writer.request();
		expect(scheduled).toHaveLength(1);
		flush();
		expect(path.setAttribute).toHaveBeenCalledTimes(1);
		writer.request();
		flush();
		expect(path.setAttribute).toHaveBeenCalledTimes(1);
		setPath("b");
		writer.request();
		flush();
		expect(path.setAttribute).toHaveBeenCalledTimes(2);
	});

	it("writes nothing while hidden and once, synchronously, on show", () => {
		const { path, writer, scheduled, flush, setPath } = setup();
		writer.write();
		writer.hide();
		setPath("b");
		writer.request();
		expect(scheduled).toHaveLength(0);
		writer.write();
		expect(path.setAttribute).toHaveBeenCalledTimes(1);
		writer.show();
		expect(path.setAttribute).toHaveBeenCalledTimes(2);
		expect(path.setAttribute).toHaveBeenLastCalledWith("d", "b");
		flush();
		expect(path.setAttribute).toHaveBeenCalledTimes(2);
	});

	it("drops a write scheduled before hiding", () => {
		const { path, writer, flush, setPath } = setup();
		writer.write();
		setPath("b");
		writer.request();
		writer.hide();
		flush();
		expect(path.setAttribute).toHaveBeenCalledTimes(1);
	});

	it("ignores everything after disposal, including a write already scheduled", () => {
		const { path, writer, scheduled, flush, setPath } = setup();
		writer.request();
		writer.dispose();
		flush();
		writer.request();
		writer.write();
		writer.show();
		setPath("b");
		writer.request();
		expect(scheduled).toHaveLength(0);
		expect(path.setAttribute).not.toHaveBeenCalled();
	});
});
