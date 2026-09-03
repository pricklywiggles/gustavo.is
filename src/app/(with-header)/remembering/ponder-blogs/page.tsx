import { PONDER_BLOGS } from "@/components/retrospective/retrospective-data";
import { RetrospectivePage } from "@/components/retrospective/retrospective-page";
import { retrospectiveMetadata } from "@/lib/site-metadata";

export const metadata = retrospectiveMetadata(PONDER_BLOGS);

export default function PonderBlogsRetrospective() {
	return <RetrospectivePage retrospective={PONDER_BLOGS} />;
}
