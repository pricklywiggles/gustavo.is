import { checkBotId } from "botid/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";

// Recipient and sender come only from env, never from the request body (a caller-chosen
// recipient turns this into an open relay) and never from the repo (no address on GitHub).
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

	// Honeypot: a real visitor never fills this. Return success without
	// sending anything, so a bot gets no signal that it was caught.
	if (parsed.data.website) {
		return NextResponse.json({ ok: true });
	}

	// checkBotId() needs Vercel's edge infra, absent outside a real deployment. Fail open
	// (treat as not-a-bot) rather than break the endpoint locally; on Vercel this enforces.
	try {
		const verdict = await checkBotId();
		if (verdict.isBot) {
			return NextResponse.json({ error: "Request blocked" }, { status: 403 });
		}
	} catch {
		// No bot-detection infra in this environment.
	}

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
