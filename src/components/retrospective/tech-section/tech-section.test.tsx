import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

const { reducedState } = vi.hoisted(() => ({
	reducedState: { value: false as boolean | null },
}));

vi.mock("motion/react", async (importOriginal) => {
	const actual = await importOriginal<typeof import("motion/react")>();
	return { ...actual, useReducedMotion: () => reducedState.value };
});
vi.mock("motion-plus/react", () => ({
	Ticker: ({ items }: { items: React.ReactNode[] }) => (
		<div data-testid="ticker">{items}</div>
	),
}));

import { PONDER } from "../retrospective-data";
import { TechSection } from "./tech-section";

describe("TechSection", () => {
	it("renders the ticker band with a screen-reader ledger", () => {
		reducedState.value = false;
		const { getByTestId, container } = render(
			<TechSection technologies={PONDER.technologies} />,
		);
		expect(getByTestId("ticker")).toBeTruthy();
		expect(container.querySelector("ul.sr-only")).toBeTruthy();
	});

	it("server markup is the ticker branch even under reduced motion", () => {
		// Branching the SSR tree on the preference is a hydration mismatch.
		reducedState.value = true;
		const markup = renderToStaticMarkup(
			<TechSection technologies={PONDER.technologies} />,
		);
		expect(markup).toContain('data-testid="ticker"');
	});

	it("swaps reduced-motion visitors to the ledger after mount, once", () => {
		reducedState.value = true;
		const { queryByTestId, queryAllByText } = render(
			<TechSection technologies={PONDER.technologies} />,
		);
		expect(queryByTestId("ticker")).toBeNull();
		expect(queryAllByText("GraphQL client")).toHaveLength(1);
	});
});
