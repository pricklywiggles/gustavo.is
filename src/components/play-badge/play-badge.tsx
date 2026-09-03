const SIZES = {
	md: { disc: "size-16", glyph: "size-6" },
	lg: { disc: "size-20", glyph: "size-8" },
} as const;

/** Decorative: the host link or button provides the accessible name. */
export function PlayBadge({ size = "md" }: { size?: keyof typeof SIZES }) {
	const s = SIZES[size];
	return (
		<span
			aria-hidden="true"
			className={`flex ${s.disc} items-center justify-center rounded-full bg-noon-sun shadow-raised transition-transform duration-200 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100`}
		>
			{/* The stroke rounds the triangle's corners. The path sits 1.25 units right of
			    center, the optical correction for a right-pointing glyph; a margin instead
			    reads as off-center. */}
			<svg
				viewBox="0 0 24 24"
				aria-hidden="true"
				className={`${s.glyph} fill-dusk-earth stroke-dusk-earth`}
			>
				<path d="M8.5 6.5v11l9.5-5.5z" strokeWidth={3} strokeLinejoin="round" />
			</svg>
		</span>
	);
}
