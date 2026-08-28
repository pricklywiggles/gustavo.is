import { act, fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const { push, curtainsMock } = vi.hoisted(() => {
	const pushFn = vi.fn();
	return {
		push: pushFn,
		curtainsMock: vi.fn(async (update: () => void | Promise<void>) => {
			await update();
		}),
	};
});

vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));
vi.mock("motion-plus/curtains", () => ({
	curtains: curtainsMock,
	blinds: () => ({}),
}));

import { CurtainLink, consumeScrollReset } from "./curtain-link";

/** Resolve the in-flight transaction: Back always opens the blinds. */
async function releaseCurtain() {
	await act(async () => {
		window.dispatchEvent(new PopStateEvent("popstate"));
		await new Promise((r) => setTimeout(r, 80));
	});
}

afterEach(async () => {
	await releaseCurtain();
	vi.clearAllMocks();
});

describe("CurtainLink", () => {
	it("runs one curtain transaction and mints the scroll-reset token", async () => {
		const { getByRole } = render(<CurtainLink href="/blog">Blog</CurtainLink>);
		fireEvent.click(getByRole("link", { name: "Blog" }));

		expect(curtainsMock).toHaveBeenCalledTimes(1);
		expect(push).toHaveBeenCalledWith("/blog");
		expect(consumeScrollReset("/blog")).toBe(true);
		expect(consumeScrollReset("/blog")).toBe(false);
	});

	it("coalesces rapid clicks into a single transaction", async () => {
		const { getByRole } = render(<CurtainLink href="/blog">Blog</CurtainLink>);
		const link = getByRole("link", { name: "Blog" });
		fireEvent.click(link);
		fireEvent.click(link);
		fireEvent.click(link);

		expect(curtainsMock).toHaveBeenCalledTimes(1);
		expect(push).toHaveBeenCalledTimes(1);

		// Back releases the lock, so a later click starts a fresh transaction.
		await releaseCurtain();
		fireEvent.click(link);
		expect(curtainsMock).toHaveBeenCalledTimes(2);
	});

	it("falls through to stock Link behavior for modified clicks", () => {
		const { getByRole } = render(<CurtainLink href="/blog">Blog</CurtainLink>);
		fireEvent.click(getByRole("link", { name: "Blog" }), { metaKey: true });
		expect(curtainsMock).not.toHaveBeenCalled();
	});

	it("falls through for query, hash, external, and same-path hrefs", () => {
		const { getAllByRole } = render(
			<>
				<CurtainLink href="/blog?page=2">Query</CurtainLink>
				<CurtainLink href="/blog#comments">Hash</CurtainLink>
				<CurtainLink href="https://example.com/blog">External</CurtainLink>
				<CurtainLink href="/">SamePath</CurtainLink>
			</>,
		);
		for (const link of getAllByRole("link")) {
			fireEvent.click(link);
		}
		expect(curtainsMock).not.toHaveBeenCalled();
		expect(push).not.toHaveBeenCalled();
	});

	it("skips the push when Back fires before the route change", async () => {
		curtainsMock.mockImplementationOnce(async (update) => {
			// Back lands while the cover is still closing.
			window.dispatchEvent(new PopStateEvent("popstate"));
			await update();
		});
		const { getByRole } = render(<CurtainLink href="/blog">Blog</CurtainLink>);
		fireEvent.click(getByRole("link", { name: "Blog" }));

		await waitFor(() => expect(curtainsMock).toHaveBeenCalledTimes(1));
		expect(push).not.toHaveBeenCalled();
	});
});
