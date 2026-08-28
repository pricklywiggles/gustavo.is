import { render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const { reducedState } = vi.hoisted(() => ({
	reducedState: { value: false as boolean | null },
}));

vi.mock("next/navigation", () => ({ useRouter: () => ({ push: () => {} }) }));
vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return { ...actual, useReducedMotion: () => reducedState.value };
});

import { NotFoundScene } from "./not-found-scene";

/**
 * The vitest matchMedia polyfill answers false for every query, so the
 * GSAP motion context never activates in jsdom: every case below asserts
 * the deterministic authored markup (the SSR and reduced-motion frame).
 */
describe("NotFoundScene", () => {
	it("keeps the real heading and the home link accessible", () => {
		render(<NotFoundScene />);
		expect(
			screen.getByRole("heading", { level: 1, name: /event horizon/i }),
		).toBeDefined();
		expect(
			screen.getByRole("link", { name: "Warp back home" }).getAttribute("href"),
		).toBe("/");
	});

	it("declares the dusk-ink surface for the header's theme probe", () => {
		const { container } = render(<NotFoundScene />);
		expect(
			container.querySelector('main[data-surface="dusk-ink"]'),
		).not.toBeNull();
	});

	it("keeps the three decorative actors out of the accessibility tree", () => {
		const { container } = render(<NotFoundScene />);
		const images = Array.from(container.querySelectorAll("img"));
		expect(images).toHaveLength(3);
		for (const img of images) {
			expect(img.getAttribute("alt")).toBe("");
			expect(img.closest('[aria-hidden="true"]')).not.toBeNull();
			// Preflight's img{max-width:100%} is 0px inside the zero-size rig
			// spans; without the escape hatch an actor renders invisible.
			expect(img.className).toContain("max-w-none");
		}
	});

	it("renders identical markup whichever way the preference reads", () => {
		// The reduced branch may only collapse the entrance transition;
		// forking the rendered tree on the preference tears hydration.
		reducedState.value = false;
		const markup = renderToStaticMarkup(<NotFoundScene />);
		reducedState.value = true;
		expect(renderToStaticMarkup(<NotFoundScene />)).toBe(markup);
		reducedState.value = false;
	});
});
