import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GLogo, PonderLogo } from "@/components/icons";
import { navPill } from "@/lib/cta";
import { SOCIAL_LINKS } from "@/lib/site-links";

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
