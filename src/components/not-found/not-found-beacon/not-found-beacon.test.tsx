import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const analytics = vi.hoisted(() => ({ track: vi.fn() }));
vi.mock("@/lib/analytics", async (importOriginal) => ({
	...(await importOriginal<typeof import("@/lib/analytics")>()),
	track: analytics.track,
}));

import { NotFoundBeacon } from "./not-found-beacon";

describe("NotFoundBeacon", () => {
	it("reports the missing path once on mount", () => {
		window.history.replaceState(null, "", "/missing-page");
		const { rerender } = render(<NotFoundBeacon />);
		rerender(<NotFoundBeacon />);
		expect(analytics.track).toHaveBeenCalledTimes(1);
		expect(analytics.track).toHaveBeenCalledWith("404", {
			path: "/missing-page",
		});
	});
});
