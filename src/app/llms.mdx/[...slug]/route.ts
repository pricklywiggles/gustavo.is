import { markdownPages, pageMarkdown } from "@/lib/llms-content";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
	return markdownPages().map((path) => ({ slug: path.slice(1).split("/") }));
}

export async function GET(
	_request: Request,
	{ params }: { params: Promise<{ slug: string[] }> },
) {
	const { slug } = await params;
	const markdown = await pageMarkdown(`/${slug.join("/")}`);
	if (!markdown) return new Response("Not found", { status: 404 });
	return new Response(markdown, {
		headers: {
			"content-type": "text/markdown; charset=utf-8",
			// The HTML page is the canonical copy.
			"x-robots-tag": "noindex",
		},
	});
}
