import { NotFoundBeacon } from "@/components/not-found/not-found-beacon";
import { NotFoundScene } from "@/components/not-found/not-found-scene";
import { SiteHeader } from "@/components/site-header";

/** Unmatched routes render outside the (with-header) group, so the header mounts here. */
export default function NotFound() {
	return (
		<>
			<SiteHeader onDarkSurface />
			<NotFoundScene />
			<NotFoundBeacon />
		</>
	);
}
