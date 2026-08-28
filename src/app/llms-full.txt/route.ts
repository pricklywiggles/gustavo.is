import { llmsFullText } from "@/lib/llms-content";

export const dynamic = "force-static";

export async function GET() {
	return new Response(await llmsFullText(), {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			// Duplicates every page's text; the HTML pages stay the indexed copies.
			"x-robots-tag": "noindex",
		},
	});
}
