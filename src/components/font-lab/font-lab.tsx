"use client";

import { Dialog } from "@base-ui/react/dialog";
import { Type, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FOCUS_RING } from "@/lib/focus-ring";
import { FACES, type FaceId } from "./font-lab-faces";

const ROLES = [
	{ id: "sans", label: "Sans", hint: "body copy" },
	{ id: "display", label: "Display", hint: "the quote and section titles" },
	{ id: "legend", label: "Legend", hint: "uppercase instruments" },
] as const;

type RoleId = (typeof ROLES)[number]["id"];
type Assignment = Record<RoleId, FaceId>;

const DEFAULTS: Assignment = {
	sans: "wotfard",
	display: "kitora",
	legend: "kitora",
};

// Suffixed: a stale entry from the earlier role shape would mask the new defaults.
const STORAGE_KEY = "font-lab-3";

// The lab's chrome must stay legible whatever the roles are set to.
const CHROME = { fontFamily: "ui-sans-serif, system-ui, sans-serif" };

function apply(assignment: Assignment) {
	for (const role of ROLES) {
		document.documentElement.style.setProperty(
			`--font-${role.id}`,
			`var(--font-${assignment[role.id]})`,
		);
	}
}

function read(): Assignment {
	const stored = localStorage.getItem(STORAGE_KEY);
	if (!stored) return DEFAULTS;
	const parsed = JSON.parse(stored) as Partial<Assignment>;
	const ids = new Set<string>(FACES.map((f) => f.id));
	return Object.fromEntries(
		ROLES.map((role) => [
			role.id,
			ids.has(parsed[role.id] ?? "") ? parsed[role.id] : DEFAULTS[role.id],
		]),
	) as Assignment;
}

/** Non-modal on purpose: faces are judged against the real page. */
export function FontLab() {
	const [open, setOpen] = useState(false);
	const [assignment, setAssignment] = useState<Assignment>(DEFAULTS);

	useEffect(() => {
		const restored = read();
		setAssignment(restored);
		apply(restored);
	}, []);

	const assign = (role: RoleId, face: FaceId) => {
		const next = { ...assignment, [role]: face };
		setAssignment(next);
		apply(next);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
	};

	const reset = () => {
		setAssignment(DEFAULTS);
		apply(DEFAULTS);
		localStorage.removeItem(STORAGE_KEY);
	};

	return (
		<Dialog.Root open={open} onOpenChange={setOpen} modal={false}>
			<Dialog.Trigger
				aria-label="Font lab"
				style={CHROME}
				// bottom-20, not bottom-4: Next's dev indicator owns the corner.
				className={`fixed bottom-20 left-4 z-dev flex size-10 items-center justify-center rounded-full border border-dusk-ink/15 bg-first-light text-dusk-earth shadow-md transition-colors hover:text-dusk-ink ${FOCUS_RING.light}`}
			>
				<Type className="size-[18px]" />
			</Dialog.Trigger>
			<Dialog.Portal>
				<Dialog.Popup
					style={CHROME}
					className="fixed bottom-20 left-4 z-dev flex max-h-[min(40rem,88vh)] w-[min(30rem,calc(100vw-2rem))] flex-col rounded-xl border border-dusk-ink/15 bg-first-light text-dusk-ink text-sm shadow-2xl focus-visible:outline-none"
				>
					<header className="flex items-center gap-3 border-dusk-ink/10 border-b px-4 py-3">
						<Dialog.Title className="font-semibold">Font lab</Dialog.Title>
						<button
							type="button"
							onClick={reset}
							className="ml-auto rounded-md px-2 py-1 text-dusk-earth text-xs hover:bg-sand-haze"
						>
							Reset
						</button>
						<Dialog.Close
							aria-label="Close"
							className="flex size-7 items-center justify-center rounded-md text-dusk-earth hover:bg-sand-haze"
						>
							<X className="size-4" />
						</Dialog.Close>
					</header>

					<div className="overflow-y-auto px-4 pb-4">
						<table className="w-full border-collapse">
							<thead className="sticky top-0 bg-first-light">
								<tr className="text-dusk-earth text-xs uppercase tracking-wide">
									<th className="py-2 text-left font-semibold">Face</th>
									{ROLES.map((role) => (
										<th
											key={role.id}
											title={role.hint}
											className="w-16 py-2 font-semibold"
										>
											{role.label}
										</th>
									))}
								</tr>
							</thead>
							<tbody>
								{FACES.map((face) => (
									<tr key={face.id} className="border-dusk-ink/10 border-t">
										<td className="py-2 pr-3">
											<div
												className="truncate text-lg leading-tight"
												style={{ fontFamily: `var(--font-${face.id})` }}
											>
												{face.label}
											</div>
											<div
												className="truncate text-dusk-earth text-xs leading-tight"
												style={{ fontFamily: `var(--font-${face.id})` }}
											>
												ABCDEFG abcdefg 0123
											</div>
										</td>
										{ROLES.map((role) => (
											<td key={role.id} className="text-center">
												<input
													type="radio"
													name={`font-lab-${role.id}`}
													aria-label={`${face.label} as ${role.label}`}
													checked={assignment[role.id] === face.id}
													onChange={() => assign(role.id, face.id)}
													className="size-4 accent-horizon-blaze"
												/>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</Dialog.Popup>
			</Dialog.Portal>
		</Dialog.Root>
	);
}
