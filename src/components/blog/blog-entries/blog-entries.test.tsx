import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BlogEntries, type BlogEntry, coverFillsFrame } from "./blog-entries";

vi.mock("next/navigation", () => ({
	usePathname: () => "/blog",
	useRouter: () => ({ push: () => {} }),
}));

const ENTRIES: BlogEntry[] = [
	{
		url: "/blog/first",
		title: "First post",
		description: "A description.",
		dateTime: "2026-07-16",
		dateLabel: "Jul 16, 2026",
	},
	{
		url: "/blog/second",
		title: "Second post",
		dateTime: "2026-08-01",
		dateLabel: "Aug 1, 2026",
	},
];

const OG_COVER = { src: "/wide.webp", width: 1200, height: 630, alt: "" };
const TALL_COVER = { src: "/tall.webp", width: 909, height: 813, alt: "" };

describe("BlogEntries", () => {
	it("renders every entry visible at rest (no JS-gated opacity)", () => {
		render(<BlogEntries entries={ENTRIES} />);
		for (const item of screen.getAllByRole("listitem")) {
			// An inline opacity would blank the list for no-JS visitors and failed hydrations.
			expect(item.style.opacity).not.toBe("0");
		}
	});

	it("renders each title as a heading inside one whole-entry link", () => {
		render(<BlogEntries entries={ENTRIES} />);
		const links = screen.getAllByRole("link");
		expect(links.map((l) => l.getAttribute("href"))).toEqual([
			"/blog/first",
			"/blog/second",
		]);
		const heading = screen.getByRole("heading", {
			level: 2,
			name: "First post",
		});
		expect(links[0].contains(heading)).toBe(true);
		expect(links[1].querySelector("p")).toBeNull();
	});

	it("renders a cover as a decorative image inside the link", () => {
		render(
			<BlogEntries
				entries={[{ ...ENTRIES[0], cover: OG_COVER }, ENTRIES[1]]}
			/>,
		);
		const [withCover, withoutCover] = screen.getAllByRole("link");
		const img = withCover.querySelector("img");
		expect(img?.getAttribute("alt")).toBe("");
		expect(img?.getAttribute("src")).toContain("wide.webp");
		expect(withoutCover.querySelector("img")).toBeNull();
	});

	it("fills the frame with OG-shaped covers and insets tall ones", () => {
		render(
			<BlogEntries
				entries={[
					{ ...ENTRIES[0], cover: OG_COVER },
					{ ...ENTRIES[1], cover: TALL_COVER },
				]}
			/>,
		);
		const [wide, tall] = screen
			.getAllByRole("link")
			.map((link) => link.querySelector("img"));
		expect(wide?.classList.contains("object-cover")).toBe(true);
		expect(tall?.classList.contains("object-contain")).toBe(true);
	});

	it("sizes the cover to its rendered frame, never to a square box", () => {
		render(<BlogEntries entries={[{ ...ENTRIES[0], cover: OG_COVER }]} />);
		// A box-width `sizes` under object-cover fetched a source the crop then upscaled.
		expect(screen.getByRole("link").querySelector("img")?.sizes).toBe(
			"(min-width: 40rem) 14rem, calc(100vw - 3rem)",
		);
	});

	it("fetches only the first cover eagerly", () => {
		render(
			<BlogEntries
				entries={[
					{ ...ENTRIES[0], cover: OG_COVER },
					{ ...ENTRIES[1], cover: OG_COVER },
				]}
			/>,
		);
		const [first, second] = screen
			.getAllByRole("link")
			.map((link) => link.querySelector("img"));
		expect(first?.getAttribute("loading")).toBe("eager");
		expect(first?.getAttribute("fetchpriority")).toBe("high");
		expect(second?.getAttribute("loading")).toBe("lazy");
		expect(second?.getAttribute("fetchpriority")).toBeNull();
	});

	it("keeps dates as machine-readable time elements", () => {
		render(<BlogEntries entries={ENTRIES} />);
		const time = screen.getByText("Jul 16, 2026");
		expect(time.tagName).toBe("TIME");
		expect(time.getAttribute("datetime")).toBe("2026-07-16");
	});
});

describe("coverFillsFrame", () => {
	const cover = (width: number, height: number) => ({
		...OG_COVER,
		width,
		height,
	});

	it("accepts covers within a tenth of the frame's ratio", () => {
		expect(coverFillsFrame(cover(1200, 630))).toBe(true);
		expect(coverFillsFrame(cover(1466, 768))).toBe(true);
		expect(coverFillsFrame(cover(1600, 900))).toBe(true);
		expect(coverFillsFrame(cover(2000, 1000))).toBe(true);
	});

	it("insets covers that would crop or outscale the frame", () => {
		expect(coverFillsFrame(cover(1700, 1000))).toBe(false);
		expect(coverFillsFrame(cover(2560, 1080))).toBe(false);
		expect(coverFillsFrame(cover(1600, 1200))).toBe(false);
		expect(coverFillsFrame(TALL_COVER)).toBe(false);
	});
});
