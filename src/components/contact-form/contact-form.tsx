"use client";

import { Send } from "lucide-react";
import { useId, useState } from "react";
import { AnimatedButton } from "@/components/animated-button";
import { AnimatedNumber } from "@/components/animated-number";
import { type ContactSource, EVENTS, track } from "@/lib/analytics";
import { contactSchema } from "@/lib/contact-schema";
import { cta } from "@/lib/cta";
import { FOCUS_RING, type Tone } from "@/lib/focus-ring";

type Status = "idle" | "submitting" | "success" | "error";

const MESSAGE_LIMIT = 5000;
const COUNTER_LOW = 250;

/** Warnings use Warning Ember on light, Noon Sun on dark where ember has no contrast. */
const TONES = {
	light: {
		label: "text-dusk-ink",
		error: "text-warning-ember",
		counter: "text-dusk-ink/60",
		counterLow: "text-warning-ember",
		send: "bg-dusk-earth text-first-light hover:bg-dusk-earth/85",
		cancel: "border-dusk-earth/30 text-dusk-ink hover:bg-sand-haze",
		success: "text-dusk-ink",
		ring: FOCUS_RING.light,
	},
	dark: {
		label: "text-first-light",
		error: "text-noon-sun",
		counter: "text-first-light/60",
		counterLow: "text-noon-sun",
		send: "bg-pale-dune text-dusk-earth hover:bg-amber-mirage",
		cancel: "border-first-light/30 text-first-light hover:bg-first-light/10",
		success: "text-first-light",
		ring: FOCUS_RING.dark,
	},
} as const;

const inputClasses =
	"w-full rounded-md border border-sand-line bg-first-light px-3 text-dusk-ink text-sm transition-colors duration-150 focus:border-horizon-blaze";
const labelClasses = "font-medium text-[0.8125rem] tracking-[0.01em]";

export function ContactForm({
	tone,
	source,
	onCancel,
	onSuccess,
	// False while a host morphs: layout animation here would fight the morph.
	motionReady = true,
}: {
	tone: Tone;
	source: ContactSource;
	onCancel?: () => void;
	onSuccess?: () => void;
	motionReady?: boolean;
}) {
	// Two instances can coexist (the dialog over /contact), and duplicate ids cross-wire labels.
	const uid = useId();
	const [status, setStatus] = useState<Status>("idle");
	const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
	const [serverError, setServerError] = useState<string | null>(null);
	const [messageLength, setMessageLength] = useState(0);
	const t = TONES[tone];
	const remaining = MESSAGE_LIMIT - messageLength;

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setServerError(null);

		// React nulls event.currentTarget once the handler yields at an await.
		const form = event.currentTarget;
		const formData = new FormData(form);
		const values = {
			name: String(formData.get("name") ?? ""),
			email: String(formData.get("email") ?? ""),
			message: String(formData.get("message") ?? ""),
			website: String(formData.get("website") ?? ""),
		};

		const result = contactSchema.safeParse(values);
		if (!result.success) {
			const errors: Record<string, string> = {};
			for (const issue of result.error.issues) {
				const key = String(issue.path[0]);
				if (!errors[key]) errors[key] = issue.message;
			}
			setFieldErrors(errors);
			setStatus("error");
			return;
		}
		setFieldErrors({});

		setStatus("submitting");
		try {
			const response = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(result.data),
			});
			if (!response.ok) {
				const body = await response.json().catch(() => ({}));
				setServerError(body.error ?? "Something went wrong. Try again.");
				setStatus("error");
				track(EVENTS.contactFailed, {
					source,
					status: String(response.status),
				});
				return;
			}
			setStatus("success");
			form.reset();
			setMessageLength(0);
			track(EVENTS.contactSent, { source });
		} catch {
			setServerError("Something went wrong. Try again.");
			setStatus("error");
			track(EVENTS.contactFailed, { source, status: "network" });
			return;
		}
		// Outside the try: a throwing onSuccess must not turn a delivered message into an error.
		onSuccess?.();
	}

	if (status === "success") {
		return (
			<p data-testid="contact-success" className={`text-sm ${t.success}`}>
				Message sent. Talk soon.
			</p>
		);
	}

	return (
		<form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
			<div style={{ position: "absolute", left: -9999 }} aria-hidden="true">
				<label htmlFor={`${uid}-website`}>Leave this field empty</label>
				<input
					id={`${uid}-website`}
					name="website"
					tabIndex={-1}
					autoComplete="off"
				/>
			</div>

			<div className="flex flex-col gap-1.5">
				<label htmlFor={`${uid}-name`} className={`${labelClasses} ${t.label}`}>
					Name
				</label>
				<input
					id={`${uid}-name`}
					name="name"
					className={`h-10 ${inputClasses} ${t.ring}`}
				/>
				{fieldErrors.name ? (
					<p className={`text-xs ${t.error}`}>{fieldErrors.name}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				<label
					htmlFor={`${uid}-email`}
					className={`${labelClasses} ${t.label}`}
				>
					Email
				</label>
				<input
					id={`${uid}-email`}
					name="email"
					type="email"
					className={`h-10 ${inputClasses} ${t.ring}`}
				/>
				{fieldErrors.email ? (
					<p className={`text-xs ${t.error}`}>{fieldErrors.email}</p>
				) : null}
			</div>

			<div className="flex flex-col gap-1.5">
				<div className="flex items-baseline justify-between">
					<label
						htmlFor={`${uid}-message`}
						className={`${labelClasses} ${t.label}`}
					>
						Message
					</label>
					{motionReady ? (
						<AnimatedNumber
							className={`text-xs ${
								remaining < COUNTER_LOW ? t.counterLow : t.counter
							}`}
							transition={{ duration: 0.25 }}
						>
							{remaining}
						</AnimatedNumber>
					) : (
						<span
							className={`text-xs tabular-nums ${
								remaining < COUNTER_LOW ? t.counterLow : t.counter
							}`}
						>
							{remaining.toLocaleString()}
						</span>
					)}
				</div>
				<textarea
					id={`${uid}-message`}
					name="message"
					rows={5}
					maxLength={MESSAGE_LIMIT}
					onChange={(event) =>
						setMessageLength(event.currentTarget.value.length)
					}
					className={`py-2 ${inputClasses} ${t.ring}`}
				/>
				{fieldErrors.message ? (
					<p className={`text-xs ${t.error}`}>{fieldErrors.message}</p>
				) : null}
			</div>

			{serverError ? (
				<p className={`text-xs ${t.error}`}>{serverError}</p>
			) : null}

			<div
				className={`mt-2 flex items-center ${onCancel ? "justify-between" : "justify-end"}`}
			>
				{onCancel ? (
					<AnimatedButton
						key={`cancel-${motionReady}`}
						type="button"
						layout={motionReady}
						onClick={onCancel}
						className={`${cta({ variant: "outline", tone })} ${t.cancel}`}
					>
						Cancel
					</AnimatedButton>
				) : null}
				<AnimatedButton
					key={`send-${motionReady}`}
					type="submit"
					layout={motionReady}
					disabled={status === "submitting"}
					className={`group ${cta({ tone })} pl-4 ${t.send}`}
				>
					<Send
						aria-hidden
						className="size-[18px] transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:-rotate-12"
					/>
					{status === "submitting" ? "Sending…" : "Send"}
				</AnimatedButton>
			</div>
		</form>
	);
}
