import { llmsFullText } from "@/lib/llms-content";

export const dynamic = "force-static";

export async function GET() {
	return new Response(await llmsFullText(), {
		headers: {
			"content-type": "text/plain; charset=utf-8",
			"x-robots-tag": "noindex",
		},
	});
}
