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
		// The crawler-clean pin (FRA-183): the server HTML carries the staged project
		// once and no measuring copy; the copies mount only after hydration.
		expect(result.html.split(PROJECTS[0].description)).toHaveLength(2);
		for (const project of PROJECTS.slice(1)) {
			expect(result.html).not.toContain(project.description);
		}
		expect(result.html.match(/<h3/g)).toHaveLength(1);
		expect(result.html).not.toContain("data-project-measure");
		expect(
			result.container.querySelectorAll("[data-project-measure]"),
		).toHaveLength(PROJECTS.length);
	}, 20_000);
});
