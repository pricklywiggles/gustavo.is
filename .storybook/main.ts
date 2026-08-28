import type { StorybookConfig } from "@storybook/nextjs-vite";

const config: StorybookConfig = {
	stories: [
		// Docs-only pages about the system itself, not about any one component.
		"./design/**/*.mdx",
		"../src/**/*.mdx",
		"../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
	],
	addons: [
		"@storybook/addon-vitest",
		"@storybook/addon-a11y",
		"@storybook/addon-docs",
	],
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
	core: {
		disableTelemetry: true,
	},
};
export default config;
