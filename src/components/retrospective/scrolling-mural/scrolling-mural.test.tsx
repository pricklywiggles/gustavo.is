import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScrollingMural } from "./scrolling-mural";

describe("ScrollingMural", () => {
	function plane(container: HTMLElement) {
		const el = container.querySelector<HTMLElement>("[data-mural-plane]");
		if (!el) throw new Error("no mural plane rendered");
		return el;
	}

	it("tiles the given image on a plane that only animates when motion is safe", () => {
		const { container } = render(<ScrollingMural src="/murals/one.webp" />);
		const el = plane(container);
		expect(el.style.backgroundImage).toContain("/murals/one.webp");
		expect(el.className).toContain(
			"motion-safe:animate-[mural-scroll_35s_linear_infinite]",
		);
	});

	it("keeps the loop distance equal to one rendered tile", () => {
		const { container } = render(<ScrollingMural src="/murals/one.webp" />);
		const el = plane(container);
		expect(el.style.getPropertyValue("--mural-tile-w")).toBe("800px");
		// 1600x2556 drawn 800px wide; a mismatch tears the loop seam.
		expect(el.style.getPropertyValue("--mural-tile-h")).toBe("1278px");
	});

	it("clips the oversized plane so it adds no scroll range", () => {
		const { container } = render(
			<ScrollingMural src="/murals/one.webp" className="h-56" />,
		);
		const wrapper = container.firstElementChild as HTMLElement;
		expect(wrapper.className).toContain("overflow-hidden");
		expect(wrapper.className).toContain("h-56");
		expect(wrapper.getAttribute("aria-hidden")).toBe("true");
	});
});
