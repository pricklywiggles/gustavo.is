import { act, type ReactElement } from "react";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { vi } from "vitest";

// Motion's own hook asks the bare query; the live hook asks the full one.
const REDUCED_QUERIES = [
	"(prefers-reduced-motion)",
	"(prefers-reduced-motion: reduce)",
];

type ActGlobal = { IS_REACT_ACT_ENVIRONMENT?: boolean };

/**
 * Server-renders a tree, then hydrates it as a reduced-motion client (FRA-170): a branch
 * on the live hook shows up as a hydration error. It proves the post-hydration flip only;
 * renderToString runs with jsdom's window, so `typeof window` branches and Motion's
 * module-level snapshot see a browser on the "server" pass too (a static test pins the
 * hook rule instead).
 */
export async function hydrateReduced(load: () => Promise<ReactElement>) {
	const actGlobal = globalThis as ActGlobal;
	const previousActFlag = actGlobal.IS_REACT_ACT_ENVIRONMENT;
	const previousMatchMedia = window.matchMedia;
	const container = document.createElement("div");
	const restoreGlobals = () => {
		container.remove();
		window.matchMedia = previousMatchMedia;
		actGlobal.IS_REACT_ACT_ENVIRONMENT = previousActFlag;
	};

	// RTL only flags the act environment inside its own render; hydrateRoot is bare.
	actGlobal.IS_REACT_ACT_ENVIRONMENT = true;
	vi.resetModules();
	window.matchMedia = ((query: string) => ({
		matches: REDUCED_QUERIES.includes(query),
		media: query,
		onchange: null,
		addListener: () => {},
		removeListener: () => {},
		addEventListener: () => {},
		removeEventListener: () => {},
		dispatchEvent: () => false,
	})) as unknown as typeof window.matchMedia;

	const errors: string[] = [];
	let html = "";
	let root: Root | undefined;
	try {
		if (!window.matchMedia(REDUCED_QUERIES[1]).matches) {
			throw new Error("reduced-motion stub did not reach window.matchMedia");
		}
		const ui = await load();
		html = renderToString(ui);
		container.innerHTML = html;
		// React serializes muted="" but jsdom never initializes the property from the
		// parsed attribute, which hydration would then report as a mismatch.
		for (const video of container.querySelectorAll<HTMLVideoElement>(
			"video[muted]",
		)) {
			video.muted = true;
		}
		document.body.append(container);
		const consoleError = vi
			.spyOn(console, "error")
			.mockImplementation((...args: unknown[]) => {
				errors.push(args.map(String).join(" "));
			});
		try {
			await act(async () => {
				root = hydrateRoot(container, ui, {
					onRecoverableError: (error) => errors.push(String(error)),
				});
			});
		} finally {
			consoleError.mockRestore();
		}
	} catch (error) {
		restoreGlobals();
		throw error;
	}

	return {
		/** The server HTML, before hydration. */
		html,
		container,
		/** Hydration mismatches (recoverable errors) and console errors during hydration. */
		errors,
		unmount: async () => {
			await act(async () => root?.unmount());
			restoreGlobals();
		},
	};
}
