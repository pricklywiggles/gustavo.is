/**
 * Shared math for scroll-scrubbed item lists (the projects showcase, the
 * feature tabs): a pinned scrub range divided evenly among `count` items.
 */

/** Quantize scrub progress (0..1) to an item index. */
export function scrubIndex(progress: number, count: number): number {
	return Math.min(count - 1, Math.floor(progress * count));
}

/** The scroll position centered inside an item's slice of a scrub range. */
export function scrubJumpTarget(
	range: { start: number; end: number },
	index: number,
	count: number,
): number {
	return range.start + ((index + 0.5) / count) * (range.end - range.start);
}
