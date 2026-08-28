"use client";

import { useEffect, useRef, useState } from "react";
import { PlayBadge } from "@/components/play-badge";
import { EVENTS, track } from "@/lib/analytics";
import { FOCUS_RING } from "@/lib/focus-ring";

/**
 * Click-to-load facade: the old site mounted every walkthrough iframe at once,
 * so the page paid for five players nobody had asked for.
 */
export function VideoEmbed({
	src,
	title,
	name,
	poster,
}: {
	src: string;
	title: string;
	name: string;
	poster?: string;
}) {
	const [playing, setPlaying] = useState(false);
	const frame = useRef<HTMLIFrameElement>(null);
	// Ponder Blogs names a feature "Walkthrough"; don't render "walkthrough walkthrough".
	const lowered = name.toLowerCase();
	const facadeLabel = lowered.endsWith("walkthrough")
		? `Play the ${lowered}`
		: `Play the ${lowered} walkthrough`;

	// The facade unmounts on click, so focus would otherwise fall back to body.
	useEffect(() => {
		if (playing) frame.current?.focus();
	}, [playing]);

	return (
		<div className="relative aspect-video w-full overflow-hidden rounded-xl border border-pale-dune/20 bg-dusk-earth/40">
			{playing ? (
				<iframe
					ref={frame}
					// autoplay is only ever reached through the visitor's own click.
					src={`${src}?autoplay=1`}
					title={title}
					allow="autoplay; fullscreen; picture-in-picture"
					allowFullScreen
					className="absolute inset-0 size-full"
				/>
			) : (
				<button
					type="button"
					onClick={() => {
						setPlaying(true);
						track(EVENTS.videoPlayed, { video: name });
					}}
					className={`group absolute inset-0 grid w-full place-items-center overflow-hidden transition-colors duration-200 hover:bg-pale-dune/5 ${FOCUS_RING.dark}`}
				>
					{poster ? (
						<span
							aria-hidden="true"
							className="absolute inset-0 bg-center bg-cover opacity-80 transition-opacity duration-300 group-hover:opacity-95 motion-reduce:transition-none"
							style={{ backgroundImage: `url(${poster})` }}
						/>
					) : null}
					{/* Flat tint keeps the play affordance readable on any frame. */}
					<span
						aria-hidden="true"
						className="absolute inset-0 bg-dusk-earth/35"
					/>
					<span className="relative flex flex-col items-center gap-3">
						<PlayBadge />
						<span className="font-medium text-[0.8125rem] tracking-[0.01em] text-pale-dune/90">
							{facadeLabel}
						</span>
					</span>
				</button>
			)}
		</div>
	);
}
