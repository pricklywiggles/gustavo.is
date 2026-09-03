import { render, screen } from "@testing-library/react";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { advanceReel, OdometerNumber, reelPosition } from "./odometer-number";

describe("reelPosition", () => {
	it("aligns every reel exactly on integer values", () => {
		expect(reelPosition(155, 1)).toBe(5);
		expect(reelPosition(155, 10)).toBe(5);
		expect(reelPosition(155, 100)).toBe(1);
		expect(reelPosition(0, 1)).toBe(0);
	});

	it("cascades the carry while lower reels sweep nine to zero", () => {
		expect(reelPosition(199.5, 1)).toBeCloseTo(9.5);
		expect(reelPosition(199.5, 10)).toBeCloseTo(9.5);
		expect(reelPosition(199.5, 100)).toBeCloseTo(1.5);
	});

	it("rolls only the reels whose lower digits are wrapping", () => {
		expect(reelPosition(1998.5, 1)).toBeCloseTo(8.5);
		expect(reelPosition(1998.5, 10)).toBe(9);
		expect(reelPosition(1998.5, 1000)).toBe(1);
	});

	it("stays continuous across the wrap", () => {
		// Position 10 is the strip's duplicate zero, pixel-identical to 0.
		expect(reelPosition(199.99, 100)).toBeCloseTo(1.99);
		expect(reelPosition(200, 100)).toBe(2);
		expect(reelPosition(9.99, 1)).toBeCloseTo(9.99);
		expect(reelPosition(10, 1)).toBe(0);
	});
});

describe("advanceReel", () => {
	it("locks onto the target when it is within one step", () => {
		expect(advanceReel(3, 3.2, 1, 0.33)).toBeCloseTo(3.2);
		expect(advanceReel(7.1, 7, -1, 0.33)).toBe(7);
	});

	it("spins at the cap when the target is out of reach", () => {
		expect(advanceReel(0, 5, 1, 0.33)).toBeCloseTo(0.33);
		expect(advanceReel(5, 0, -1, 0.33)).toBeCloseTo(4.67);
	});

	it("crosses the nine-to-zero seam without unwinding", () => {
		expect(advanceReel(9.9, 0.2, 1, 0.33)).toBeCloseTo(0.2);
		expect(advanceReel(0.2, 9.9, -1, 0.33)).toBeCloseTo(9.9);
	});

	it("keeps rolling forward past a target that slipped just behind", () => {
		expect(advanceReel(2, 1.5, 1, 0.33)).toBeCloseTo(2.33);
	});

	it("treats float jitter at the seam as already arrived", () => {
		expect(advanceReel(5, 5 - 1e-9, 1, 0.33)).toBe(5);
	});
});

describe("OdometerNumber", () => {
	it("renders one reel per digit and the real number for assistive tech", () => {
		const { container } = render(
			<OdometerNumber value={1998} grouping={false} />,
		);
		expect(screen.getByText("1998").className).toContain("sr-only");
		expect(container.querySelectorAll("[data-reel]").length).toBe(4);
	});

	it("groups thousands with separators outside the reels", () => {
		const { container } = render(<OdometerNumber value={1_234_567} />);
		expect(screen.getByText("1,234,567").className).toContain("sr-only");
		expect(container.querySelectorAll("[data-reel]").length).toBe(7);
	});

	it("server-renders the settled number once as plain text", () => {
		const html = renderToString(<OdometerNumber value={200_000_000} />);
		expect(html).not.toContain("data-reel");
		expect(html).not.toContain("sr-only");
		expect(html.match(/200,000,000/g)).toHaveLength(1);
	});
});
