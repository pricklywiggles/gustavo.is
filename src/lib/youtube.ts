const ID_PATTERN = /^[\w-]{11}$/;

/**
 * Throws on anything it cannot parse so a bad URL fails the static build
 * loudly instead of shipping a dead card.
 */
export function youtubeVideoId(url: string): string {
	const parsed = new URL(url);
	const host = parsed.hostname.replace(/^(www|m)\./, "");
	let id: string | undefined;
	if (host === "youtu.be") {
		id = parsed.pathname.split("/")[1];
	} else if (host === "youtube.com" || host === "youtube-nocookie.com") {
		const [, first, second] = parsed.pathname.split("/");
		if (first === "watch") {
			id = parsed.searchParams.get("v") ?? undefined;
		} else if (first === "shorts" || first === "embed" || first === "live") {
			id = second;
		}
	}
	if (!id || !ID_PATTERN.test(id)) {
		throw new Error(`Unrecognized YouTube URL: ${url}`);
	}
	return id;
}

export function youtubeWatchUrl(videoId: string): string {
	return `https://www.youtube.com/watch?v=${videoId}`;
}

export function youtubeThumbnailUrl(
	videoId: string,
	quality: "maxresdefault" | "hqdefault",
): string {
	return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

/**
 * Best-effort oEmbed title lookup at build time. Never throws: the build
 * must not depend on YouTube being reachable.
 */
export async function fetchYoutubeTitle(url: string): Promise<string | null> {
	try {
		const endpoint = `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`;
		const res = await fetch(endpoint, {
			// force-cache keeps the build's fetch on the static path; the
			// result is baked into the prerendered page anyway.
			cache: "force-cache",
			signal: AbortSignal.timeout(4000),
		});
		if (!res.ok) return null;
		const data: unknown = await res.json();
		if (
			data !== null &&
			typeof data === "object" &&
			"title" in data &&
			typeof data.title === "string"
		) {
			return data.title;
		}
		return null;
	} catch {
		return null;
	}
}
