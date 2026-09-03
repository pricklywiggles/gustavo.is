"use client";

import { BarHost } from "@/components/bar-host";
import { SKY_BAR } from "@/components/bar-themes";
import { INNER_TEXT_LINKS } from "@/lib/site-links";

/** The blog index lives outside (with-header), so it brings its own bar. */
export function BlogHeader() {
	return (
		<BarHost links={INNER_TEXT_LINKS} showContact>
			{(bar) => <div className="sticky top-0 z-bar">{bar(SKY_BAR)}</div>}
		</BarHost>
	);
}
