import { Quote } from "lucide-react";
import type { ReactNode } from "react";

export function Blockquote({
	icon,
	children,
}: {
	icon?: ReactNode;
	children?: ReactNode;
}) {
	return (
		// mt-1 optically aligns the mark with the first cap line.
		<figure className="not-prose my-10 flex gap-4 sm:gap-5">
			<span aria-hidden="true" className="mt-1 shrink-0 text-noon-sun">
				{icon ? (
					<span className="block text-3xl leading-none">{icon}</span>
				) : (
					// rotate-180 turns lucide's closing marks into opening ones.
					<Quote className="size-7 rotate-180 fill-current stroke-none" />
				)}
			</span>
			<blockquote className="flex-1 space-y-4 text-lg text-pale-dune leading-[1.65] [&_p]:m-0">
				{children}
			</blockquote>
		</figure>
	);
}
