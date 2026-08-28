import { render, screen, waitFor } from "@testing-library/react";
import { domMax, LazyMotion } from "motion/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactDialog } from "./contact-dialog";

const reducedState = { value: true };
vi.mock("@/components/use-reduced-motion-live", () => ({
	useReducedMotionLive: () => reducedState.value,
}));

afterEach(() => {
	reducedState.value = true;
});

// The app mounts the dialog under LazyMotion; without the provider `m` has no exit
// feature and AnimatePresence unmounts instantly in both modes.
const ui = (open: boolean) => (
	<LazyMotion features={domMax}>
		<ContactDialog
			open={open}
			onOpenChange={() => {}}
			morphId="hello"
			source="header"
		/>
	</LazyMotion>
);

describe("ContactDialog close timing", () => {
	it("closes within a frame or two under reduced motion", async () => {
		const { rerender } = render(ui(true));
		expect(await screen.findByRole("dialog")).toBeTruthy();
		rerender(ui(false));
		// Measured ~25ms with the provider; the color handback held it 300ms before.
		await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull(), {
			timeout: 250,
		});
	});

	it("still holds the popup for its exit tweens under motion", async () => {
		reducedState.value = false;
		const { rerender } = render(ui(true));
		expect(await screen.findByRole("dialog")).toBeTruthy();
		rerender(ui(false));
		await new Promise((resolve) => setTimeout(resolve, 150));
		expect(screen.queryByRole("dialog")).not.toBeNull();
	});
});
