import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { consumeScrollReset } = vi.hoisted(() => ({
	consumeScrollReset: vi.fn(),
}));
vi.mock("@/components/curtain-link", () => ({ consumeScrollReset }));

import { ScrollReset } from "./scroll-reset";

afterEach(() => vi.clearAllMocks());

describe("ScrollReset", () => {
	it("resets only when a curtain arrival minted a token", () => {
		const scrollTo = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => undefined);
		consumeScrollReset.mockReturnValueOnce(true);
		render(<ScrollReset />);
		expect(scrollTo).toHaveBeenCalledWith({
			top: 0,
			left: 0,
			behavior: "instant",
		});
		scrollTo.mockRestore();
	});

	it("leaves back-forward restoration alone without a token", () => {
		const scrollTo = vi
			.spyOn(window, "scrollTo")
			.mockImplementation(() => undefined);
		consumeScrollReset.mockReturnValueOnce(false);
		render(<ScrollReset />);
		expect(scrollTo).not.toHaveBeenCalled();
		scrollTo.mockRestore();
	});
});
