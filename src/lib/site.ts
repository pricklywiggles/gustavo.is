export const SITE_URL = "https://gustavo.is";
export const SITE_NAME = "gustavo.is";
export const AUTHOR_NAME = "Gustavo Gallegos";
export const SITE_DESCRIPTION =
	"Gustavo Gallegos, software engineer generalist and dog lover. 26 years across engineering, QA, product, and program management.";
export const BLOG_DESCRIPTION =
	"Notes from Gustavo Gallegos on building software, music, movies and life.";
export const FEED_PATH = "/feed.xml";

export const absoluteUrl = (path: string) => new URL(path, SITE_URL).href;

export const markdownPath = (path: string) => `/llms.mdx${path}`;
