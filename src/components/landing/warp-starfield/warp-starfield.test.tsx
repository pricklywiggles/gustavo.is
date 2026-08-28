import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WarpStarfield } from "./warp-starfield";

// jsdom has no 2d context; the component must degrade to an inert canvas
// with the headline text readable rather than stuck transparent.
describe("WarpStarfield", () => {
	it("renders a canvas and reveals the headline without a 2d context", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container } = render(
			<WarpStarfield
				className="size-full"
				headline={[["Other"], ["Tools", "&"], ["Projects"]]}
				astronautSrc="/projects/astronaut.webp"
			/>,
		);
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

		// The astronaut degrades to its resting peek pose.
		const astronaut = container.querySelector<HTMLElement>(
			'img[src="/projects/astronaut.webp"]',
		);
		expect(astronaut).not.toBeNull();
		expect(astronaut?.style.transform).toBe("translateY(0)");

		// The scroll cue degrades to visible.
		const hint = container.querySelector<HTMLElement>("[data-scroll-hint]");
		expect(hint).not.toBeNull();
		expect(hint?.style.opacity).toBe("1");
		getContext.mockRestore();
	});
});

describe("WarpStarfield under reduced motion", () => {
	it("parks the settled overlay at rest, riding only the showcase's scroll", () => {
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
			<WarpStarfield
				className="size-full"
				headline={[["Other"]]}
				seedProgress={() => 0}
				sceneScroll={() => 100}
				onComplete={onComplete}
			/>,
		);
		expect(onComplete).toHaveBeenCalledTimes(1);
		// Seed progress 0 used to push the overlay two viewports down (1500px here);
		// pinned at 1 it only rides the showcase's 100px of entry.
		const hint = container.querySelector<HTMLElement>("[data-scroll-hint]");
		expect(hint?.style.translate).toBe("-50% -100px");
		const word = container.querySelector<HTMLElement>("[data-warp-word]");
		expect(word?.style.opacity).toBe("1");
		getContext.mockRestore();
		rect.mockRestore();
		vi.unstubAllGlobals();
	});
});
