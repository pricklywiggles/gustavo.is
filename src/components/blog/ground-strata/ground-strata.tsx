/**
 * The hero's ground bands compressed to hairline seams that thicken
 * toward the article; `flip` mirrors the stack so the closing seam
 * thickens toward it too.
 */
export function GroundStrata({ flip = false }: { flip?: boolean }) {
	return (
		<div
			aria-hidden="true"
			className={flip ? "flex flex-col-reverse" : "flex flex-col"}
		>
			<div className="h-px bg-dune-tan" />
			<div className="h-1" />
			<div className="h-[2px] bg-desert-clay" />
			<div className="h-[6px]" />
			<div className="h-[3px] bg-canyon-brown" />
		</div>
	);
}
