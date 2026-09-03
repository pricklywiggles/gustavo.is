import { afterEach, describe, expect, it } from "vitest";
import { hydrateReduced } from "@/test/hydrate-reduced";
import { CHAPTERS } from "../work-history-data";

let unmount: (() => Promise<void>) | undefined;
afterEach(async () => {
	await unmount?.();
	unmount = undefined;
});

describe("WorkHistoryHud on a reduced-motion client", () => {
	it("hydrates the server's plain number cleanly and keeps it plain", async () => {
		const chapter = CHAPTERS[0];
		const result = await hydrateReduced(async () => {
			const { WorkHistoryHud } = await import("./work-history-hud");
			return (
				<WorkHistoryHud
					span={chapter.span}
					year={chapter.span[0]}
					stint={chapter.stints[0]}
					usersTotal={200_000_000}
				/>
			);
		});
		unmount = result.unmount;
		expect(result.errors).toEqual([]);
		expect(result.html).not.toContain("data-reel");
		expect(result.html).toContain("200,000,000");
		const counter = result.container.querySelector("[data-hud-bar] dd");
		expect(counter?.querySelector("[data-reel]")).toBeNull();
		expect(counter?.textContent).toBe("200,000,000");
	}, 20_000);
});
