import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useSteadyFrames } from "./use-steady-frames";

let queue: FrameRequestCallback[] = [];
let now = 0;

beforeEach(() => {
	queue = [];
	now = 0;
	vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
		queue.push(cb);
		return queue.length;
	});
	vi.stubGlobal("cancelAnimationFrame", (id: number) => {
		queue = queue.filter((_, i) => i + 1 !== id);
	});
	vi.spyOn(performance, "now").mockImplementation(() => now);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

const frame = (advanceMs: number) => {
	now += advanceMs;
	const cbs = queue;
	queue = [];
	act(() => {
		for (const cb of cbs) cb(now);
	});
};

describe("useSteadyFrames", () => {
	it("stays false until two consecutive calm frames, then flips", () => {
		const { result } = renderHook(() => useSteadyFrames());
		expect(result.current).toBe(false);
		frame(600); // stalled frame after mount
		frame(16);
		expect(result.current).toBe(false);
		frame(16);
		expect(result.current).toBe(true);
	});

	it("resets the calm count when a stall interrupts", () => {
		const { result } = renderHook(() => useSteadyFrames());
		frame(16);
		frame(500);
		frame(16);
		expect(result.current).toBe(false);
		frame(16);
		expect(result.current).toBe(true);
	});

	it("gives up and flips true when frames never settle", () => {
		const { result } = renderHook(() => useSteadyFrames());
		for (let i = 0; i < 15; i++) frame(100);
		expect(result.current).toBe(false);
		frame(100); // crosses the 1.5s bail-out
		expect(result.current).toBe(true);
	});

	it("stops sampling after unmount", () => {
		const { unmount } = renderHook(() => useSteadyFrames());
		unmount();
		expect(queue).toHaveLength(0);
	});
});
