/** Separate from the content source so display components need not import the MDX modules. */
export type PostCover = {
	src: string;
	width: number;
	height: number;
	alt: string;
};
