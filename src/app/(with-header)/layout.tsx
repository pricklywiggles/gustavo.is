import { SiteHeader } from "@/components/site-header";

/**
 * Every route with the overlaid header lives in this group; the blog index sits outside
 * it, so header ownership is decided by route structure instead of pathname checks.
 */
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
