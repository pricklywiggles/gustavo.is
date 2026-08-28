import type { MDXComponents } from "mdx/types";
import type { ComponentProps } from "react";
import { Blockquote } from "@/components/blog/blockquote";
import { CodeBlock } from "@/components/blog/code-block";
import {
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
} from "@/components/blog/code-block-tabs";
import { YouTube } from "@/components/blog/youtube-card";
import { CurtainLink } from "@/components/curtain-link";
import { textLink } from "@/lib/link";
import { cn } from "@/lib/utils";

/** The blog content link: every anchor in a post renders through this, wearing the
 * textLink recipe's dark tone. The unlayered `.site-link` color beats any `text-*` in
 * className, so callers can't recolor it. */
function MdxLink({
	href = "",
	className,
	children,
	...rest
}: ComponentProps<"a">) {
	const linkClass = cn(textLink({ tone: "dark" }), className);
	// Not "//host": protocol-relative URLs are external, not curtain routes.
	if (href.startsWith("/") && !href.startsWith("//")) {
		return (
			<CurtainLink href={href} className={linkClass} {...rest}>
				{children}
			</CurtainLink>
		);
	}
	if (href.startsWith("#")) {
		return (
			<a href={href} className={linkClass} {...rest}>
				{children}
			</a>
		);
	}
	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			className={linkClass}
			{...rest}
		>
			{children}
		</a>
	);
}

/** The scroll box wraps the table instead of restyling it: `display: block`
 * on the table itself strips its row/column semantics for AT. */
function MdxTable(props: ComponentProps<"table">) {
	return (
		<div className="overflow-x-auto">
			<table {...props} />
		</div>
	);
}

/** The CodeBlockTab* entries must match the element names remarkCodeTab
 * emits for tab="..." fences. */
export const blogMdxComponents: MDXComponents = {
	a: MdxLink,
	blockquote: Blockquote,
	pre: CodeBlock,
	table: MdxTable,
	// Named too, so a post can pass its own mark: <Blockquote icon="...">.
	Blockquote,
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	YouTube,
};
