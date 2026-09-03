import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

// Recipient and sender come from env only: a body-chosen recipient makes this an open relay,
// and no address belongs in a public repo.
const REQUIRED_ENV = [
	"RESEND_API_KEY",
	"CONTACT_EMAIL_TO",
	"RESEND_FROM",
] as const;

export async function POST(request: Request) {
	const body = await request.json().catch(() => null);
	if (!body) {
		return NextResponse.json(
			{ error: "Invalid request body" },
			{ status: 400 },
		);
	}

	const parsed = contactSchema.safeParse(body);
	if (!parsed.success) {
		return NextResponse.json(
			{ error: "Invalid submission", issues: parsed.error.issues },
			{ status: 400 },
		);
	}

	// Honeypot: fake success so a bot gets no signal it was caught.
	if (parsed.data.website) {
		return NextResponse.json({ ok: true });
	}

	// checkBotId() needs Vercel infra: fail open locally rather than break the endpoint.
	try {
		const verdict = await checkBotId();
		if (verdict.isBot) {
			return NextResponse.json({ error: "Request blocked" }, { status: 403 });
		}
	} catch {}

	const missing = REQUIRED_ENV.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		return NextResponse.json(
			{
				error: `Email delivery is not configured (${missing.join(", ")} missing)`,
			},
			{ status: 500 },
		);
	}

	const resend = new Resend(process.env.RESEND_API_KEY);
	const { name, email, message } = parsed.data;

	const { error } = await resend.emails.send({
		from: process.env.RESEND_FROM as string,
		to: [process.env.CONTACT_EMAIL_TO as string],
		replyTo: email,
		subject: "New contact form submission",
		text: `From: ${name} <${email}>\n\n${message}`,
	});

	if (error) {
		return NextResponse.json(
			{ error: "Failed to send message" },
			{ status: 502 },
		);
	}

	return NextResponse.json({ ok: true });
}
