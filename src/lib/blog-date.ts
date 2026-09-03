// Frontmatter dates are UTC midnights; a fixed locale and zone keep every machine identical.
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
