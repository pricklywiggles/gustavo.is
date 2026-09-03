import { describe, expect, it } from "vitest";
import { blogDateTime, formatBlogDate } from "./blog-date";

describe("blog dates", () => {
	// A UTC midnight: any local-time formatting west of Greenwich would slide it to Jul 15.
	const date = new Date("2026-07-16");

	it("formats pinned to UTC", () => {
		expect(formatBlogDate(date)).toBe("Jul 16, 2026");
	});

	it("emits the ISO date for <time>", () => {
		expect(blogDateTime(date)).toBe("2026-07-16");
	});
});
