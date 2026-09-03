/** `progress` runs 0..1. */
export function scrubIndex(progress: number, count: number): number {
	return Math.min(count - 1, Math.floor(progress * count));
}

/** The center of the item's slice. */
export function scrubJumpTarget(
	range: { start: number; end: number },
	index: number,
	count: number,
): number {
	return range.start + ((index + 0.5) / count) * (range.end - range.start);
}
