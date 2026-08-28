// Explicit locale AND UTC: frontmatter dates are UTC midnights, so a local render would
// show the previous day west of Greenwich; every machine must emit the same string.
const BLOG_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
	month: "short",
	day: "numeric",
	year: "numeric",
	timeZone: "UTC",
});

export function formatBlogDate(date: Date): string {
	return BLOG_DATE_FORMAT.format(date);
}

export function blogDateTime(date: Date): string {
	return date.toISOString().slice(0, 10);
}
