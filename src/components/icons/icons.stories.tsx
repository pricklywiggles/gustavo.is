import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GLogo, PonderLogo } from "@/components/icons";
import { navPill } from "@/lib/cta";
import { SOCIAL_LINKS } from "@/lib/site-links";

/**
 * The inlined icon set. Every mark but Ponder's paints in currentColor, so it
 * picks up its host's theme rather than carrying a colour of its own.
 */
const meta = {
	title: "Components/Icons",
	parameters: { layout: "fullscreen" },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const TONES = [
	{ name: "First Light bar", ground: "bg-sand-haze", color: "text-dusk-earth" },
	{ name: "Sky bar", ground: "bg-pale-dune", color: "text-dusk-ink" },
	{ name: "Dark bar", ground: "bg-dusk-earth", color: "text-pale-dune" },
];

/** The G mark on each shipped bar tone; it rides the site bar and mobile menu. */
export const BarTones: Story = {
	render: () => (
		<div className="flex min-h-screen flex-col">
			{TONES.map(({ name, ground, color }) => (
				<div
					key={name}
					className={`flex flex-1 items-center gap-6 p-10 ${ground} ${color}`}
				>
					<GLogo className="h-10 w-auto" />
					<span className="text-xs opacity-60">{name}</span>
				</div>
			))}
		</div>
	),
};

/**
 * The socials come from SOCIAL_LINKS, so this gallery covers whatever the footer
 * ships. They wear the footer's own icon pill on Dusk Earth.
 */
export const Social: Story = {
	render: () => (
		<div className="min-h-screen bg-dusk-earth p-12">
			<ul className="flex items-center gap-2">
				{SOCIAL_LINKS.map(({ href, label, Icon }) => (
					<li key={href}>
						<a
							href={href}
							target="_blank"
							rel="me noreferrer"
							aria-label={label}
							className={`${navPill({ variant: "icon", tone: "dark" })} text-first-light/85 hover:text-first-light`}
						>
							<Icon className="size-[18px]" />
						</a>
					</li>
				))}
			</ul>
			<p className="mt-6 text-pale-dune/60 text-xs">
				{SOCIAL_LINKS.map((s) => s.label).join(" · ")}
			</p>
		</div>
	),
};

/**
 * Ponder's wordmark on the retrospective hero's ground. Its coral is hard-coded
 * rather than taken from the One Ramp: it is Ponder's brand colour, the same
 * exception the marks in public/logos/ get.
 */
export const PonderWordmark: Story = {
	render: () => (
		<div className="flex min-h-screen items-center gap-6 bg-dusk-earth p-12">
			<PonderLogo className="block h-16 w-auto" />
			<span className="text-pale-dune/60 text-xs">
				retrospective hero · off-ramp by exception
			</span>
		</div>
	),
};
