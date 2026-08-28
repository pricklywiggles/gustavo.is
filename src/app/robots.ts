import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

// Every crawler, AI ones included, may read the public pages: the site exists to be found.
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
