/** Call after layout, in DOM order: offsetTop is read directly.
 * Default tolerance is half a character box: over sub-pixel drift, under the line gap. */
export function groupIntoLines<T extends HTMLElement>(
	chars: readonly T[],
	tolerance?: number,
): T[][] {
	const measured = (chars[0]?.offsetHeight ?? 0) * 0.5;
	const tol = tolerance ?? (measured || 4);
	const lines: T[][] = [];
	let lineTop = Number.NEGATIVE_INFINITY;
	for (const char of chars) {
		const top = char.offsetTop;
		if (lines.length === 0 || top - lineTop > tol) {
			lines.push([]);
			lineTop = top;
		}
		lines[lines.length - 1].push(char);
	}
	return lines;
}
