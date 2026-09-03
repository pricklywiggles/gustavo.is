import { fireEvent, render, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PONDER } from "../retrospective-data";
import { FeatureShowcase } from "./feature-showcase";

describe("FeatureShowcase", () => {
	it("opens on the first walkthrough and swaps the panel on selection", async () => {
		const facade = (name: string) =>
			new RegExp(`play the ${name} walkthrough`, "i");
		const { container, getByRole, queryByRole } = render(
			<FeatureShowcase features={PONDER.features} />,
		);
		expect(
			getByRole("button", { name: facade(PONDER.features[0].name) }),
		).toBeTruthy();
		expect(
			queryByRole("button", { name: facade(PONDER.features[1].name) }),
		).toBeNull();

		fireEvent.click(getByRole("tab", { name: PONDER.features[1].name }));
		expect(
			getByRole("button", { name: facade(PONDER.features[1].name) }),
		).toBeTruthy();
		// The leaving slide stays mounted while it rides out.
		await waitFor(
			() =>
				expect(
					queryByRole("button", { name: facade(PONDER.features[0].name) }),
				).toBeNull(),
			{ timeout: 2000 },
		);
		expect(container.querySelectorAll("iframe")).toHaveLength(0);
	});

	it("mounts the player only once the facade is clicked", () => {
		const { container, getByRole } = render(
			<FeatureShowcase features={PONDER.features} />,
		);
		expect(container.querySelector("iframe")).toBeNull();

		fireEvent.click(
			getByRole("button", { name: /play the editor walkthrough/i }),
		);
		const frame = container.querySelector("iframe");
		expect(frame?.getAttribute("src")).toBe(
			`${PONDER.features[0].videoUrl}?autoplay=1`,
		);
		expect(frame?.getAttribute("title")).toBe(PONDER.features[0].videoTitle);
		expect(document.activeElement).toBe(frame);
	});

	it("wires tabs to the stage and inerts the exiting slide", async () => {
		const facade = (name: string) =>
			new RegExp(`play the ${name} walkthrough`, "i");
		const { container, getAllByRole, getByRole } = render(
			<FeatureShowcase features={PONDER.features} />,
		);
		const stage = getByRole("tabpanel") as HTMLElement;
		for (const tab of getAllByRole("tab")) {
			expect(tab.getAttribute("aria-controls")).toBe(stage.id);
		}
		const firstTab = getAllByRole("tab")[0] as HTMLElement;
		expect(stage.getAttribute("aria-labelledby")).toBe(firstTab.id);

		fireEvent.click(getByRole("tab", { name: PONDER.features[2].name }));
		const thirdTab = getAllByRole("tab")[2] as HTMLElement;
		expect(
			(getByRole("tabpanel") as HTMLElement).getAttribute("aria-labelledby"),
		).toBe(thirdTab.id);

		await waitFor(() => {
			expect(container.querySelector("[inert]")).toBeTruthy();
		});
		expect(
			getByRole("button", { name: facade(PONDER.features[2].name) }),
		).toBeTruthy();
	});
});
