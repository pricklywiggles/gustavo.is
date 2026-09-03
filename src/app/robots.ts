import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// AI crawlers stay allowed on purpose: the site exists to be found.
export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: "*",
			allow: "/",
			disallow: ["/api/", "/sentry-tunnel"],
		},
		sitemap: absoluteUrl("/sitemap.xml"),
	};
}
