/**
 * Groups already-laid-out character elements into the browser's visual lines (offsetTop
 * is read directly; pass elements in DOM order). A new line begins when a top drops past
 * `tolerance`, half a character box: over sub-pixel drift, under the line gap.
 */
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
