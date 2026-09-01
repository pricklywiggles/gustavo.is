import { PROJECTS } from "./projects-data";

/**
 * Showcase scroll geometry, DOM-free so the speed map can audit it; other-projects.tsx
 * keeps its height a literal (Tailwind scans source); a test pins it to this arithmetic.
 */

/** 2: a hard phone flick (~3.2 viewports) skips at most one project (FRA-189). */
export const PROJECT_SCRUB_VH_PER_PROJECT = 2;

/** Scrub length: `top top` to `bottom bottom` over the `h-[(N+1)00vh]` box. */
export function projectsScrubVh(): number {
	return PROJECTS.length * PROJECT_SCRUB_VH_PER_PROJECT;
}
