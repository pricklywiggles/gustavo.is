import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The murals are 1600x2556, so an 800px-wide tile is exactly 1278px tall and the
 * loop travels that height. Change one without the other and the seam tears.
 */
const TILE_WIDTH = "800px";
const TILE_HEIGHT = "1278px";
const TILT = "-13deg";

/**
 * Carried over from the sunset Ponder site. The plane is deliberately oversized
 * so the tilt never exposes an edge; the caller sizes and clips it.
 */
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
