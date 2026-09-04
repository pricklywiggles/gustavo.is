import { act, render, screen } from "@testing-library/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { afterEach, describe, expect, it, vi } from "vitest";
import { RAMP_HEX } from "@/lib/ramp";
import { spyEmptyTimelines, type TimelineCall } from "@/test/empty-timelines";
import { stageWindow, storyPhases } from "../story-phases";
import {
	CHAPTERS,
	carriedUsersBefore,
	cumulativeUsersAt,
} from "../work-history-data";
import { WorkHistorySection } from "./work-history";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("WorkHistorySection", () => {
	// FRA-190: the layers are sized in the section's box; innerHeight tracks the iOS toolbar.
	it("measures the pin against the section's box, never innerHeight", () => {
		const original = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			...original(query),
			matches: query === "(prefers-reduced-motion: no-preference)",
		})) as typeof window.matchMedia;
		const calls: TimelineCall[] = [];
		const timeline = spyEmptyTimelines(calls);
		const set = vi.spyOn(gsap, "set");
		try {
			const { container, unmount } = render(<WorkHistorySection />);
			const section = container.querySelector<HTMLElement>("section#work");
			if (!section) throw new Error("no section");
			let box = 1000;
			Object.defineProperty(section, "offsetHeight", {
				configurable: true,
				get: () => box,
			});
			const trigger = timeline.mock.calls
				.map(
					(call) =>
						(call[0] as gsap.TimelineVars | undefined)?.scrollTrigger as
							| ScrollTrigger.Vars
							| undefined,
				)
				.find((vars) => vars?.pin === true);
			const end = trigger?.end as () => string;
			const { total } = storyPhases(CHAPTERS);
			expect(end()).toBe(`+=${1000 * total}`);
			box = 800;
			expect(end()).toBe(`+=${800 * total}`);
			// FRA-192: the hero string scales down only, 2D per chapter.
			// The odometer takes opacity alone, so it stays the year's one accessible copy.
			const has = (attr: string) => (target: unknown) =>
				(target as HTMLElement | undefined)?.hasAttribute?.(attr) === true;
			const isHero = has("data-hud-year-hero");
			const isOdometer = has("data-hud-year-value");
			const vars = (v: unknown) => (v ?? {}) as Record<string, unknown>;
			// The string's origin is CSS (origin-top-right); GSAP never set()s it.
			expect(set.mock.calls.some((c) => isHero(c[0]))).toBe(false);
			const odometerSets = set.mock.calls.filter((c) => isOdometer(c[0]));
			expect(odometerSets).toHaveLength(CHAPTERS.length);
			// gsap.set normalizes its vars in place, so assert only the keys that matter.
			for (const c of odometerSets) {
				expect(vars(c[1]).opacity).toBe(0);
				for (const key of ["autoAlpha", "visibility", "x", "y", "scale"]) {
					expect(vars(c[1])).not.toHaveProperty(key);
				}
			}
			const heroFromTos = calls.filter(
				(c) => c.method === "fromTo" && isHero(c.args[0]),
			);
			expect(heroFromTos).toHaveLength(CHAPTERS.length);
			for (const c of heroFromTos) {
				const to = vars(c.args[2]);
				expect(to.force3D).toBe(false);
				for (const key of ["x", "y", "scale"]) {
					expect(typeof to[key]).toBe("function");
				}
			}
			// Per chapter: one dock tween (function-valued pose) and one color tween.
			const heroTos = calls.filter(
				(c) => c.method === "to" && isHero(c.args[0]),
			);
			expect(heroTos).toHaveLength(CHAPTERS.length * 2);
			const docks = heroTos.filter((c) => "scale" in vars(c.args[1]));
			expect(docks).toHaveLength(CHAPTERS.length);
			for (const c of docks) {
				const v = vars(c.args[1]);
				expect(v.force3D).toBe(false);
				for (const key of ["x", "y", "scale"]) {
					expect(typeof v[key]).toBe("function");
				}
			}
			const { at, len } = storyPhases(CHAPTERS);
			const swapEnd = (i: number) =>
				at[`year-swap@${i}`] + len[`year-swap@${i}`];
			const colors = heroTos.filter((c) => "color" in vars(c.args[1]));
			expect(colors).toHaveLength(CHAPTERS.length);
			colors.forEach((c, i) => {
				expect(vars(c.args[1]).color).toBe(RAMP_HEX["dusk-ink"]);
				expect(vars(c.args[1]).ease).toBe("none");
				expect(c.args[2]).toBe(at[`year-swap@${i}`]);
			});
			const heroHides = calls.filter(
				(c) => c.method === "set" && isHero(c.args[0]),
			);
			const odometerShows = calls.filter(
				(c) => c.method === "set" && isOdometer(c.args[0]),
			);
			expect(heroHides).toHaveLength(CHAPTERS.length);
			expect(odometerShows).toHaveLength(CHAPTERS.length);
			heroHides.forEach((c, i) => {
				expect(vars(c.args[1])).toEqual({ autoAlpha: 0 });
				expect(c.args[2]).toBe(swapEnd(i));
				expect(vars(odometerShows[i].args[1])).toEqual({ opacity: 1 });
				expect(odometerShows[i].args[2]).toBe(swapEnd(i));
				expect(calls.indexOf(c)).toBeLessThan(calls.indexOf(odometerShows[i]));
			});
			expect(
				calls.filter((c) => isOdometer(c.args[0]) && c.method !== "set"),
			).toHaveLength(0);
			// FRA-194: never a GSAP scale over a Motion child (the FRA-192 reel crawl).
			const isProduct = has("data-hud-product");
			const productFromTos = calls.filter(
				(c) => c.method === "fromTo" && isProduct(c.args[0]),
			);
			expect(productFromTos).toHaveLength(CHAPTERS.length);
			productFromTos.forEach((c, i) => {
				const to = vars(c.args[2]);
				expect(c.args[3]).toBe(at[`product-in@${i}`]);
				expect(to.duration).toBe(len[`product-in@${i}`]);
				expect(to).toHaveProperty("autoAlpha");
				for (const key of ["scale", "scaleX", "scaleY"]) {
					expect(vars(c.args[1])).not.toHaveProperty(key);
					expect(to).not.toHaveProperty(key);
				}
			});
			expect(
				calls.filter((c) => isProduct(c.args[0]) && c.method !== "fromTo"),
			).toHaveLength(0);
			expect(calls.some((c) => has("data-hud-divider")(c.args[0]))).toBe(false);
			const heroEl = container.querySelector("[data-hud-year-hero]");
			expect(heroEl?.getAttribute("aria-hidden")).toBe("true");
			expect(heroEl?.textContent).toBe(String(CHAPTERS[0].span[0]));
			for (const cls of [
				"absolute",
				"right-0",
				"w-max",
				"origin-top-right",
				"text-[37vw]",
				"text-white",
				"tabular-nums",
				"[font-kerning:none]",
				"motion-safe:opacity-0",
			]) {
				expect(heroEl?.className).toContain(cls);
			}
			const odometerEl = container.querySelector("[data-hud-year-value]");
			expect(odometerEl?.className ?? "").not.toContain("opacity");
			// The dock pose anchors on the AnimateNumber root, not on library markup.
			expect(
				odometerEl?.querySelector("[data-hud-year-number]"),
			).not.toBeNull();
			expect(odometerEl?.parentElement?.className).not.toMatch(/\bh-\[/);
			unmount();
		} finally {
			window.matchMedia = original;
		}
	});

	// FRA-188: ambience sleeps while its chapter is off stage.
	it("spans each ambience trigger over its chapter's stage window", () => {
		const original = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			...original(query),
			matches: query === "(prefers-reduced-motion: no-preference)",
		})) as typeof window.matchMedia;
		spyEmptyTimelines();
		const heightDescriptor = Object.getOwnPropertyDescriptor(
			HTMLElement.prototype,
			"offsetHeight",
		);
		Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
			configurable: true,
			get: () => 1000,
		});
		let unmount = () => {};
		try {
			({ unmount } = render(<WorkHistorySection />));
			const trigger = ScrollTrigger.getById("ambience@0");
			if (!trigger) throw new Error("no ambience trigger");
			const phase = storyPhases(CHAPTERS);
			const onStage = stageWindow(phase, 0, CHAPTERS.length);
			expect((trigger.vars.start as () => number)()).toBe(1000 * onStage.start);
			expect((trigger.vars.end as () => number)()).toBe(1000 * onStage.end);
		} finally {
			unmount();
			if (heightDescriptor) {
				Object.defineProperty(
					HTMLElement.prototype,
					"offsetHeight",
					heightDescriptor,
				);
			}
			window.matchMedia = original;
		}
	});

	it("renders the equation terms and the rule, with no attribution", () => {
		const { container } = render(<WorkHistorySection />);
		const quote = container.querySelector("blockquote");
		// Terms weld their operator on with a non-breaking space, so normalize whitespace.
		const text = quote?.textContent?.replace(/\s+/g, " ");
		expect(text).toContain("Play +");
		// The equals is two hyphens (.kitora-equals); the sr-only copy carries the real "=".
		expect(text).toContain("Purpose -");
		expect(text).toContain("Purpose =");
		expect(text).toContain("Work");
		expect(quote?.querySelector("[data-quote-rule]")).not.toBeNull();
		expect(container.querySelector("figcaption")).toBeNull();
	});

	it("starts both operands together, then overlaps the later beats", () => {
		const { at, len } = storyPhases(CHAPTERS);
		expect(at.line2).toBe(at.line1);
		const opensDuring = (beat: string, previous: string) => {
			expect(at[beat]).toBeGreaterThan(at[previous]);
			expect(at[beat]).toBeLessThan(at[previous] + len[previous]);
		};
		opensDuring("rule", "line1");
		opensDuring("line3", "rule");
	});

	it("bounds each ambience window from its cascade to its exit, abutting", () => {
		const phase = storyPhases(CHAPTERS);
		for (let i = 0; i < CHAPTERS.length - 1; i++) {
			const { start, end } = stageWindow(phase, i, CHAPTERS.length);
			expect(start).toBe(phase.at[`panorama-in@${i}`]);
			expect(end).toBe(
				phase.at[`scene-out@${i}`] + phase.len[`scene-out@${i}`],
			);
			// resolvePhases starts the next cascade at this exit's end.
			expect(end).toBe(phase.at[`panorama-in@${i + 1}`]);
		}
		const last = stageWindow(phase, CHAPTERS.length - 1, CHAPTERS.length);
		expect(last.start).toBe(phase.at[`panorama-in@${CHAPTERS.length - 1}`]);
		expect(last.end).toBe(phase.at["outro-dusk"] + phase.len["outro-dusk"]);
	});

	it("renders every chapter's panorama layers in z-order", () => {
		const { container } = render(<WorkHistorySection />);
		const layers = container.querySelectorAll("[data-pano-layer]");
		const srcOf = (el: Element) =>
			el.getAttribute("src") ?? el.querySelector("img")?.getAttribute("src");
		// Seattle 15 + San Francisco 21 + Los Angeles 18, scene order.
		expect(layers.length).toBe(54);
		expect(srcOf(layers[0])).toBe("/seattle-panorama/1-high-cloud-left.webp");
		// The ferry tops Seattle's stack.
		expect(srcOf(layers[14])).toBe("/seattle-panorama/10-ferry.webp");
		expect(srcOf(layers[15])).toBe("/san-francisco-panorama/1-clouds-far.webp");
		expect(srcOf(layers[36])).toBe("/los-angeles-panorama/1-large-cloud.webp");
	});

	it("renders one HUD per chapter, each centering its first product", () => {
		const { container } = render(<WorkHistorySection />);
		// The logos carry the wordmarks, so alt text is the only place the names are stated.
		expect(screen.getByAltText("Microsoft")).toBeDefined();
		expect(screen.getByAltText("Word")).toBeDefined();
		const section = container.querySelector("section#work");
		if (!section) throw new Error("no section");
		const huds = [...section.children].filter((el) =>
			el.querySelector("[data-hud-year]"),
		);
		expect(huds).toHaveLength(CHAPTERS.length);
		expect(CHAPTERS.map((chapter) => chapter.stints[0].product)).toEqual([
			"Word",
			"Slide Photo Sharing App",
			"Jawbone Health",
		]);
		huds.forEach((hud, i) => {
			const products = hud.querySelectorAll("[data-hud-product]");
			expect(products).toHaveLength(1);
			expect(
				products[0]
					.querySelector('img:not([aria-hidden="true"])')
					?.getAttribute("alt"),
			).toBe(CHAPTERS[i].stints[0].product);
			expect(hud.querySelector("[data-hud-bar] [data-hud-product]")).toBeNull();
		});
		expect(container.querySelector("[data-hud-divider]")).toBeNull();
		const role = container.querySelector("[data-hud-role]");
		expect(role?.textContent).toBe("Software Design Engineer");
		// Two counter homes per chapter, bar and phone; CSS shows one per breakpoint.
		expect(screen.getAllByText("Total users reached")).toHaveLength(6);
	});

	it("stacks a ledger after each scene and hides every HUD for reduced motion", () => {
		const { container } = render(<WorkHistorySection />);
		const section = container.querySelector("section#work");
		if (!section) throw new Error("no section");
		const children = [...section.children];
		const scenes = children.filter(
			(el) => el.getAttribute("aria-hidden") === "true",
		);
		const ledgers = children.filter((el) =>
			el.hasAttribute("data-city-ledger"),
		);
		const huds = children.filter((el) => el.querySelector("[data-hud-year]"));
		expect(scenes).toHaveLength(3);
		expect(ledgers).toHaveLength(3);
		expect(huds).toHaveLength(3);
		// DOM order is the reduced reading order.
		for (const [i, ledger] of ledgers.entries()) {
			expect(ledger.previousElementSibling).toBe(scenes[i]);
			expect(ledger.className).toContain("hidden");
			expect(ledger.className).toContain("motion-reduce:block");
			// Text only: the scene's layer count and the HUD's alt-text queries stay true.
			expect(ledger.querySelector("img, [data-pano-layer]")).toBeNull();
		}
		for (const scene of scenes) {
			expect(scene.className).not.toContain("motion-reduce:hidden");
		}
		for (const hud of huds) {
			expect(hud.className).toContain("motion-reduce:hidden");
		}
		expect(
			screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent),
		).toEqual(CHAPTERS.map((chapter) => chapter.name));
	});

	it("keeps the #work anchor the intro's See my work link points at", () => {
		const { container } = render(<WorkHistorySection />);
		expect(container.querySelector("section#work")).not.toBeNull();
	});

	// FRA-192: the swap hides inside hud-in's tail, so the scrub still starts where hud-in ends.
	it("anchors the year swap to the dock's end without moving the scrub", () => {
		const { at, len } = storyPhases(CHAPTERS);
		const end = (id: string) => at[id] + len[id];
		for (let i = 0; i < CHAPTERS.length; i++) {
			expect(len[`year-dock@${i}`]).toBe(0.6);
			expect(len[`year-swap@${i}`]).toBe(0.2);
			expect(at[`year-swap@${i}`]).toBe(end(`year-dock@${i}`));
			expect(end(`year-swap@${i}`)).toBeLessThanOrEqual(at[`scrub@${i}`]);
			expect(at[`scrub@${i}`]).toBe(end(`hud-in@${i}`));
			// FRA-194: after the year clears the center, inside hud-in so the scrub stays put.
			expect(len[`product-in@${i}`]).toBe(0.2);
			expect(at[`product-in@${i}`]).toBe(end(`year-dock@${i}`));
			expect(end(`product-in@${i}`)).toBeLessThanOrEqual(at[`scrub@${i}`]);
			expect(end(`product-in@${i}`)).toBeLessThanOrEqual(end(`hud-in@${i}`));
		}
	});

	// FRA-195: reversing fades a finished chapter's HUD back in before its scrub re-engages.
	it("rests a finished chapter on its last stint while a later chapter scrubs", () => {
		const original = window.matchMedia;
		window.matchMedia = ((query: string) => ({
			...original(query),
			matches: query === "(prefers-reduced-motion: no-preference)",
		})) as typeof window.matchMedia;
		const actGlobal = globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean };
		const previousActFlag = actGlobal.IS_REACT_ACT_ENVIRONMENT;
		const calls: TimelineCall[] = [];
		spyEmptyTimelines(calls);
		try {
			// RTL only flags the act environment inside its own render.
			actGlobal.IS_REACT_ACT_ENVIRONMENT = true;
			const { container, unmount } = render(<WorkHistorySection />);
			const scrubs = calls.filter(
				(call) =>
					call.method === "to" &&
					typeof (call.args[0] as { year?: unknown })?.year === "number" &&
					typeof (call.args[1] as { onUpdate?: unknown })?.onUpdate ===
						"function",
			);
			expect(scrubs).toHaveLength(CHAPTERS.length);
			const clock = scrubs[1].args[0] as { year: number };
			const vars = scrubs[1].args[1] as { onUpdate: () => void };
			act(() => {
				clock.year = CHAPTERS[1].span[0] + 1;
				vars.onUpdate();
			});
			const section = container.querySelector("section#work");
			if (!section) throw new Error("no section");
			const huds = [...section.children].filter((el) =>
				el.querySelector("[data-hud-year]"),
			);
			// The bar's sr-only total is the rest state's plainest readout to assert on.
			const totalOf = (hud: Element) =>
				[...hud.querySelectorAll("[data-hud-bar] .sr-only")].at(-1)
					?.textContent;
			const seattle = CHAPTERS[0];
			const finished =
				carriedUsersBefore(CHAPTERS, 0) +
				cumulativeUsersAt(seattle.stints, seattle.span[1]);
			expect(finished).toBeGreaterThan(0);
			expect(totalOf(huds[0])).toBe(finished.toLocaleString("en-US"));
			expect(totalOf(huds[2])).toBe(
				carriedUsersBefore(CHAPTERS, 2).toLocaleString("en-US"),
			);
			unmount();
		} finally {
			actGlobal.IS_REACT_ACT_ENVIRONMENT = previousActFlag;
			window.matchMedia = original;
		}
	});
});
