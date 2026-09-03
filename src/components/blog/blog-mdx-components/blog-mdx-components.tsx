import type { MDXComponents } from "mdx/types";
import Image, { type StaticImageData } from "next/image";
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

/** The unlayered `.site-link` color beats any `text-*` in className: callers cannot recolor. */
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

/** A wrapper, not `display: block` on the table: that strips row/column semantics for AT. */
function MdxTable(props: ComponentProps<"table">) {
	return (
		<div className="overflow-x-auto">
			<table {...props} />
		</div>
	);
}

type MdxImageProps = Omit<ComponentProps<"img">, "src" | "width" | "height"> & {
	/** A StaticImageData when remarkImage turned `![](./file.webp)` into an import. */
	src?: string | StaticImageData;
	width?: number | string;
	height?: number | string;
};

/** A native <img> would stringify remarkImage's imported objects to "[object Object]". */
function MdxImage({
	src,
	alt = "",
	width,
	height,
	title,
	className,
}: MdxImageProps) {
	if (!src) return null;
	const shared = {
		alt,
		title,
		className,
		sizes: "(min-width: 48rem) 42rem, 100vw",
	};
	if (typeof src !== "string") return <Image src={src} {...shared} />;
	const w = Number(width);
	const h = Number(height);
	if (!w || !h) {
		throw new Error(
			`Image "${src}" has no dimensions; use a ./ path to a file in the post's folder.`,
		);
	}
	return <Image src={src} width={w} height={h} {...shared} />;
}

/** The CodeBlockTab* keys must match the element names remarkCodeTab emits. */
export const blogMdxComponents: MDXComponents = {
	a: MdxLink,
	blockquote: Blockquote,
	// MDX types img src as string only.
	img: MdxImage as MDXComponents["img"],
	pre: CodeBlock,
	table: MdxTable,
	Blockquote,
	CodeBlockTab,
	CodeBlockTabs,
	CodeBlockTabsList,
	CodeBlockTabsTrigger,
	YouTube,
};
