import * as React from "react";
import { logos } from "utils/data";
import { PonderBlogsLogo } from "components/svg/logos";
import { TabbedContent } from "components/tabbed-content";
import { Section } from "components/section";
import {
  SparkleIcon,
  GradCapIcon,
  ChipIcon,
  FilmIcon
} from "components/svg/icons";

export default function PonderProject() {
  return (
    <div className="dark:text-gray-300 text-gray-800">
      <div className="relative transition-all mt-10 mb-10 bg-lt-bg dark:bg-dk-bg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative z-10 pb-8 md:py-10 bg-lt-bg dark:bg-dk-bg md:max-w-lg lg:max-w-2xl "
            stuff="sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32"
          >
            <svg
              className="hidden md:block transition-fill absolute right-0 inset-y-0 h-full w-48 dark:text-dk-bg text-lt-bg fill-current transform translate-x-1/2"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100" />
            </svg>

            <main className="max-w-7xl px-4 sm:px-6 md:py-10 lg:px-8">
              <div className="text-center md:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-lt-bg-100 sm:text-5xl md:text-4xl lg:text-6xl">
                  <PonderBlogsLogo className="h-10 md:h-12 mx-auto md:mx-0" />

                  <span className="block text-gray-800 dark:text-gray-200 xl:inline">
                    a group blogging platform.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl md:mx-0">
                  Contributions: client development, server development and
                  devOps.
                </p>
              </div>
            </main>
          </div>
        </div>
        <div
          className="md:absolute  md:inset-y-0 h-72 md:right-0 md:w-1/2"
          stuff=""
        >
          <div
            className="absolute bg-repeat bg-white -top-1/2 -left-1/3  bg-ponder-hero animate-hero-scroll"
            style={{
              height: "800%",
              width: "400%",
              backgroundSize: "800px auto"
            }}
          />
        </div>
      </div>

      <Section
        className="pb-4"
        icon={SparkleIcon}
        title="Inception and Purpose"
      >
        <div className="max-w-measure text-lg sm:text-xl leading-snug font-medium">
          <p className="pb-2 sm:pb-4">
            Founded in early 2019 by Kristen Pavle, Dave Gorum and me (Gustavo
            Gallegos), Ponder was a blogging platform focused on simplicity
            aimed at people that wanted to publish a blog collaboratively.
          </p>
          <p className="pb-2 sm:pb-4">
            We built a product where small groups of people collaborated on
            creating content, had private discussions and published their
            content to the web.
          </p>
          <p>
            We worked hard to design a product that would promote meaningful
            content and meaningful discussions as a small counterbalance to
            pervailing social media trends.
          </p>
        </div>
      </Section>

      <Section icon={GradCapIcon} title="Lessons learned">
        <TabbedContent>
          {lessons.map(({ title, content }) => (
            <div
              key={title}
              className="lg:flex lg:justify-between ml-4 sm:ml-8 md:ml-16"
            >
              <div className="text-lg pb-2 sm:text-2xl leading-snug font-semibold">
                {title}
              </div>
              <div className="max-w-measure lg:ml-20 text-sm sm:text-lg sm:leading-snug">
                {content}
              </div>
            </div>
          ))}
        </TabbedContent>
      </Section>

      <Section
        className="pt-10"
        icon={ChipIcon}
        title="Technologies and Integrations"
      >
        <div className="mt-8 sm:grid sm:grid-cols-2 ">
          {Object.entries(technologies).map(
            ([key, { name, highlights, icon }]) => (
              <div key={name} className="mb-10">
                <div className="">
                  {logos[key] ? (
                    React.createElement(logos[key].component, {
                      className: `w-28 h-28 mx-auto ${
                        logos[key].themed
                          ? "fill-current dark:text-indigo-400"
                          : ""
                      }`
                    })
                  ) : (
                    <div className="flex justify-center text-8xl text-center mx-auto pb-4 min-h-full">
                      <div className="rounded-full overflow-hidden bg-lt-bg">
                        {icon}
                      </div>
                    </div>
                  )}
                </div>
                <div
                  key={name}
                  className="flex flex-col -mt-14 mx-10 lg:mx-20 p-4 pt-16 text-center bg-white dark:bg-dk-bg-200 rounded-xl border border-lt-bg dark:border-2 dark:border-dk-bg-400 shadow-md"
                >
                  <div className="mb-2 pt-2 pb-2 font-semibold uppercase border-t  border-b text-gray-800 border-gray-300 dark:border-dk-bg-400">
                    {name}
                  </div>
                  <div className="text-gray-500 self-center md:w-4/5 ">
                    {highlights.map((highlight) => (
                      <div key={highlight}>{highlight}</div>
                    ))}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </Section>

      <Section icon={FilmIcon} title="Feature Showcase">
        <TabbedContent
          showSideline={false}
          labels={walkthroughs.map((feature) => feature.title)}
        >
          {walkthroughs.map(({ title, src, highlights }) => (
            <div className="flex flex-col mx-4 lg:flex-row" key={title}>
              <div className="w-full lg:pr-8 lg:w-8/12">
                <div className="relative block h-0 p-0 overflow-hidden aspect-ratio-16/9">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    title={title}
                    src={src}
                    frameBorder="0"
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
              <div className="mt-6 lg:mt-0 lg:w-4/12">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex">
                    <div className="mb-2 leading-tight">
                      <span role="img" aria-label="hand pointing right">
                        👉🏼
                      </span>{" "}
                      {highlight}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabbedContent>
      </Section>
    </div>
  );
}

const technologies = {
  react: {
    name: "React",
    highlights: [
      "📄 React single page app",
      "📦 Bundled with Parcel",
      "🪝 Modern hook based architecture"
    ]
  },
  urql: {
    name: "Urql",
    highlights: [
      "🕊 Lightweight GraphQL client",
      "🏪 Normalized cache",
      "🔒 Custom auth exchange",
      "⚡️ Subscriptions for real time notifications"
    ]
  },
  neo4j: {
    name: "Neo4J Graph DB",
    highlights: [
      "🔌 Our own model and js driver code",
      "💾 Simple analytics scripts",
      "💫 Cypher graphql directives"
    ]
  },
  vercel: {
    name: "Vercel",
    invertable: true,
    highlights: [
      "📡 SPA Client deployment",
      "🔧 Utility lambda functions (JS)",
      "🌎 Domain management"
    ]
  },
  digitalOcean: {
    name: "DigitalOcean",
    highlights: [
      "🏚 GraphQL server hosting",
      "👯‍♂️ Deployed production, development and staging environments",
      "📦 AWS S3 compatible storage"
    ]
  },
  apollo: {
    name: "Apollo GraphQL Server",
    invertable: true,
    highlights: [
      "🔑 JWT expiration/refresh auth",
      "💫 authentication directives",
      "🗞 PubSub based subscriptions for real time notifications"
    ]
  },
  styledComponents: {
    name: "Styled-Components",
    icon: "💅",
    highlights: ["📄 CSS-in-JS to power Dave Gorum's beautiful design"]
  },
  integrations: {
    name: "Integrations",
    icon: "🤝",
    highlights: [
      "📧 Postmark (email notifications)",
      "📈 Segment (analytics)",
      "🌄 Unsplash (photos)",
      "💾 DigitalOcean (storage)"
    ]
  }
};

const lessons = [
  {
    title: <div className="text-indigo-400">Utility is paramount.</div>,
    content: (
      <>
        Although finding my co-founders was not only unexpected but also quick,
        the process of distilling our purpose and ideas into a cohesive product
        idea took some time. Refining the need and the solution that fulfills it
        must happen as soon as humanly possible to begin testing the market. The
        details of establishing a company and its principles can be a small side
        project or left for later in favor of small, incremental rounds of
        development to test utility in order to validate the product idea.
      </>
    )
  },
  {
    title: (
      <>
        Asking for <span className="text-indigo-400">help</span> and honoring
        the need of being part of a{" "}
        <span className="text-indigo-400">community</span>.
      </>
    ),
    content: (
      <>
        Being the only technical founder could feel like a lonely affair. This
        was accentuated by the fact that this my first time back as a developer
        after several years of working as a Technical Program Manager. Even the
        technologies I already knew, have changed a lot in just a few years
        (just look at javascript), not to mention all the ones that were new to
        me like GraphQL and graph databases. The longer I went the more excited
        I became about what I was learning, but sometimes I felt there
        wasn&apos;t someone to effectively share that excitement with.
        Thankfully this led to me reaching out not only to ask for help in
        learning but also to share the way I felt online, mostly in Discord
        groups (shout out to @kentcdodds), this helped me stay in touch with
        like-minded people I could learn from.
      </>
    )
  },
  {
    title: (
      <>
        <span className="text-indigo-400">Be decisive</span> when choosing a
        stack
      </>
    ),
    content: (
      <>
        The good news about being the technology officer is that you get to call
        the shots about what tech to use, the bad news is that you&apos;re at
        faced with the tyranny of choice. I learned that you should time-box
        doing due diligence and research, get feedback from people you trust,
        make a decision and stick with it. It is very unlikely that the benefits
        of switching to a new framework, language, or tech once you&apos;ve made
        significant progress will outweigh the compound gains of having learned
        your original choice. Consistency and mastery trump perfection.
      </>
    )
  },
  {
    title: (
      <>
        The importance of{" "}
        <span className="text-indigo-400">being open to change</span>
      </>
    ),
    content: (
      <>
        Situations change. Your understanding of situations also change, new
        evidence is found every day and I must always be open to changing my
        assumptions of what the product should be based on the available
        evidence. At times it was difficult to change course when it involved
        the loss of work that was already done, especially because development
        time was our most needed resource. I learned to analyze the data at hand
        and course correct to the reality that it presents, no matter the sunk
        costs.
      </>
    )
  },
  {
    title: (
      <>
        <span className="text-indigo-400">Open communication</span> is essential
      </>
    ),
    content: (
      <>
        2019-2020 in hindsight was not the best time to start a company
        (understatement of the year). Even though remote collaboration has come
        a long way, before the pandemic it was easy to get together with my
        partners and hash out big ideas and lay out a direction and plan of
        action, course correcting as we went. Even small amounts of face to face
        interaction quickly became impossible come 2020. I learned for a team to
        charge ahead in the same direction at such an early stage, everyone must
        be be frank about not only their technical challenges but their personal
        relationship with work. When building a company with others, it&apos;s
        important to help people understand how you feel about the work and how
        they can help you make it better.
      </>
    )
  },
  {
    title: (
      <>
        <span className="text-indigo-400">Continuously learn</span> with clear
        direction informed by{" "}
        <span className="text-indigo-400">excitement</span>.
      </>
    ),
    content: (
      <>
        I&apos;ve never learned so many things and applied them in such a short
        period of time. I learned you have to start before you feel confident,
        and incrementally refactor as you learn more. When looking at old code I
        learned to stop cringing and instead thank myself for having taken that
        first step. I learned that learning itself is addictive so it must be
        done with focus and direction towards a goal or it can become an
        obstacle to producing results. Finally, I learned that I must factor in
        excitement as a compass to help guide me on the areas of focus, as it
        helps the work feel like{" "}
        <span className="inline-block animate-bounce font-semibold text-indigo-400">
          play
        </span>
        .
      </>
    )
  }
];

const walkthroughs = [
  {
    title: "editor",
    src: "https://player.vimeo.com/video/482506828",
    highlights: [
      "Chatlog-style blog post authoring",
      "Optimistic updates",
      "Continuous auto-save",
      "Independent inputs can be reordered, edited or deleted",
      "Images can be uploaded via file upload or drag and drop ",
      "Unlimited image uploads",
      "Images stored in DigitalOcean Spaces via AWS S3 driver"
    ]
  },
  {
    title: "conversations",
    src: "https://player.vimeo.com/video/482506771",
    highlights: [
      "One-on-one conversations for more meaningful discussions",
      "Private to the group, conversations are not published to the blog.",
      "Message inbox",
      "Real-time in-app notifications powered by GraphQL subscriptions (urql client, apollo server).",
      "Email notifications via PostMark"
    ]
  },
  {
    title: "collections",
    src: "https://player.vimeo.com/video/482505654",
    highlights: [
      "Organize your content by adding posts to collections shared with all members of the blog.",
      "View collection feeds.",
      "Personalize your collection with cover image and metadata.",
      "Assign a unique url to a collection feed to share with anyone."
    ]
  },
  {
    title: "groups",
    src: "https://player.vimeo.com/video/482507258",
    highlights: [
      "Create up to 10 different blogs",
      "Invite any number of members",
      "Each blog is private and isolated from the rest, with its own set of members.",
      "A privacy-first model gives you a different identity for each blog while still being able to context switch between them from any screen.",
      "Owner can assign (and revoke) admin privileges to any member.",
      "Pinnable announcements for members feeds."
    ]
  },
  {
    title: "publishing",
    src: "https://player.vimeo.com/video/482507338",
    highlights: [
      "Once a blog is made public, all published content is available at a personalized ponder.to/[blog] url.",
      "Public blogs can be personalized by admins by adding moods (color themes, layout, font and styling presets) from the app.ponder.to site at any time making each blog unique.",
      "The public-facing blog site is a separate SSR NextJS application, you can read more about it in the Ponder Blogs project exploration page."
    ]
  }
];
