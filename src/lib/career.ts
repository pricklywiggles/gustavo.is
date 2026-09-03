import {
	CHAPTERS,
	type CityChapter,
} from "@/components/landing/work-history-data";

/** `end` is null while the role is ongoing. */
export type Role = { title: string; start: number; end: number | null };

export type Employment = {
	company: string;
	city: string;
	/** Consecutive same-title stints merged into one role. */
	roles: Role[];
	products: string[];
	/** Whole years: start rounded down, end rounded. */
	start: number;
	end: number | null;
};

/**
 * One entry per company, chronological, collapsed from the landing's per-product stints.
 * The last chapter's span ends at "now", so a stint reaching it is ongoing.
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
