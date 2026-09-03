import type { Preview } from "@storybook/nextjs-vite";
import { fontVariables } from "../src/app/fonts";
import "../src/app/globals.css";

// Custom properties resolve where declared: the :root font tokens fail under a wrapper decorator.
document.documentElement.classList.add(...fontVariables.split(" "));

const preview: Preview = {
	parameters: {
		// next/navigation app-router mocks; without this the pages-router mock applies.
		nextjs: { appDirectory: true },

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: "todo",
		},
	},
};

export default preview;
