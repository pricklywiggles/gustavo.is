import { describe, expect, it } from "vitest";
import { PROJECTS } from "./projects-data";

describe("PROJECTS", () => {
	it("lists six entries with unique names", () => {
		expect(PROJECTS).toHaveLength(6);
		expect(new Set(PROJECTS.map((p) => p.name)).size).toBe(6);
	});

	it("wires every action, off-site over https and Ponder's to its routes", () => {
		for (const project of PROJECTS) {
			expect(project.links.length).toBeGreaterThan(0);
			for (const link of project.links) {
				expect(link.url).not.toBeNull();
				if (!link.url?.startsWith("/")) expect(link.url).toMatch(/^https:\/\//);
			}
		}
		const ponder = PROJECTS.at(-1);
		expect(ponder?.name).toBe("Ponder");
		expect(ponder?.tech).toBe("retrospective");
		expect(ponder?.links.map((l) => l.url)).toEqual([
			"/remembering/ponder",
			"/remembering/ponder-blogs",
		]);
	});

	it("has a description on every entry", () => {
		for (const project of PROJECTS) {
			expect(project.description.length).toBeGreaterThan(10);
		}
	});
});
