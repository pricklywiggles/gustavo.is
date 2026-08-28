import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SKY_BAR, SURFACE_THEMES } from "@/components/bar-themes";
import { SiteBar } from "@/components/site-bar";

/**
 * The bar content across its shipped themes (bar-themes.ts), each on the
 * ground it rides in the app. The frame chrome (theme.bar) is normally
 * applied by HostedBar, so each panel recreates that wrapper here.
 */
const meta = {
	title: "Components/Site bar",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const LINKS = [{ href: "/blog", label: "Blog" }];

const noop = () => {};

const BAR_PROPS = {
	links: LINKS,
	showContact: true,
	contactOpen: false,
	onContactIntent: noop,
	onContactOpen: noop,
	mobileOpen: false,
	onMobileToggle: noop,
};

const PANELS = [
	{
		name: "Sky bar (hero, blog index)",
		theme: SKY_BAR,
		ground: "bg-pale-dune",
		captionColor: "text-dusk-ink/60",
	},
	{
		name: "First Light surface",
		theme: SURFACE_THEMES["first-light"],
		ground: "bg-first-light",
		captionColor: "text-dusk-ink/60",
	},
	{
		name: "Dark surface (retrospectives, 404, blog posts)",
		theme: SURFACE_THEMES["dusk-ink"],
		ground: "bg-dusk-ink",
		captionColor: "text-pale-dune/60",
	},
	{
		// Its own theme rather than DARK_BAR: a warm light bar clashes with the
		// cool surface, so the bar goes dark and keeps the warm pill below it.
		name: "Day Sky surface (landfall vista)",
		theme: SURFACE_THEMES["day-sky"],
		ground: "bg-day-sky",
		captionColor: "text-dusk-ink/60",
	},
];

export const Themes: Story = {
	render: () => (
		<div className="flex min-h-screen flex-col">
			{PANELS.map(({ name, theme, ground, captionColor }) => (
				<div key={name} className={`flex-1 ${ground}`}>
					<div className={`border-b ${theme.bar}`}>
						<SiteBar {...BAR_PROPS} theme={theme} />
					</div>
					<p className={`p-4 text-xs ${captionColor}`}>{name}</p>
				</div>
			))}
		</div>
	),
};
