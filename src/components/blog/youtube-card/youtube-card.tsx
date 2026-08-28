import { YoutubeThumbnail } from "@/components/blog/youtube-thumbnail";
import { PlayBadge } from "@/components/play-badge";
import { FOCUS_RING } from "@/lib/focus-ring";
import {
	fetchYoutubeTitle,
	youtubeVideoId,
	youtubeWatchUrl,
} from "@/lib/youtube";

/**
 * A thumbnail link through the same-origin /_next/image proxy, so visitors make zero
 * Google requests; the oEmbed title runs once at build, `title` the author's fallback.
 */
export async function YouTube({ url, title }: { url: string; title?: string }) {
	const videoId = youtubeVideoId(url);
	const watchUrl = youtubeWatchUrl(videoId);
	const displayTitle = (await fetchYoutubeTitle(watchUrl)) ?? title;

	return (
		<a
			href={watchUrl}
			target="_blank"
			rel="noreferrer"
			className={`not-prose group my-7 block rounded-xl ${FOCUS_RING.dark}`}
		>
			<span className="relative block aspect-video overflow-hidden rounded-xl bg-dusk-ink">
				<YoutubeThumbnail videoId={videoId} />
				{/* Flat tint keeps the play affordance readable on any frame. */}
				<span
					aria-hidden="true"
					className="absolute inset-0 bg-dusk-earth/35 transition-colors duration-200 group-hover:bg-dusk-earth/20 motion-reduce:transition-none"
				/>
				<span className="absolute inset-0 grid place-items-center">
					<PlayBadge size="lg" />
				</span>
			</span>
			<span className="mt-3 block">
				{displayTitle ? (
					<span className="block font-medium text-pale-dune leading-snug transition-colors duration-200 group-hover:text-first-light">
						{displayTitle}
					</span>
				) : null}
				<span className="mt-1 block font-legend text-[0.8125rem] text-noon-sun tracking-[0.01em]">
					Watch on YouTube
				</span>
			</span>
		</a>
	);
}
