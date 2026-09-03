import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";

// Off Vercel, checkBotId() has no request context and logs a misconfiguration warning per call.
const botId = vi.hoisted(() => ({ verdict: { isBot: false } }));
vi.mock("botid/server", () => ({
	checkBotId: async () => botId.verdict,
}));

function jsonRequest(body: unknown) {
	return new Request("http://localhost/api/contact", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify(body),
	});
}

describe("POST /api/contact", () => {
	afterEach(() => {
		vi.unstubAllEnvs();
		botId.verdict = { isBot: false };
	});

	it("rejects a submission missing required fields", async () => {
		const response = await POST(
			jsonRequest({ name: "", email: "not-an-email", message: "" }),
		);
		expect(response.status).toBe(400);
	});

	it("returns ok without sending when the honeypot field is filled", async () => {
		const response = await POST(
			jsonRequest({
				name: "Ada",
				email: "ada@example.com",
				message: "Hello",
				website: "http://spam.example",
			}),
		);
		expect(response.status).toBe(200);
		expect(await response.json()).toEqual({ ok: true });
	});

	it("returns 403 when BotID flags the request", async () => {
		botId.verdict = { isBot: true };
		const response = await POST(
			jsonRequest({ name: "Ada", email: "ada@example.com", message: "Hello" }),
		);
		expect(response.status).toBe(403);
		expect(await response.json()).toEqual({ error: "Request blocked" });
	});

	it("returns 500 when RESEND_API_KEY is not configured", async () => {
		vi.stubEnv("RESEND_API_KEY", "");
		vi.stubEnv("CONTACT_EMAIL_TO", "inbox@example.com");
		vi.stubEnv("RESEND_FROM", "site@example.com");
		const response = await POST(
			jsonRequest({ name: "Ada", email: "ada@example.com", message: "Hello" }),
		);
		expect(response.status).toBe(500);
		expect((await response.json()).error).toContain("RESEND_API_KEY");
	});

	it("returns 500 naming the missing address vars", async () => {
		vi.stubEnv("RESEND_API_KEY", "re_test");
		vi.stubEnv("CONTACT_EMAIL_TO", "");
		vi.stubEnv("RESEND_FROM", "");
		const response = await POST(
			jsonRequest({ name: "Ada", email: "ada@example.com", message: "Hello" }),
		);
		expect(response.status).toBe(500);
		expect((await response.json()).error).toContain(
			"CONTACT_EMAIL_TO, RESEND_FROM missing",
		);
	});
});
