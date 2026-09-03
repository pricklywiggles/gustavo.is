import { SiteHeader } from "@/components/site-header";

/** The blog index opts out by sitting outside this group: no pathname checks. */
export default function WithHeaderLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<>
			<SiteHeader />
			{children}
		</>
	);
}
