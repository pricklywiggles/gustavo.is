import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VideoEmbed } from "./video-embed";

const embed = (name: string) => (
	<VideoEmbed
		src="https://player.vimeo.com/video/1"
		title={`${name} walkthrough`}
		name={name}
	/>
);

describe("VideoEmbed", () => {
	it("names the facade after the feature", () => {
		const { getByRole } = render(embed("Editor"));
		expect(
			getByRole("button", { name: /^play the editor walkthrough$/i }),
		).toBeTruthy();
	});

	it("doesn't double the word walkthrough when the feature already ends in it", () => {
		const { getByRole } = render(
			<>
				{embed("Walkthrough")}
				{embed("Product Walkthrough")}
			</>,
		);
		expect(
			getByRole("button", { name: /^play the walkthrough$/i }),
		).toBeTruthy();
		expect(
			getByRole("button", { name: /^play the product walkthrough$/i }),
		).toBeTruthy();
	});
});
