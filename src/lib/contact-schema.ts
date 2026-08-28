import { z } from "zod";

// Shared between the client form and the route handler so validation can never drift.
// `website` is a honeypot and deliberately unconstrained here: a schema-level rejection
// would surface as a validation error before the route's silent honeypot branch runs.
export const contactSchema = z.object({
	name: z.string().trim().min(1, "Name is required").max(200),
	email: z.email("Enter a valid email address"),
	message: z.string().trim().min(1, "Message is required").max(5000),
	website: z.string().optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
