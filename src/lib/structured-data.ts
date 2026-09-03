import type { Retrospective } from "@/components/retrospective/retrospective-data";
import { employmentHistory } from "./career";
import type { PostSummary } from "./llms";
import {
	AUTHOR_NAME,
	absoluteUrl,
	SITE_DESCRIPTION,
	SITE_NAME,
	SITE_URL,
} from "./site";
import { SOCIAL_LINKS } from "./site-links";
import { OG_IMAGES } from "./site-metadata";

export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

const author = {
	"@type": "Person",
	"@id": PERSON_ID,
	name: AUTHOR_NAME,
	url: SITE_URL,
};

/** worksFor nests an EmployeeRole per title: schema.org's Role pattern carries the dates. */
export function siteJsonLd() {
	const person = {
		...author,
		description: SITE_DESCRIPTION,
		jobTitle: "Software engineer generalist",
		address: {
			"@type": "PostalAddress",
			addressLocality: "Los Angeles",
			addressRegion: "CA",
			addressCountry: "US",
		},
		image: absoluteUrl(OG_IMAGES.default.url),
		sameAs: SOCIAL_LINKS.map((social) => social.href),
		worksFor: employmentHistory().flatMap((job) =>
			job.roles.map((role) => ({
				"@type": "EmployeeRole",
				roleName: role.title,
				startDate: String(role.start),
				...(role.end === null ? {} : { endDate: String(role.end) }),
				worksFor: { "@type": "Organization", name: job.company },
			})),
		),
	};
	const website = {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: SITE_URL,
		name: SITE_NAME,
		description: SITE_DESCRIPTION,
		inLanguage: "en",
		publisher: { "@id": PERSON_ID },
	};
	return {
		"@context": "https://schema.org",
		"@graph": [person, website] as const,
	};
}

export function blogPostingJsonLd(post: PostSummary) {
	const url = absoluteUrl(post.url);
	return {
		"@context": "https://schema.org",
		"@type": "BlogPosting",
		headline: post.title,
		description: post.description,
		datePublished: post.date,
		url,
		mainEntityOfPage: url,
		// Only a post's own image represents it; the generic blog card stays a social card.
		...(post.image ? { image: absoluteUrl(post.image) } : {}),
		keywords: post.tags.length ? post.tags.join(", ") : undefined,
		inLanguage: "en",
		author,
		isPartOf: { "@id": WEBSITE_ID },
	};
}

export function retrospectiveJsonLd(retrospective: Retrospective) {
	const url = absoluteUrl(`/remembering/${retrospective.slug}`);
	return {
		"@context": "https://schema.org",
		"@type": "Article",
		headline: retrospective.metaTitle,
		description: retrospective.metaDescription,
		url,
		mainEntityOfPage: url,
		image: absoluteUrl(OG_IMAGES[retrospective.ogImage].url),
		temporalCoverage: retrospective.years.replace(" to ", "/"),
		inLanguage: "en",
		author,
		isPartOf: { "@id": WEBSITE_ID },
	};
}
