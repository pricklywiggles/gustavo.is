import {
	CHAPTERS,
	type CityChapter,
} from "@/components/landing/work-history-data";

/** A title held at one employer; `end` is null while the role is ongoing. */
export type Role = { title: string; start: number; end: number | null };

export type Employment = {
	company: string;
	city: string;
	/** Consecutive same-title stints merged, so each role keeps its own dates. */
	roles: Role[];
	products: string[];
	/** Whole years: starts rounded down, ends rounded; null end means ongoing. */
	start: number;
	end: number | null;
};

/**
 * One entry per company, chronological, collapsed from the landing's per-product
 * stints; the scroll story only ever shows one stint at a time. A stint reaching
 * the last chapter's span end is ongoing, since that span ends at "now".
 */
export function employmentHistory(
	chapters: readonly CityChapter[] = CHAPTERS,
): Employment[] {
	const presentYear = chapters.at(-1)?.span[1];
	const endOf = (year: number) =>
		presentYear !== undefined && year >= presentYear ? null : Math.round(year);
	const history: Employment[] = [];
	for (const chapter of chapters) {
		for (const stint of chapter.stints) {
			const start = Math.floor(stint.years[0]);
			const end = endOf(stint.years[1]);
			const previous = history.at(-1);
			if (previous?.company === stint.company) {
				const role = previous.roles.at(-1);
				if (role?.title === stint.role) role.end = end;
				else previous.roles.push({ title: stint.role, start, end });
				previous.products.push(stint.product);
				previous.end = end;
				continue;
			}
			history.push({
				company: stint.company,
				city: chapter.name,
				roles: [{ title: stint.role, start, end }],
				products: [stint.product],
				start,
				end,
			});
		}
	}
	return history;
}
