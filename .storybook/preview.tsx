import type { Preview } from "@storybook/nextjs-vite";
import { fontVariables } from "../src/app/fonts";
import "../src/app/globals.css";

// The app puts the next/font variable classes on <html>, and that placement
// is load-bearing: globals.css declares --font-sans/--font-display on :root
// as var(--font-wotfard)/var(--font-kitora), and custom properties resolve
// where declared. A wrapper-div decorator sits below :root, so the tokens
// resolve to invalid before the wrapper's variables exist. Mirror the app.
document.documentElement.classList.add(...fontVariables.split(" "));

const preview: Preview = {
	parameters: {
		// App-router mocks for next/navigation (CurtainLink's useRouter,
		// SiteBar's usePathname); without this the pages-router mock applies.
		nextjs: { appDirectory: true },

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			// 'todo' - show a11y violations in the test UI only
			// 'error' - fail CI on a11y violations
			// 'off' - skip a11y checks entirely
			test: "todo",
		},
	},
};

export default preview;
