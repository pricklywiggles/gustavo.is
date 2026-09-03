"use client";

import dynamic from "next/dynamic";
import { useCallback, useState } from "react";

export const ContactDialog = dynamic(() =>
	import("@/components/contact-dialog").then((mod) => mod.ContactDialog),
);

/** Chunk warm-up for touch, where a tap gives no hover-intent beat. */
export function warmContactDialog() {
	void import("@/components/contact-dialog");
}

/** `mounted` never resets: the exit animation needs its tree after close. */
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
