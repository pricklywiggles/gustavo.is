import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SiteFooter } from "./site-footer";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: () => {} }),
}));

describe("SiteFooter", () => {
	it("renders the footer landmark with nav, socials, and copyright", () => {
		const { getByRole, getByText } = render(<SiteFooter />);
		expect(getByRole("contentinfo")).toBeTruthy();
		expect(getByRole("navigation", { name: "Footer" })).toBeTruthy();
		expect(getByRole("link", { name: "Blog" })).toBeTruthy();
		expect(getByRole("link", { name: "Contact" })).toBeTruthy();
		expect(getByRole("link", { name: "GitHub" })).toBeTruthy();
		expect(getByRole("link", { name: "LinkedIn" })).toBeTruthy();
		expect(getByRole("link", { name: "Bluesky" })).toBeTruthy();
		expect(getByText(/Gustavo Gallegos/)).toBeTruthy();
	});

	it("renders the callout slot when given", () => {
		const { getByText, rerender, queryByText } = render(
			<SiteFooter callout={<p>Custom callout</p>} />,
		);
		expect(getByText("Custom callout")).toBeTruthy();
		rerender(<SiteFooter />);
		expect(queryByText("Custom callout")).toBeNull();
	});
});
