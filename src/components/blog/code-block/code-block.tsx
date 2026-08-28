"use client";

import { Check, Copy } from "lucide-react";
import {
	type ComponentProps,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	CodeBlockTabContext,
	codeFrameClass,
} from "@/components/blog/code-block-tabs";
import { FOCUS_RING } from "@/lib/focus-ring";
import { cn } from "@/lib/utils";

/** rehype-code meta lands as props on the pre element: `title="file.ts"`
 * arrives verbatim and `noCopy` arrives as allowCopy="false". */
type CodeBlockProps = ComponentProps<"pre"> & {
	title?: string;
	allowCopy?: string;
};

/**
 * The MDX `pre` replacement. Inside a CodeBlockTab panel the tabs frame
 * owns the chrome, so the block drops its own.
 */
export function CodeBlock({
	title,
	allowCopy,
	className,
	children,
	...rest
}: CodeBlockProps) {
	const inTabs = useContext(CodeBlockTabContext);
	const pre = useRef<HTMLPreElement>(null);
	const resetTimer = useRef<number | undefined>(undefined);
	const [copied, setCopied] = useState(false);

	useEffect(() => () => window.clearTimeout(resetTimer.current), []);

	const copy = async () => {
		const text = pre.current?.textContent;
		if (!text) return;
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			window.clearTimeout(resetTimer.current);
			resetTimer.current = window.setTimeout(() => setCopied(false), 2000);
		} catch {
			// No clipboard (permissions, insecure context): the button rests.
		}
	};

	return (
		<figure className={cn("not-prose group", !inTabs && codeFrameClass)}>
			{title ? (
				<figcaption
					className={cn(
						"px-4 py-2 font-medium text-[0.8125rem] tracking-[0.01em]",
						// Standalone strips share the tabs header's Dune Tan; inside a
						// panel the strip sits on the frame's ink.
						inTabs ? "text-pale-dune/85" : "bg-dune-tan text-dusk-ink",
					)}
				>
					{title}
				</figcaption>
			) : null}
			<div className="relative">
				<pre
					ref={pre}
					className={cn(
						"overflow-x-auto p-4 text-[0.8125rem] leading-[1.7]",
						className,
					)}
					{...rest}
				>
					{children}
				</pre>
				{allowCopy !== "false" ? (
					<button
						type="button"
						onClick={copy}
						aria-label={copied ? "Copied" : "Copy code"}
						className={cn(
							"absolute top-2 right-2 rounded-md p-2 text-pale-dune/70 transition-[color,background-color,opacity] duration-150 hover:bg-pale-dune/10 hover:text-pale-dune active:translate-y-px active:shadow-pressed motion-reduce:transition-none",
							// Hide-until-hover only where hover exists: on touch the
							// button must rest visible or it cannot be discovered.
							copied
								? "opacity-100"
								: "pointer-fine:opacity-0 pointer-fine:focus-visible:opacity-100 pointer-fine:group-hover:opacity-100",
							FOCUS_RING.dark,
						)}
					>
						{copied ? (
							<Check aria-hidden="true" className="size-4" />
						) : (
							<Copy aria-hidden="true" className="size-4" />
						)}
					</button>
				) : null}
			</div>
		</figure>
	);
}
