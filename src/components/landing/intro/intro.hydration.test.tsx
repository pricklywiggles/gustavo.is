import { afterEach, describe, expect, it } from "vitest";
import { hydrateReduced } from "@/test/hydrate-reduced";

let unmount: (() => Promise<void>) | undefined;
afterEach(async () => {
	await unmount?.();
	unmount = undefined;
});

describe("IntroSection on a reduced-motion client", () => {
	it("hydrates both calls to action cleanly, then drops their tap triggers", async () => {
		const result = await hydrateReduced(async () => {
			const { domMax, LazyMotion } = await import("motion/react");
			const { IntroSection } = await import("./intro");
			return (
				<LazyMotion features={domMax}>
					<IntroSection />
				</LazyMotion>
			);
		});
		unmount = result.unmount;
		expect(result.errors).toEqual([]);
		expect(result.html).toContain('tabindex="0"');
		expect(result.html).not.toContain("split-char");
		const ctas = result.container.querySelectorAll('button, a[href="#work"]');
		expect(ctas).toHaveLength(2);
		for (const cta of ctas) expect(cta.hasAttribute("tabindex")).toBe(false);
	}, 20_000);
});
