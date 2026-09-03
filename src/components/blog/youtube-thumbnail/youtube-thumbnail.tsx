"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeThumbnailUrl } from "@/lib/youtube";

/** maxresdefault exists only for HD sources; hqdefault's 4:3 bars fall to object-cover. */
export function YoutubeThumbnail({ videoId }: { videoId: string }) {
	const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">(
		"maxresdefault",
	);
	return (
		<Image
			src={youtubeThumbnailUrl(videoId, quality)}
			// Decorative: the card's own text labels the link.
			alt=""
			fill
			sizes="(min-width: 40rem) 36rem, 100vw"
			className="object-cover"
			onError={() => setQuality("hqdefault")}
		/>
	);
}
