import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/** Murals are 1600x2556: an 800px tile is 1278px tall. Change one and the seam tears. */
const TILE_WIDTH = "800px";
const TILE_HEIGHT = "1278px";
const TILT = "-13deg";

/** The plane is oversized so the tilt never exposes an edge; the caller sizes and clips it. */
export function ScrollingMural({
	src,
	className,
}: {
	src: string;
	className?: string;
}) {
	return (
		<div
			aria-hidden="true"
			className={cn("pointer-events-none relative overflow-hidden", className)}
		>
			<div
				data-mural-plane
				className="absolute -top-1/2 -left-1/3 h-[800%] w-[400%] bg-repeat motion-safe:animate-[mural-scroll_35s_linear_infinite] motion-safe:will-change-transform"
				style={
					{
						backgroundImage: `url(${src})`,
						backgroundSize: "var(--mural-tile-w) var(--mural-tile-h)",
						transform: "rotate(var(--mural-tilt))",
						"--mural-tile-w": TILE_WIDTH,
						"--mural-tile-h": TILE_HEIGHT,
						"--mural-tilt": TILT,
					} as CSSProperties
				}
			/>
		</div>
	);
}
