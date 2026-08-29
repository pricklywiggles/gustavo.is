import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { render, screen, waitFor } from "@testing-library/react";
import gsap from "gsap";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { hydrateReduced } from "@/test/hydrate-reduced";
import { AnimatedLines, type LineEffect } from "./animated-lines";

const noopEffect: LineEffect = () => 0;

let unmount: (() => Promise<void>) | undefined;
afterEach(async () => {
	await unmount?.();
	unmount = undefined;
	vi.restoreAllMocks();
});

// The setup stub reports reduced motion (matches: false), which skips the whole GSAP
// path; override so the timeline construction actually runs.
const allowMotion = () => {
	const original = window.matchMedia;
	window.matchMedia = ((query: string) => ({
		...original(query),
		matches: true,
	})) as typeof window.matchMedia;
	return () => {
		window.matchMedia = original;
	};
};

const scrubOf = (timeline: ReturnType<typeof vi.spyOn>) =>
	(
		(timeline.mock.calls[0][0] as gsap.TimelineVars).scrollTrigger as
			| ScrollTrigger.Vars
			| undefined
	)?.scrub;

// "e" + combining acute (two code points) and a ZWJ emoji family: both must
// stay in one span each or they render corrupted.
const ACCENTED = "cafe\u0301";
const FAMILY = "\u{1F468}\u200D\u{1F469}\u200D\u{1F467}";

describe("AnimatedLines", () => {
	it("renders the requested element with the text as its accessible name", () => {
		render(
			<AnimatedLines as="h2" effect={noopEffect}>
				Hello there
			</AnimatedLines>,
		);
		const heading = screen.getByRole("heading", { name: "Hello there" });
		expect(heading.tagName).toBe("H2");
	});

	it("ships a visually hidden copy and hides the split spans, without aria-label", () => {
		const { container } = render(
			<AnimatedLines effect={noopEffect}>Hi you</AnimatedLines>,
		);
		expect(container.querySelector(".sr-only")?.textContent).toBe("Hi you");
		expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(
			"Hi you",
		);
		expect(container.querySelectorAll(".split-char")).toHaveLength(5);
		expect(container.firstElementChild?.getAttribute("aria-label")).toBeNull();
	});

	it("keeps grapheme clusters whole", () => {
		const { container } = render(
			<AnimatedLines
				effect={noopEffect}
			>{`${ACCENTED} ${FAMILY}`}</AnimatedLines>,
		);
		const chars = Array.from(container.querySelectorAll(".split-char")).map(
			(c) => c.textContent,
		);
		expect(chars).toEqual(["c", "a", "f", "e\u0301", FAMILY]);
	});

	// NBSP-glued pairs must land in ONE nowrap span: split apart, the halves become
	// separate inline-blocks that carry their own break opportunities and wrap anyway.
	it("keeps a non-breaking space inside its word span", () => {
		const { container } = render(
			<AnimatedLines effect={noopEffect}>{"a\u00A0b c"}</AnimatedLines>,
		);
		const words = Array.from(
			container.querySelectorAll(".whitespace-nowrap"),
		).map((w) => w.textContent);
		expect(words).toEqual(["a\u00A0b", "c"]);
	});

	it("lets the sr-only copy differ from the drawn glyphs", () => {
		const { container } = render(
			<AnimatedLines effect={noopEffect} accessibleText="a = b">
				{"a - b"}
			</AnimatedLines>,
		);
		expect(container.querySelector(".sr-only")?.textContent).toBe("a = b");
		expect(container.querySelector('[aria-hidden="true"]')?.textContent).toBe(
			"a - b",
		);
	});

	it("server-renders the accessible text once, with no split copy", () => {
		const html = renderToString(
			<AnimatedLines effect={noopEffect} accessibleText="a = b">
				{"a - b"}
			</AnimatedLines>,
		);
		expect(html).not.toContain("split-char");
		expect(html).not.toContain("sr-only");
		expect(html.match(/a = b/g)).toHaveLength(1);
		expect(html).not.toContain("a - b");
	});

	it("hydrates the plain server text cleanly, then splits it on the client", async () => {
		const result = await hydrateReduced(async () => {
			const { AnimatedLines: Lines } = await import("./animated-lines");
			return (
				<Lines as="h2" effect={noopEffect}>
					Hi you
				</Lines>
			);
		});
		unmount = result.unmount;
		expect(result.errors).toEqual([]);
		expect(result.html).not.toContain("split-char");
		expect(result.container.querySelectorAll(".split-char")).toHaveLength(5);
		expect(result.container.querySelector(".sr-only")?.textContent).toBe(
			"Hi you",
		);
		expect(
			result.container.querySelector('[aria-hidden="true"]')?.textContent,
		).toBe("Hi you");
	}, 20_000);

	it("forwards DOM props to the wrapper", () => {
		render(
			<AnimatedLines id="lead" effect={noopEffect}>
				Lead
			</AnimatedLines>,
		);
		expect(document.getElementById("lead")).not.toBeNull();
	});

	it("builds the animation per line when motion is allowed", async () => {
		const restore = allowMotion();
		const effect = vi.fn<LineEffect>(() => 0);
		try {
			render(<AnimatedLines effect={effect}>One line</AnimatedLines>);
			await waitFor(() => expect(effect).toHaveBeenCalledTimes(1));
			const context = effect.mock.calls[0][0];
			expect(context.chars).toHaveLength(7);
			expect(context.lineIndex).toBe(0);
			expect(context.lineCount).toBe(1);
			expect(context.at).toBe(0);
			expect(context.timeline).toBeDefined();
		} finally {
			restore();
		}
	});

	// Raw scroll is the baseline feel on every platform (FRA-185); a consumer that wants
	// catch-up asks for it, and only for the device that needs it.
	it("follows the raw scroll by default in scrub and pin modes", async () => {
		const restore = allowMotion();
		try {
			const scrubMode = vi.spyOn(gsap, "timeline");
			render(<AnimatedLines effect={noopEffect}>Scrubbed</AnimatedLines>);
			await waitFor(() => expect(scrubMode).toHaveBeenCalledTimes(1));
			expect(scrubOf(scrubMode)).toBe(true);
			scrubMode.mockRestore();

			const pinMode = vi.spyOn(gsap, "timeline");
			render(
				<AnimatedLines effect={noopEffect} mode="pin">
					Pinned
				</AnimatedLines>,
			);
			await waitFor(() => expect(pinMode).toHaveBeenCalledTimes(1));
			expect(scrubOf(pinMode)).toBe(true);
		} finally {
			restore();
		}
	});

	it("passes an explicit catch-up through", async () => {
		const restore = allowMotion();
		try {
			const timeline = vi.spyOn(gsap, "timeline");
			render(
				<AnimatedLines effect={noopEffect} scrub={0.25}>
					Smoothed
				</AnimatedLines>,
			);
			await waitFor(() => expect(timeline).toHaveBeenCalledTimes(1));
			expect(scrubOf(timeline)).toBe(0.25);
		} finally {
			restore();
		}
	});

	it("has the intro as its only consumer opting into a catch-up", () => {
		const sources = readdirSync("src/components", {
			recursive: true,
			withFileTypes: true,
		})
			.filter(
				(entry) =>
					entry.isFile() &&
					/\.tsx?$/.test(entry.name) &&
					!/\.(test|stories)\.tsx?$/.test(entry.name),
			)
			.map((entry) => path.join(entry.parentPath, entry.name));
		const optedIn = sources.filter((file) => {
			const source = readFileSync(file, "utf8");
			return (
				/\b(AnimatedLines|ScrollRevealText)\b/.test(source) &&
				/\bscrub=/.test(source)
			);
		});
		expect(optedIn).toEqual(["src/components/landing/intro/intro.tsx"]);
	});
});
