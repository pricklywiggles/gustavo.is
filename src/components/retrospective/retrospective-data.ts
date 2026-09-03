/** Copy from the sunset ponder.to site; the duplicate "Customization" video id is deliberate. */

import type { OgImage } from "@/lib/site-metadata";

export type TextRun = string | { text: string; href: string };
export type Paragraph = TextRun[];

export type Lesson = { id: string; title: string; body: Paragraph };

export function paragraphText(paragraph: Paragraph): string {
	return paragraph
		.map((run) => (typeof run === "string" ? run : run.text))
		.join("");
}

export type Technology = {
	name: string;
	type: string;
	highlights: string[];
	/** Painted as a CSS mask: color in the asset is discarded. */
	icon?: string;
};

export type Feature = {
	id: string;
	name: string;
	/** Vimeo player url; the facade appends its own playback params. */
	videoUrl: string;
	videoTitle: string;
	highlights: string[];
	/** Self-hosted still for the video facade. */
	poster: string;
};

/** The client-side shape: `highlights` is stripped so it never rides the RSC payload. */
export type FeatureCard = Omit<Feature, "highlights">;

export type Retrospective = {
	slug: string;
	ogImage: OgImage;
	/** Follows the wordmark in the h1, e.g. Ponder "blogs,". */
	wordmarkSuffix?: string;
	tagline: string;
	contributions: string;
	years: string;
	mural: string;
	metaTitle: string;
	metaDescription: string;
	purpose: Paragraph[];
	lessons: Lesson[];
	technologies: Technology[];
	features: Feature[];
};

const DAVE_GORUM = {
	text: "Dave Gorum",
	href: "https://twitter.com/davegorum",
} as const;

export const PONDER: Retrospective = {
	slug: "ponder",
	ogImage: "ponder",
	tagline: "a group blogging platform.",
	contributions: "Client development, server development and devOps.",
	years: "2019 to 2021",
	mural: "/retrospectives/ponder-mural.webp",
	metaTitle: "Ponder, a group blogging platform",
	metaDescription:
		"A look back at Ponder: what it was, the technologies behind it, and the lessons I took away from building it.",
	purpose: [
		[
			"Founded in early 2019 by ",
			{ text: "Kristen Pavle", href: "https://twitter.com/khpavle" },
			", ",
			DAVE_GORUM,
			" and me (Gustavo Gallegos), Ponder was a blogging platform focused on simplicity aimed at people that wanted to publish a blog collaboratively.",
		],
		[
			"We built a product where friends could create content together, have private discussions and publish their work to the web.",
		],
		[
			"We worked hard to design a product that would promote meaningful content and meaningful discussions as a small counterbalance to prevailing social media trends.",
		],
	],
	lessons: [
		{
			id: "utility",
			title: "Utility is paramount.",
			body: [
				"Although finding my co-founders was not only unexpected but also quick, the process of distilling our purpose and ideas into a cohesive product plan took some time. Refining the market need and its proposed solution must happen as soon as humanly possible to begin testing your assumptions. The details of establishing a company and its principles can be a small side project or postponed in favor of small, incremental rounds of development to test utility in order to validate the product idea.",
			],
		},
		{
			id: "community",
			title: "Ask for help and honor the need of being part of a community.",
			body: [
				"Being the only technical founder sometimes felt like a lonely affair, especially being the first time back as a developer after several years of working as a Technical Program Manager. Even the technologies I knew had changed drastically in just a few years (just look at javascript), not to mention the new ones like GraphQL and graph databases. As time passed I became more excited about what I was learning, but sometimes I felt there wasn't someone to effectively share that excitement with. Thankfully this led me to search out communities where I could not only ask for learning help but also share the way I felt in general, mostly in Discord groups (shout out to ",
				{ text: "Kent C. Dodds", href: "https://kentcdodds.com/" },
				"). This helped me stay in touch with like-minded people I could learn from.",
			],
		},
		{
			id: "decisiveness",
			title: "Be decisive when choosing a stack.",
			body: [
				"The good news about being the technology officer is that you get to call the shots about what tech to use, the bad news is having to face the tyranny of choice. I learned that you should time-box doing due diligence and research, get feedback from people you trust, make a decision and stick with it. It is very unlikely that the benefits of switching to a new framework, language, or tech once you've made significant progress will outweigh the compound gains of having learned your original choice. Consistency and mastery trump perfection.",
			],
		},
		{
			id: "change",
			title: "Be open to change.",
			body: [
				"Situations change. My understanding of situations also changes, I must always be open to change my assumptions of what the product should be based on the available evidence. At times it was difficult to change course when it involved the loss of work that was already done, especially because development time was our most needed resource. I learned to analyze the data at hand and course correct to the reality that it presents, no matter the sunk costs.",
			],
		},
		{
			id: "communication",
			title: "Open communication is essential.",
			body: [
				"2019-2020 in hindsight was not the best time to start a company (understatement of the year). Even though remote collaboration has come a long way, prior to the pandemic it was easy to get together with my partners and hash out big ideas and lay out a direction and plan of action, course correcting as we went. Even small amounts of face to face interaction quickly became impossible come 2020. I learned that for a team to charge ahead in the same direction at such an early stage, everyone must be frank about not only their technical challenges but their emotional state and personal relationship with work. When building a company with others, it's important to help people understand how you feel about the work and how they can help you make things better.",
			],
		},
		{
			id: "learning",
			title: "Continuously learn with clear direction informed by excitement.",
			body: [
				"I've never learned so many things and applied them in such a short period of time. I learned you have to start before you feel confident, and incrementally refactor as you learn more. When looking at old code I learned to stop cringing and instead thank myself for having taken that first step. I learned that learning itself is addictive so it must be done with focus and direction towards a goal or it can become an obstacle to producing results. Finally, I learned that I must factor in excitement as a compass to help guide me on what areas to focus, making the work feel more like play.",
			],
		},
	],
	technologies: [
		{
			name: "React",
			icon: "/retrospectives/tech/react.svg",
			type: "Client framework",
			highlights: [
				"React SPA",
				"Bundled with Parcel",
				"Modern hook-based architecture",
			],
		},
		{
			name: "Urql",
			type: "GraphQL client",
			highlights: [
				"Lightweight GraphQL client",
				"Normalized cache",
				"Homegrown auth exchange",
				"Subscriptions for real time notifications",
			],
		},
		{
			name: "Neo4j Aura",
			icon: "/retrospectives/tech/neo4j.svg",
			type: "Graph database",
			highlights: [
				"Cypher resolvers for complex queries",
				"Simple analytics scripts",
				"Cypher GraphQL directive for simple queries",
			],
		},
		{
			name: "Apollo GraphQL Server",
			icon: "/retrospectives/tech/apollo.svg",
			type: "GraphQL server",
			highlights: [
				"JWT expiration and refresh auth",
				"Authentication directives",
				"PubSub based subscriptions for real time notifications",
			],
		},
		{
			name: "Vercel",
			icon: "/retrospectives/tech/vercel.svg",
			type: "Client hosting and deployment",
			highlights: [
				"SPA client deployment",
				"Utility lambda functions (JS)",
				"Domain management",
			],
		},
		{
			name: "DigitalOcean",
			icon: "/retrospectives/tech/digitalocean.svg",
			type: "Server and media hosting",
			highlights: [
				"GraphQL server hosting",
				"Production, development and staging environments",
				"AWS S3 compatible storage",
			],
		},
		{
			name: "Styled Components",
			icon: "/retrospectives/tech/styled-components.svg",
			type: "CSS in JS library",
			highlights: ["CSS-in-JS to power Dave Gorum's beautiful design"],
		},
		{
			name: "Integrations",
			type: "Services used",
			highlights: [
				"Postmark (email notifications)",
				"Segment (analytics)",
				"Unsplash (photos)",
				"DigitalOcean (storage)",
				"Sentry (exception reporting)",
			],
		},
	],
	features: [
		{
			id: "editor",
			name: "Editor",
			videoUrl: "https://player.vimeo.com/video/482506828",
			poster: "/retrospectives/posters/482506828.jpg",
			videoTitle: "Ponder editor walkthrough",
			highlights: [
				"Chatlog-style blog post authoring",
				"Optimistic updates",
				"Continuous auto-save",
				"Independent inputs can be reordered, edited or deleted",
				"Images can be uploaded via file upload or drag and drop",
				"Unlimited image uploads",
				"Images stored in DigitalOcean Spaces via the AWS S3 driver",
			],
		},
		{
			id: "conversations",
			name: "Conversations",
			videoUrl: "https://player.vimeo.com/video/482506771",
			poster: "/retrospectives/posters/482506771.jpg",
			videoTitle: "Ponder conversations walkthrough",
			highlights: [
				"One-on-one conversations for more meaningful discussions",
				"Private to the group: conversations are not published to the blog",
				"Message inbox",
				"Real-time in-app notifications powered by GraphQL subscriptions (urql client, apollo server)",
				"Email notifications via Postmark",
			],
		},
		{
			id: "collections",
			name: "Collections",
			videoUrl: "https://player.vimeo.com/video/482505654",
			poster: "/retrospectives/posters/482505654.jpg",
			videoTitle: "Ponder collections walkthrough",
			highlights: [
				"Organize your content by adding posts to collections shared with all members of the blog",
				"View collection feeds",
				"Personalize your collection with cover image and metadata",
				"Assign a unique url to a collection feed to share with anyone",
			],
		},
		{
			id: "groups",
			name: "Groups",
			videoUrl: "https://player.vimeo.com/video/482507258",
			poster: "/retrospectives/posters/482507258.jpg",
			videoTitle: "Ponder groups walkthrough",
			highlights: [
				"Create up to 10 different blogs",
				"Invite any number of members",
				"Each blog is private and isolated from the rest, with its own set of members",
				"A privacy-first model gives you a different identity for each blog while still being able to context switch between them from any screen",
				"Owner can assign (and revoke) admin privileges to any member",
				"Pinnable announcements for member feeds",
			],
		},
		{
			id: "publishing",
			name: "Publishing",
			videoUrl: "https://player.vimeo.com/video/482507338",
			poster: "/retrospectives/posters/482507338.jpg",
			videoTitle: "Ponder publishing walkthrough",
			highlights: [
				"Once a blog is made public, all published content is available at a personalized ponder.to/[blog] url",
				"Public blogs can be personalized by admins by adding moods (color themes, layout, font and styling presets) from the app.ponder.to site at any time, making each blog unique",
				"The public-facing blog site is a separate SSR Next.js application, covered in the Ponder Blogs retrospective",
			],
		},
	],
};

export const PONDER_BLOGS: Retrospective = {
	slug: "ponder-blogs",
	ogImage: "ponder-blogs",
	wordmarkSuffix: "blogs,",
	tagline: "a collection of creative blogs from the Ponder community.",
	contributions: "Client and server development.",
	years: "2020 to 2021",
	mural: "/retrospectives/ponder-blogs-mural.webp",
	metaTitle: "Ponder Blogs, a public blog destination",
	metaDescription:
		"After sunsetting Ponder Blogs, I spent some time reflecting on the lessons I learned building it.",
	purpose: [
		[
			"Ponder Blogs was a destination site where anyone could read the public content authored with Ponder.",
		],
		[
			"Powered by Next.js, Ponder Blogs was a mixture of SSR (server side rendered) and SSG (statically generated) content, making it blazingly fast while still allowing for dynamic elements and instant publishing as well as advanced features like allowing authors to choose theme and layout variations.",
		],
		[
			"I was in charge of development, while the beautiful design was the work of my co-founder ",
			DAVE_GORUM,
			".",
		],
	],
	lessons: [
		{
			id: "tech",
			title: "Cutting edge technologies are not always the best solution.",
			body: [
				"Perhaps this is better explained through example: Next.js is an amazing framework. After writing the Ponder client in standalone React, writing the blogs site with Next.js was a revelation. It allowed me to build fast and focus on the important aspects of the product. As we were beginning to build, Next released a new feature called Incremental Static Regeneration (ISR), which did on-the-fly static site generation at request time instead of compile time. It was way faster than SSR, worked like magic and had minimal setup. Unfortunately our feature-set included the ability for authors to change the theme of their site, and there was no way of making that feature \"feel\" right with ISR, since one couldn't invalidate the existing cache across all the blog's pages at once. It was a painful but right decision to use SSR instead no matter how much better ISR was in every other respect (someday I'm sure they will introduce partial cache invalidation).",
			],
		},
		{
			id: "ideal",
			title: "Don't let the ideal be the enemy of the good.",
			body: [
				"In a way I think both me and Dave (co-founder) really like polished experiences (in design and code respectively). This being our company and it being a startup we learned that good and working is better than perfect and under development. This also led me to develop better practices for incremental refactoring.",
			],
		},
		{
			id: "refactor",
			title: "Incremental refactoring is almost always better than rewrites.",
			body: [
				"The drive to rewrite something is especially strong when you are new at something. You're learning so much so fast that pretty soon you realize you could've done things so much better. This feeling felt like a trap. What is paramount is results in the form of having a working product. However, I got much better at achieving the same result by instead doing incremental refactoring which helped me keep the speed of development while also increasing stability.",
			],
		},
		{
			id: "consistency",
			title: "Code clarity through consistency is better than perfection.",
			body: [
				"Even in a development team of one I sometimes faced the issue of wanting to change the way I did something, either stylistically or syntactically, because I learned new things or people showed me better ways of expressing things. When you're iterating fast though, I found 99% of the time it's better to stick to a correct (if not perfect) set of rules, have a linter enforce them and just forget about it.",
			],
		},
		{
			id: "mindfulness",
			title: "As time spent working grows, so should my mindfulness practice.",
			body: [
				"Last but probably the most valuable lesson for me was that it is not enough to maintain my mindfulness practice as my work volume fluctuates. It is imperative that my practice grows proportional to it. There's a certain momentum (what I've heard being referred to as \"codebrain\") that my mind builds when programming that if left unchecked will continue on and bleed into the rest of my day (or most often, night), resulting in a too active mind, less clarity and less sleep, in turn affecting the work. Ironically, I've found it's especially necessary for me to do this when the work is the most fun. I learned to stop frequently and take some time to meditate, then go back to work or go back about my day.",
			],
		},
	],
	technologies: [
		{
			name: "Next.js",
			icon: "/retrospectives/tech/next.svg",
			type: "Client framework",
			highlights: [
				"Server side rendering for speedy yet up to date member content",
				"Static site generation for non-dynamic content",
				"OpenGraph metadata in all pages for social site unfurling",
			],
		},
		{
			name: "Apollo GraphQL Server",
			icon: "/retrospectives/tech/apollo.svg",
			type: "GraphQL server",
			highlights: [
				"Fully directive-based model for cypher queries, no explicit resolvers",
				"Shared codebase from the Ponder client, but a separate schema ensures privacy of non-published data",
			],
		},
		{
			name: "Neo4j Aura",
			icon: "/retrospectives/tech/neo4j.svg",
			type: "Graph database",
			highlights: ["Optimized indexes for speedy blogs data retrieval"],
		},
		{
			name: "Styled Components",
			icon: "/retrospectives/tech/styled-components.svg",
			type: "CSS in JS library",
			highlights: ["CSS-in-JS powers customized author-side moods, or themes"],
		},
		{
			name: "Vercel",
			icon: "/retrospectives/tech/vercel.svg",
			type: "Client hosting and deployment",
			highlights: [
				"Native Next.js deployment solution (from CLI)",
				"Lambda function for waitlist signup",
				"Domain management",
			],
		},
	],
	features: [
		{
			id: "walkthrough",
			name: "Walkthrough",
			videoUrl: "https://player.vimeo.com/video/484970796",
			poster: "/retrospectives/posters/484970796.jpg",
			videoTitle: "Ponder Blogs walkthrough",
			highlights: [
				"Simple and elegant design by Dave Gorum to showcase content from Ponder communities",
				"Blazing fast load times thanks to SSR and SSG",
				"Chronological, collection-based and member-based content streams per blog",
				"Personalized blog info page",
				"Personalized member profiles",
				"Built-in high-fidelity OpenGraph metadata for beautiful social media unfurls",
			],
		},
		{
			id: "customization",
			name: "Customization",
			videoUrl: "https://player.vimeo.com/video/484967092",
			poster: "/retrospectives/posters/484967092.jpg",
			videoTitle: "Ponder Blogs customization walkthrough",
			highlights: [
				"Customize your blog's color palette with Moods",
				"Personalize your typeface with font family presets",
				"Preset layout options",
				"Show the world what your group blog is all about through taglines, description, logos and a special link",
			],
		},
	],
};

/** The sitemap, llms index, and markdown mirrors all fan out from this list. */
export const RETROSPECTIVES: readonly Retrospective[] = [PONDER, PONDER_BLOGS];
