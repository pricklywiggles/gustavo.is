import { z } from "zod";

// `website` is the honeypot, unconstrained: a schema error would preempt the silent branch.
export const contactSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(200),
	email: z.email("Enter a valid email address"),
	message: z.string().trim().min(1, "Message is required").max(5000),
	website: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
