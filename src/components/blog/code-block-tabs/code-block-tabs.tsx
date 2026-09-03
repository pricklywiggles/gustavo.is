"use client";

import { Tabs } from "@base-ui/react/tabs";
import { createContext, type ReactNode } from "react";

export const CodeBlockTabContext = createContext(false);

export const codeFrameClass = "my-7 overflow-hidden rounded-xl bg-dusk-ink";

/** remarkCodeTab emits this: consecutive tab="Label" fences become one CodeBlockTabs. */
export function CodeBlockTabs({
	defaultValue,
	children,
}: {
	defaultValue?: string;
	children?: ReactNode;
}) {
	return (
		<Tabs.Root
			defaultValue={defaultValue}
			className={`not-prose ${codeFrameClass}`}
		>
			{children}
		</Tabs.Root>
	);
}

export function CodeBlockTabsList({ children }: { children?: ReactNode }) {
	return (
		// ml-auto, not justify-end: overflowing labels would scroll out of reach at the start.
		<Tabs.List className="relative flex items-center gap-x-1 overflow-x-auto bg-dune-tan px-2 py-1.5 [&>*:first-child]:ml-auto">
			{children}
			{/* The indicator IS the active pill, sliding between labels. */}
			<Tabs.Indicator className="absolute inset-y-1.5 left-0 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] rounded-full bg-dusk-ink transition-all duration-300 ease-out motion-reduce:transition-none" />
		</Tabs.List>
	);
}

export function CodeBlockTabsTrigger({
	value,
	children,
}: {
	value: string;
	children?: ReactNode;
}) {
	return (
		<Tabs.Tab
			value={value}
			// Only Dusk Ink clears AA for 13px on Dune Tan; the blaze focus ring is invisible here.
			className="relative z-[1] shrink-0 rounded-full px-3 py-1 font-medium text-[0.8125rem] text-dusk-ink tracking-[0.01em] transition-colors duration-200 not-data-[active]:hover:bg-desert-clay data-[active]:text-pale-dune focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dusk-ink"
		>
			{children}
		</Tabs.Tab>
	);
}

export function CodeBlockTab({
	value,
	children,
}: {
	value: string;
	children?: ReactNode;
}) {
	return (
		// keepMounted so every tab's code ships in the prerendered HTML.
		<Tabs.Panel value={value} keepMounted>
			<CodeBlockTabContext.Provider value={true}>
				{children}
			</CodeBlockTabContext.Provider>
		</Tabs.Panel>
	);
}
