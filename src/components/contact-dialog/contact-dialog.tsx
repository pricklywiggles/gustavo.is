"use client";

import { Dialog } from "@base-ui/react/dialog";
import { AnimatePresence, m } from "motion/react";
import { useEffect, useState } from "react";
import { ContactForm } from "@/components/contact-form";
import { useReducedMotionLive } from "@/components/use-reduced-motion-live";
import { type ContactSource, EVENTS, track } from "@/lib/analytics";
import { rampColor } from "@/lib/ramp";

const DUSK_EARTH = rampColor("dusk-earth");
// Several times the morph spring's tail; wall clock, so high-refresh displays
// don't hit the fallback while the spring still runs.
const SETTLE_DEADLINE_MS = 2000;
// The trigger's hover (Dusk Earth at 85% over Pale Dune) composites to almost exactly
// Canyon Brown, so the dialog settles on the color of the button just hovered.
const CANYON_BROWN = rampColor("canyon-brown");

/**
 * With morphId the popup morphs from the trigger, the form's layout-animated pieces held
 * static via motionReady until the morph settles; morphId null is a plain fading modal.
 */
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
	/** Which surface opened the dialog; recorded with the contact events. */
	source: ContactSource;
	/** Shared layout id of the trigger to morph from (each trigger needs its own id and
	 * a domMax provider); omitted, the dialog is a plain modal. */
	morphId?: string | null;
	/** Popup background at morph start (match the trigger's surface) and at
	 * rest; defaults match the dusk-earth say-hello trigger. */
	initialColor?: string;
	settledColor?: string;
}) {
	const reducedMotion = useReducedMotionLive();
	const [settled, setSettled] = useState(false);
	const morphing = !reducedMotion && morphId != null;
	// No trigger surface to match, so this path opens on the settled color.
	const fading = !morphing && !reducedMotion;

	useEffect(() => {
		if (open) track(EVENTS.contactOpened, { source });
	}, [open, source]);

	// Reduced motion: every exit is instant, or AnimatePresence holds the popup and
	// backdrop on screen until the slowest tween (the 0.3s color handback) ends.
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
					// Hand the color back only when there is a trigger; with none the popup would
					// close on a color it never wore.
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

	// onLayoutAnimationComplete is unreliable for layoutId morphs and a fixed timer can
	// land mid spring-tail; watch the rect and declare settled after several still frames.
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
			// Past the deadline the morph is long over: settle rather than let a
			// missing popup keep the watcher spinning for the dialog's whole open life.
			if (performance.now() > deadline) {
				setSettled(true);
				return;
			}
			// The popup element is stable once mounted; query until found, then reuse.
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
