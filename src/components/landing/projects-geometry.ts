import { PROJECTS } from "./projects-data";

/**
 * The showcase's scroll geometry, DOM-free so the speed map can audit it. The scrub box
 * in other-projects.tsx is a Tailwind literal one viewport taller than the scrub (the
 * sticky stage), so its test pins the literal to this arithmetic.
 */

/** Scroll per project in the showcase, viewport-heights. */
export const PROJECT_SCRUB_VH_PER_PROJECT = 1;

/** The showcase scrub's length: `top top` to `bottom bottom` over its `h-[(N+1)00vh]` box. */
export function projectsScrubVh(): number {
	return PROJECTS.length * PROJECT_SCRUB_VH_PER_PROJECT;
}
