/**
 * A post's cover as the bundler emitted it: `src` is the hashed /_next/static/media
 * URL, the dimensions are intrinsic, and `alt` comes from frontmatter `imageAlt`
 * (empty when the cover is decorative). Kept free of the content source so display
 * components can import it without pulling in the MDX modules.
 */
export type PostCover = {
	src: string;
	width: number;
	height: number;
	alt: string;
};
