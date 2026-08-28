import { afterEach, describe, expect, it, vi } from "vitest";
import { hydrateReduced } from "@/test/hydrate-reduced";
import { PROJECTS } from "../projects-data";

vi.mock("next/navigation", () => ({
	useRouter: () => ({ push: () => {} }),
}));

let unmount: (() => Promise<void>) | undefined;
afterEach(async () => {
	await unmount?.();
	unmount = undefined;
});

describe("ProjectShowcase on a reduced-motion client", () => {
	it("hydrates the staged project cleanly", async () => {
		const result = await hydrateReduced(async () => {
			const { ProjectShowcase } = await import("./project-showcase");
			return <ProjectShowcase projects={PROJECTS} activeIndex={0} />;
		});
		unmount = result.unmount;
		expect(result.errors).toEqual([]);
		expect(result.container.querySelector("h3")?.textContent).toBe(
			PROJECTS[0].name,
		);
	}, 20_000);
});
