import { render } from "@testing-library/react";
import { useRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { WarpStarfieldOverlay } from "@/components/landing/warp-starfield-overlay";
import { WarpStarfield } from "./warp-starfield";

// Mirrors how OtherProjectsSection mounts the pair.
function Scene({
	sceneScroll,
	onComplete,
}: {
	sceneScroll?: () => number;
	onComplete?: () => void;
}) {
	const overlay = useRef<HTMLDivElement>(null);
	return (
		<>
			<WarpStarfield
				className="size-full"
				overlay={overlay}
				seedProgress={() => 0}
				sceneScroll={sceneScroll}
				onComplete={onComplete}
			/>
			<WarpStarfieldOverlay
				ref={overlay}
				headline={[["Other"], ["Tools", "&"], ["Projects"]]}
				astronautSrc="/projects/astronaut.webp"
			/>
		</>
	);
}

// jsdom has no 2d context, so the component must degrade to an inert canvas with readable text.
describe("WarpStarfield", () => {
	it("renders a canvas and reveals the overlay's headline without a 2d context", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container } = render(<Scene />);
		expect(container.querySelector("canvas")).not.toBeNull();
		expect(container.firstElementChild?.className).toBe("size-full");

		const wordSpans = Array.from(
			container.querySelectorAll<HTMLElement>("[data-warp-word]"),
		);
		expect(wordSpans.map((el) => el.textContent)).toEqual([
			"Other",
			"Tools",
			"&",
			"Projects",
		]);
		for (const el of wordSpans) {
			expect(el.style.opacity).toBe("1");
		}

		const astronaut = container.querySelector<HTMLElement>(
			"[data-warp-astronaut]",
		);
		expect(astronaut).not.toBeNull();
		expect(astronaut?.style.transform).toBe("translateY(0)");

		const hint = container.querySelector<HTMLElement>("[data-scroll-hint]");
		expect(hint).not.toBeNull();
		expect(hint?.style.opacity).toBe("1");
		getContext.mockRestore();
	});
});

describe("WarpStarfield under reduced motion", () => {
	it("settles the overlay at rest and leaves its placement to the page", () => {
		// The reduced branch needs a 2d context, a ResizeObserver and a sized canvas.
		vi.stubGlobal(
			"ResizeObserver",
			class {
				observe() {}
				unobserve() {}
				disconnect() {}
			},
		);
		vi.stubGlobal("matchMedia", (query: string) => ({
			matches: query === "(prefers-reduced-motion: reduce)",
			media: query,
			onchange: null,
			addListener: () => {},
			removeListener: () => {},
			addEventListener: () => {},
			removeEventListener: () => {},
			dispatchEvent: () => false,
		}));
		const ctx: object = new Proxy(
			{},
			{ get: () => () => ctx, set: () => true },
		);
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(ctx as CanvasRenderingContext2D);
		const rect = vi
			.spyOn(HTMLCanvasElement.prototype, "getBoundingClientRect")
			.mockReturnValue({ width: 1200, height: 800 } as DOMRect);
		const onComplete = vi.fn();
		const { container } = render(
			<Scene sceneScroll={() => 100} onComplete={onComplete} />,
		);
		expect(onComplete).toHaveBeenCalledTimes(1);
		// FRA-185: the track rides the showcase's scroll, so nothing writes an inline translate.
		const hint = container.querySelector<HTMLElement>("[data-scroll-hint]");
		expect(hint?.style.opacity).toBe("1");
		expect(hint?.style.translate).toBe("");
		const word = container.querySelector<HTMLElement>("[data-warp-word]");
		expect(word?.style.opacity).toBe("1");
		for (const el of container.querySelectorAll<HTMLElement>("[style]")) {
			expect(el.style.translate).toBe("");
		}
		getContext.mockRestore();
		rect.mockRestore();
		vi.unstubAllGlobals();
	});
});
