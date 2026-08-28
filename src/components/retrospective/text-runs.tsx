import { Fragment } from "react";
import { textLink } from "@/lib/link";
import type { Paragraph } from "./retrospective-data";

/** Renders a run list; linked runs take the light text-link recipe. */
export function Runs({ paragraph }: { paragraph: Paragraph }) {
	let offset = 0;
	return paragraph.map((run) => {
		const key = offset;
		offset += typeof run === "string" ? run.length : run.text.length;
		return typeof run === "string" ? (
			<Fragment key={key}>{run}</Fragment>
		) : (
			<a
				key={key}
				href={run.href}
				target="_blank"
				rel="noreferrer"
				className={textLink({ tone: "light" })}
			>
				{run.text}
			</a>
		);
	});
}
