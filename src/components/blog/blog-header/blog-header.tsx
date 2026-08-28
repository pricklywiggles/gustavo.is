"use client";

import { BarHost } from "@/components/bar-host";
import { SKY_BAR } from "@/components/bar-themes";
import { INNER_TEXT_LINKS } from "@/lib/site-links";

/**
 * The blog index's only header authority (the index lives outside (with-header)): the
 * bar mounts in flow under the panorama hero and sticks at the top; BarHost supplies
 * the menu and dialog, and the bar itself never moves under the bloom.
 */
export function BlogHeader() {
	return (
		<BarHost links={INNER_TEXT_LINKS} showContact>
			{(bar) => <div className="sticky top-0 z-bar">{bar(SKY_BAR)}</div>}
		</BarHost>
	);
}
