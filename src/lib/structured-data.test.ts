import { describe, expect, it } from "vitest";
import {
	PONDER,
	RETROSPECTIVES,
} from "@/components/retrospective/retrospective-data";
import { employmentHistory } from "./career";
import {
	blogPostingJsonLd,
	PERSON_ID,
	retrospectiveJsonLd,
	siteJsonLd,
	WEBSITE_ID,
} from "./structured-data";

describe("siteJsonLd", () => {
	const [person, website] = siteJsonLd()["@graph"];

	it("links the Person and WebSite by id", () => {
		expect(person["@id"]).toBe(PERSON_ID);
		expect(website["@id"]).toBe(WEBSITE_ID);
		expect(website.publisher).toEqual({ "@id": PERSON_ID });
	});

	it("emits one dated EmployeeRole per title, open-ended for the current one", () => {
		const roles = person.worksFor;
		expect(roles).toHaveLength(
			employmentHistory().reduce((n, job) => n + job.roles.length, 0),
		);
		expect(roles[0]).toEqual({
			"@type": "EmployeeRole",
			roleName: "Software Design Engineer",
			startDate: "1998",
			endDate: "2000",
			worksFor: { "@type": "Organization", name: "Microsoft" },
		});
		const current = roles.at(-1);
		expect(current?.worksFor.name).toBe("Tartle");
		expect(current).not.toHaveProperty("endDate");
	});
});

describe("blogPostingJsonLd", () => {
	const base = {
		url: "/blog/x",
		title: "X",
		description: "D",
		date: "2026-01-01",
		tags: ["a", "b"],
	};

	it("wires author and site ids, joins keywords, and omits a missing image", () => {
		const post = blogPostingJsonLd(base);
		expect(post.author["@id"]).toBe(PERSON_ID);
		expect(post.isPartOf).toEqual({ "@id": WEBSITE_ID });
		expect(post.keywords).toBe("a, b");
		expect(post.url).toBe("https://gustavo.is/blog/x");
		expect(post).not.toHaveProperty("image");
	});

	it("uses the post's own image when it has one", () => {
		expect(blogPostingJsonLd({ ...base, image: "/pics/x.jpg" }).image).toBe(
			"https://gustavo.is/pics/x.jpg",
		);
	});
});

describe("retrospectiveJsonLd", () => {
	it("covers the years as an ISO interval and uses the product's card", () => {
		const article = retrospectiveJsonLd(PONDER);
		expect(article.temporalCoverage).toBe("2019/2021");
		expect(article.image).toBe("https://gustavo.is/og/ponder.png");
		for (const r of RETROSPECTIVES) {
			expect(retrospectiveJsonLd(r).temporalCoverage).toMatch(/^\d{4}\/\d{4}$/);
		}
	});
});
