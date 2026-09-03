import { afterEach, describe, expect, it } from "vitest";
import { hydrateReduced } from "@/test/hydrate-reduced";

let unmount: (() => Promise<void>) | undefined;
afterEach(async () => {
	await unmount?.();
	unmount = undefined;
});

describe("SayHelloButton on a reduced-motion client", () => {
	it("hydrates the server's tap-ready button cleanly, then drops the tap trigger", async () => {
		const result = await hydrateReduced(async () => {
			const { domMax, LazyMotion } = await import("motion/react");
			const { SayHelloButton } = await import("./say-hello-button");
			return (
				<LazyMotion features={domMax}>
					<SayHelloButton onClick={() => {}} morphId="hello" tone="light" />
				</LazyMotion>
			);
		});
		unmount = result.unmount;
		expect(result.errors).toEqual([]);
		// whileTap makes Motion emit a tabindex on the server; the client drops it after hydration.
		expect(result.html).toContain('tabindex="0"');
		expect(
			result.container.querySelector("button")?.hasAttribute("tabindex"),
		).toBe(false);
	}, 20_000);
});
