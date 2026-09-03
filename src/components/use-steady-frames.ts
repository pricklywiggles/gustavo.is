"use client";

import { useEffect, useState } from "react";

const CALM_FRAME_MS = 50;
const CALM_FRAMES_NEEDED = 2;
const GIVE_UP_MS = 1500;

// Two calm rAF ticks mean the post-hydration storm passed; the give-up unblocks janky machines.
export function useSteadyFrames() {
	const [steady, setSteady] = useState(false);
	useEffect(() => {
		let raf = 0;
		const start = performance.now();
		let last = start;
		let calm = 0;
		const tick = (t: number) => {
			calm = t - last < CALM_FRAME_MS ? calm + 1 : 0;
			last = t;
			if (calm >= CALM_FRAMES_NEEDED || t - start > GIVE_UP_MS) {
				setSteady(true);
				return;
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, []);
	return steady;
}
