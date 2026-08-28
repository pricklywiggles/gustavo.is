import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OtherProjectsSection } from "./other-projects";

describe("OtherProjectsSection", () => {
	it("renders the accessible heading over the warp stage", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container, getByRole } = render(<OtherProjectsSection />);
		expect(
			getByRole("heading", { level: 2, name: "Other Tools & Projects" }),
		).toBeTruthy();
		expect(container.querySelector("canvas")).not.toBeNull();
		// The visual headline is decorative; the h2 carries the semantics.
		expect(
			container
				.querySelector("[data-warp-word]")
				?.closest("[aria-hidden='true']"),
		).not.toBeNull();
		getContext.mockRestore();
	});

	it("drops the lock spacer under reduced motion, where nothing locks", () => {
		const getContext = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);
		const { container } = render(<OtherProjectsSection />);
		const spacer = container.querySelector(
			"[data-projects-scrub]",
		)?.previousElementSibling;
		expect(spacer?.className).toContain("h-[225vh]");
		expect(spacer?.className).toContain("motion-reduce:h-0");
		getContext.mockRestore();
	});
});
