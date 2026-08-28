/**
 * Declarative scroll choreography: an ordered list of named phases, each with
 * a length in viewport-heights, resolved into absolute offsets from the pin
 * start. Sequential phases start where the cursor left off; a phase with
 * `with` anchors to another phase's start instead (plus `offset`), which is
 * how overlaps are expressed. Reordering the story is reordering the list.
 */
export type PhaseSpec = {
	id: string;
	len: number;
	/** Anchor to this phase's start instead of the sequential cursor. */
	with?: string;
	/** Viewport-heights past the anchor's start. */
	offset?: number;
};

export type PhaseMap = {
	at: Record<string, number>;
	len: Record<string, number>;
	/** Pin length: the furthest end of any phase. */
	total: number;
};

export function resolvePhases(specs: PhaseSpec[]): PhaseMap {
	const at: Record<string, number> = {};
	const len: Record<string, number> = {};
	let cursor = 0;
	for (const spec of specs) {
		if (spec.id in at) throw new Error(`duplicate phase: ${spec.id}`);
		let start = cursor;
		if (spec.with !== undefined) {
			if (!(spec.with in at)) throw new Error(`unknown anchor: ${spec.with}`);
			start = at[spec.with] + (spec.offset ?? 0);
		}
		at[spec.id] = start;
		len[spec.id] = spec.len;
		cursor = Math.max(cursor, start + spec.len);
	}
	return { at, len, total: cursor };
}
