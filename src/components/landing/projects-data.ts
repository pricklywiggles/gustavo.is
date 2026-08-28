export type ProjectLink = {
	label: string;
	/**
	 * Root-relative navigates in the same tab and animates; absolute opens a new
	 * tab; null renders the action as a disabled button until wired.
	 */
	url: string | null;
};

export type Project = {
	name: string;
	description: string;
	/** Short tag shown beside the heading; omitted, no chip renders. */
	tech?: string;
	/** Action buttons: the first renders solid, the rest outlined. */
	links: ProjectLink[];
	/** Screenshot under public/projects/. null shows the standby treatment. */
	image: string | null;
	/** Width/height of the asset when it isn't 16:10; the frame adopts it so
	 * the image fills edge-to-edge instead of letterboxing. */
	imageRatio?: number;
	/** Fill behind a letterboxed asset, sampled from the asset's own ground
	 * so the frame reads as one panel; defaults to dusk-ink. */
	imageBg?: string;
};

export const PROJECTS: Project[] = [
	{
		name: "Hone",
		description:
			"A macOS and Windows TUI to practice coding problems using spaced repetition.",
		tech: "Go",
		links: [
			{ label: "Visit project", url: "https://github.com/pricklywiggles/hone" },
		],
		image: "/projects/hone-demo.gif",
		imageRatio: 1200 / 600,
	},
	{
		name: "Sanum",
		description:
			"A macOS desktop application for viewing Apple Health and FHIR clinical data on your computer, with AI that scans clinical lab-result PDFs.",
		tech: "TypeScript / Rust",
		links: [{ label: "Visit project", url: "https://sanum.app" }],
		image: "/projects/sanum.webp",
		imageBg: "#0e121a",
	},
	{
		name: "Niamos",
		description:
			"An Obsidian productivity system and second brain that leverages AI agents.",
		tech: "Agent skills / CSS theme",
		links: [
			{
				label: "Visit project",
				url: "https://github.com/pricklywiggles/niamos",
			},
		],
		image: "/projects/niamos.webp",
	},
	{
		name: "Ship it",
		description:
			"Drives issue-tracker tickets (or local changes) through plan, implement, review, and PR, concurrently across a batch, keeping living docs in step and enforcing rules. Every stage is also a standalone skill you can call on its own.",
		tech: "Claude plugin",
		links: [
			{
				label: "Visit project",
				url: "https://pricklywiggles.github.io/fractally-claude-marketplace/ship-it.html",
			},
		],
		image: "/projects/ship-it.webp",
	},
	{
		name: "Stack it",
		description:
			"Takes you from an empty folder to a fully set-up stack, giving you options and guidance at every step and quietly handling the pesky install issues and incompatible choices along the way.",
		tech: "Claude plugin",
		links: [
			{
				label: "Visit project",
				url: "https://pricklywiggles.github.io/fractally-claude-marketplace/stack-it.html",
			},
		],
		image: "/projects/stack-it.webp",
	},
	{
		name: "Ponder",
		tech: "retrospective",
		description:
			"Read a full retrospective on what the Ponder project was and what we learned from it below.",
		links: [
			{ label: "Ponder", url: "/remembering/ponder" },
			{ label: "Ponder blogs", url: "/remembering/ponder-blogs" },
		],
		image: "/projects/ponder.webp",
	},
];
