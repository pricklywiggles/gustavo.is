import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { defaultOrderFor, ScrollRevealText } from "./scroll-reveal-text";

describe("ScrollRevealText", () => {
	// The line resolves from the end furthest from entry; callers pass `order` to reverse it.
	it("defaults the letter order to fill toward the incoming side", () => {
		expect(defaultOrderFor("right")).toBe("normal");
		expect(defaultOrderFor("left")).toBe("reverse");
	});

	it("renders as the requested element with the full text accessible", () => {
		render(<ScrollRevealText as="h2">Hello there</ScrollRevealText>);
		const heading = screen.getByRole("heading", { name: "Hello there" });
		expect(heading.tagName).toBe("H2");
	});

	it("mounts with every animation option set without throwing", () => {
		render(
			<ScrollRevealText
				as="h2"
				direction="left"
				order="reverse"
				angle={30}
				speed={2}
			>
				Options
			</ScrollRevealText>,
		);
		expect(screen.getByRole("heading", { name: "Options" })).toBeDefined();
	});

	it("mounts in trigger mode without throwing", () => {
		render(
			<ScrollRevealText as="h2" mode="trigger" triggerAt={80} speed={1.5}>
				Triggered
			</ScrollRevealText>,
		);
		expect(screen.getByRole("heading", { name: "Triggered" })).toBeDefined();
	});

	it("does not leak animation options onto the DOM element", () => {
		render(
			<ScrollRevealText id="clean" direction="left" order="reverse" angle={30}>
				Clean
			</ScrollRevealText>,
		);
		const el = document.getElementById("clean");
		expect(el?.getAttribute("direction")).toBeNull();
		expect(el?.getAttribute("order")).toBeNull();
		expect(el?.getAttribute("angle")).toBeNull();
	});
});
