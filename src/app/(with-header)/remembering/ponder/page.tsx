import { PONDER } from "@/components/retrospective/retrospective-data";
import { RetrospectivePage } from "@/components/retrospective/retrospective-page";
import { retrospectiveMetadata } from "@/lib/site-metadata";

export const metadata = retrospectiveMetadata(PONDER);

export default function PonderRetrospective() {
	return <RetrospectivePage retrospective={PONDER} />;
}
