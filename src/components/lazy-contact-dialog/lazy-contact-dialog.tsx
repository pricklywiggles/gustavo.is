"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

/**
 * One lazy ContactDialog for every host: the chunk (form, zod, Base UI dialog, full
 * motion path) stays out of each page's initial bundle until a trigger shows intent.
 */
export const ContactDialog = dynamic(() =>
	import("@/components/contact-dialog").then((mod) => mod.ContactDialog),
);

/** Idempotent chunk warm-up for touch, where a tap gives no hover-intent beat: call it
 * when the visitor plausibly heads for a trigger. */
export function warmContactDialog() {
	void import("@/components/contact-dialog");
}

/**
 * Mount on the first sign of intent so the fetch overlaps the approach; open on click
 * (which also mounts). `mounted` never resets, so the exit animation keeps its tree.
 */
export function useContactDialogState() {
	const [open, setOpen] = useState(false);
	const [mounted, setMounted] = useState(false);
	const onIntent = useCallback(() => setMounted(true), []);
	const openDialog = useCallback(() => {
		setMounted(true);
		setOpen(true);
	}, []);
	return { open, setOpen, mounted, onIntent, openDialog };
}
