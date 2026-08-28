"use client";

import Image from "next/image";
import { useState } from "react";
import { youtubeThumbnailUrl } from "@/lib/youtube";

/**
 * maxresdefault only exists for HD sources, so a load error swaps to hqdefault (its 4:3
 * bars fall to object-cover). Alt stays empty: the card's own text labels the link.
 */
export function YoutubeThumbnail({ videoId }: { videoId: string }) {
	const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">(
		"maxresdefault",
	);
	return (
		<Image
			src={youtubeThumbnailUrl(videoId, quality)}
			alt=""
			fill
			sizes="(min-width: 40rem) 36rem, 100vw"
			className="object-cover"
			onError={() => setQuality("hqdefault")}
		/>
	);
}
