import { BlueskyIcon, GitHubIcon, LinkedInIcon } from "@/components/icons";

export const HOME_LINK = { href: "/", label: "Home" } as const;
export const BLOG_LINK = { href: "/blog", label: "Blog" } as const;
export const CONTACT_LINK = { href: "/contact", label: "Contact" } as const;

export const LANDING_TEXT_LINKS = [BLOG_LINK] as const;
export const INNER_TEXT_LINKS = [HOME_LINK, BLOG_LINK] as const;

export const FOOTER_LINKS = [BLOG_LINK, CONTACT_LINK] as const;

export const SOCIAL_LINKS = [
	{
		href: "https://www.linkedin.com/in/gustavogallegos",
		label: "LinkedIn",
		Icon: LinkedInIcon,
		external: true,
	},
	{
		href: "https://bsky.app/profile/pricklywiggles.bsky.social",
		label: "Bluesky",
		Icon: BlueskyIcon,
		external: true,
	},
	{
		href: "https://github.com/pricklywiggles",
		label: "GitHub",
		Icon: GitHubIcon,
		external: true,
	},
] as const;
