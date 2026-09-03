import { render } from "@testing-library/react";
import { createRef } from "react";
import { describe, expect, it } from "vitest";
import { WarpStarfieldOverlay } from "./warp-starfield-overlay";

describe("WarpStarfieldOverlay", () => {
	it("lays the settled scene on a sticky track that the page itself pins and releases", () => {
		const ref = createRef<HTMLDivElement>();
		const { container } = render(
			<WarpStarfieldOverlay
				ref={ref}
				headline={[["Other"], ["Tools", "&"], ["Projects"]]}
				astronautSrc="/projects/astronaut.webp"
			/>,
		);
		// Class literals, since Tailwind scans source.
		// The track starts at the 200vh theater lock, 125vh tall: 25vh of stick, gone by 325vh.
		const track = container.querySelector<HTMLElement>(
			"[data-warp-overlay-track]",
		);
		expect(track?.getAttribute("aria-hidden")).toBe("true");
		for (const cls of [
			"absolute",
			"inset-x-0",
			"top-0",
			"h-screen",
			"motion-safe:top-[200vh]",
			"motion-safe:h-[125vh]",
			"pointer-events-none",
		]) {
			expect(track?.classList.contains(cls)).toBe(true);
		}
		const screen = track?.firstElementChild as HTMLElement;
		expect(ref.current).toBe(screen);
		for (const cls of [
			"sticky",
			"top-0",
			"z-10",
			"h-screen",
			"overflow-hidden",
		]) {
			expect(screen.classList.contains(cls)).toBe(true);
		}
	});

	it("renders the words, astronaut, and cue hidden, with no inline positioning", () => {
		const { container } = render(
			<WarpStarfieldOverlay
				headline={[["Other"], ["Tools", "&"], ["Projects"]]}
				astronautSrc="/projects/astronaut.webp"
			/>,
		);
		const words = Array.from(
			container.querySelectorAll<HTMLElement>("[data-warp-word]"),
		);
		expect(words.map((el) => el.textContent)).toEqual([
			"Other",
			"Tools",
			"&",
			"Projects",
		]);
		const astronaut = container.querySelector<HTMLElement>(
			"[data-warp-astronaut]",
		);
		expect(astronaut?.getAttribute("src")).toBe("/projects/astronaut.webp");
		const hint = container.querySelector<HTMLElement>("[data-scroll-hint]");
		expect(hint).not.toBeNull();
		for (const el of [...words, astronaut, hint]) {
			expect(el?.getAttribute("style")).toBeNull();
		}
	});

	it("skips the astronaut without a source", () => {
		const { container } = render(<WarpStarfieldOverlay headline={[["A"]]} />);
		expect(container.querySelector("[data-warp-astronaut]")).toBeNull();
	});
});
