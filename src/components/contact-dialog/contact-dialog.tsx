"use client";

import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { type ContactSource, EVENTS, track } from "@/lib/analytics";
import { rampColor } from "@/lib/ramp";

const DUSK_EARTH = rampColor("dusk-earth");
// Sized well past the morph spring's tail, so the fallback never fires mid-spring.
const SETTLE_DEADLINE_MS = 2000;
// The trigger's hover (Dusk Earth 85% over Pale Dune) composites to almost exactly this.
const CANYON_BROWN = rampColor("canyon-brown");

export function ContactDialog({
	open,
	onOpenChange,
	source,
	morphId = null,
	initialColor = DUSK_EARTH,
	settledColor = CANYON_BROWN,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	source: ContactSource;
	/** Trigger's shared layout id: each trigger needs its own, under a domMax provider. */
	morphId?: string | null;
	/** initialColor must match the trigger's surface; defaults fit the say-hello trigger. */
	initialColor?: string;
	settledColor?: string;
}) {
	const reducedMotion = useReducedMotionLive();
	const [settled, setSettled] = useState(false);
	const morphing = !reducedMotion && morphId != null;
	const fading = !morphing && !reducedMotion;

	useEffect(() => {
		if (open) track(EVENTS.contactOpened, { source });
	}, [open, source]);

	// Every reduced-motion exit must be instant: AnimatePresence waits out the slowest tween.
	const popupMotion = reducedMotion
		? {
				initial: false as const,
				animate: { backgroundColor: settledColor },
				exit: { opacity: 0, transition: { duration: 0 } },
				transition: { duration: 0 },
			}
		: fading
			? {
					initial: {
						opacity: 0,
						scale: 0.97,
						y: 16,
						backgroundColor: settledColor,
					},
					animate: {
						opacity: 1,
						scale: 1,
						y: 0,
						backgroundColor: settledColor,
					},
					exit: { opacity: 0, scale: 0.97, y: 16 },
					transition: {
						type: "spring" as const,
						bounce: 0.2,
						visualDuration: 0.3,
					},
				}
			: {
					initial: { backgroundColor: morphing ? initialColor : settledColor },
					animate: { backgroundColor: settledColor },
					// With no trigger the popup would close on a color it never wore.
					exit: {
						backgroundColor: morphId == null ? settledColor : initialColor,
					},
					transition: {
						type: "spring" as const,
						bounce: 0.34,
						visualDuration: 0.5,
						backgroundColor: { duration: 0.3 },
					},
				};

	// onLayoutAnimationComplete is unreliable for layoutId morphs; a fixed timer lands mid-tail.
	useEffect(() => {
		if (!open) {
			setSettled(false);
			return;
		}
		if (reducedMotion) {
			setSettled(true);
			return;
		}
		let raf = 0;
		let last = "";
		let stableFrames = 0;
		const deadline = performance.now() + SETTLE_DEADLINE_MS;
		let popup: Element | null = null;
		const tick = () => {
			// A missing popup would otherwise keep the watcher spinning for the dialog's life.
			if (performance.now() > deadline) {
				setSettled(true);
				return;
			}
			// The popup element is stable once mounted.
			if (popup && !popup.isConnected) popup = null;
			popup ??= document.querySelector('[role="dialog"]');
			if (popup) {
				const r = popup.getBoundingClientRect();
				const key = `${r.x.toFixed(1)},${r.y.toFixed(1)},${r.width.toFixed(1)},${r.height.toFixed(1)}`;
				stableFrames = key === last ? stableFrames + 1 : 0;
				last = key;
				if (stableFrames >= 6) {
					setSettled(true);
					return;
				}
			}
			raf = requestAnimationFrame(tick);
		};
		raf = requestAnimationFrame(tick);
		return () => cancelAnimationFrame(raf);
	}, [open, reducedMotion]);

	return (
		<AnimatePresence>
			{open && (
				<Dialog.Root open onOpenChange={onOpenChange}>
					<Dialog.Portal>
						<Dialog.Backdrop
							className="fixed inset-0 z-overlay bg-dusk-ink/40 backdrop-blur-sm"
							render={
								<m.div
									initial={reducedMotion ? false : { opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{
										opacity: 0,
										transition: { duration: reducedMotion ? 0 : 0.25 },
									}}
									transition={{ duration: 0.25 }}
								/>
							}
						/>
						{/* Grid centering so Motion's layout projection owns the popup's transform. */}
						<div className="pointer-events-none fixed inset-0 z-dialog grid place-items-center p-4">
							<Dialog.Popup
								className="pointer-events-auto w-full max-w-md border border-first-light/15 p-6"
								render={
									<m.div
										layoutId={morphing ? morphId : undefined}
										style={{ borderRadius: 14 }}
										{...popupMotion}
									/>
								}
							>
								{/* Content arrives just after the morph leads and gets out of the way
								    instantly on close. */}
								<m.div
									initial={reducedMotion ? false : { opacity: 0 }}
									animate={{
										opacity: 1,
										transition: { delay: morphing ? 0.16 : 0, duration: 0.25 },
									}}
									exit={{
										opacity: 0,
										transition: { duration: reducedMotion ? 0 : 0.08 },
									}}
								>
									<Dialog.Title className="font-bold font-display text-2xl text-first-light tracking-[-0.01em]">
										Say hello
									</Dialog.Title>
									<Dialog.Description className="mt-1 text-first-light/75 text-sm">
										I read everything that lands here. Tell me what you are
										building.
									</Dialog.Description>
									<div className="mt-5">
										<ContactForm
											tone="dark"
											source={source}
											onCancel={() => onOpenChange(false)}
											motionReady={reducedMotion || settled}
										/>
									</div>
								</m.div>
							</Dialog.Popup>
						</div>
					</Dialog.Portal>
				</Dialog.Root>
			)}
		</AnimatePresence>
	);
}
