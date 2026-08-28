import { NotFoundBeacon } from "@/components/not-found/not-found-beacon";
import { NotFoundScene } from "@/components/not-found/not-found-scene";
import { SiteHeader } from "@/components/site-header";

/**
 * Unmatched routes render outside the (with-header) group, so the header must mount
 * here explicitly or lost visitors get a bare page with no way home.
 */
export default function NotFound() {
	return (
		<>
			<SiteHeader onDarkSurface />
			<NotFoundScene />
			<NotFoundBeacon />
		</>
	);
}
