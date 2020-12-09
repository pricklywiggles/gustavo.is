import React from "react";
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
      <div className="relative  mt-10 mb-10 bg-lt-bg dark:bg-dk-bg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div
            className="relative z-10 pb-8 md:py-10 bg-lt-bg dark:bg-dk-bg md:max-w-lg lg:max-w-2xl "
            stuff="sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32"
          >
            <svg
              className="hidden md:block transition-all  absolute right-0 inset-y-0 h-full w-48 dark:text-dk-bg text-lt-bg fill-current transform translate-x-1/2"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100" />
            </svg>

            <main className="max-w-7xl px-4 sm:px-6 md:py-10 lg:px-8">
              <div className="text-center md:text-left">
                <h1 className="text-4xl tracking-tight font-extrabold text-lt-bg-100 sm:text-5xl md:text-4xl lg:text-6xl">
                  <PonderBlogsLogo className="inline-flex align-baseline h-10 md:h-12 mx-auto md:mx-0" />{" "}
                  blogs,
                  <span className="block text-gray-800 dark:text-gray-200 xl:inline">
                    a collection of creative group blogs from the Ponder
                    community.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl md:mx-0">
                  Contributions: client and server development.
                </p>
              </div>
            </main>
          </div>
          <div className="md:absolute md:inset-y-0 h-72 md:right-0 md:w-1/2 ">
            <div
              className="absolute bg-repeat -top-2/3 -left-1/3 bg-ponder-blogs-hero animate-hero-scroll "
              style={{
                backgroundSize: "800px auto",
                width: "400%",
                height: "800%"
              }}
            ></div>
          </div>
        </div>
        {/* <div className="md:absolute md:inset-y-0 md:right-0 md:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:w-full md:h-full"
            src="/ponder-screen1.jpg"
            alt=""
          />
        </div> */}
      </div>

      <Section
        className="pb-4"
        icon={SparkleIcon}
        title="Inception and Purpose"
      >
        <div className="max-w-measure text-lg sm:text-xl leading-snug font-medium">
          <p className="pb-2 sm:pb-4">
            Ponder Blogs was a destination site where anyone could read the
            public content authored with Ponder.
          </p>
          <p className="pb-2 sm:pb-4">
            Powered by NextJS, the Ponder Blogs was a mixture of SSR (servier
            side rendered) and SSG (statically generated) content, making it
            blazingly fast while still allowing for having dynamic elements and
            instant publishing as well as advanced features like allowing
            authors to choose theme and layout variations.
          </p>
          <p>
            I was in charge of development, while the beautiful design was the
            work of my co-founder Dave Gorum
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
                      <div className="rounded-full overflow-hidden bg-white">
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
              <div className="mt-6 lg:mt-0">
                {highlights.map((highlight) => (
                  <div key={highlight} className="flex">
                    <div className="mb-3 leading-tight">
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
  nextjs: {
    name: "NextJS",
    highlights: [
      "⚛️ Server side rendering for speedy yet up to date member content",
      "⚡️ Static site generation for non-dynamic content",
      "📰 OpenGraph metadata in all pages for social site unfurling"
    ]
  },
  apollo: {
    name: "Apollo GraphQL Server",
    highlights: [
      "💫  Fully directive-based model for cypher queries, no explicit resolvers",
      "🔐 Shared codebase from Ponder client but separate schema ensures privacy of non-published data"
    ]
  },
  neo4j: {
    name: "Neo4J Graph DB",
    highlights: [
      "⚡️ Optimized indexes for data retrieval speed for blogs data"
    ]
  },
  styledComponents: {
    name: "Styled-Components",
    icon: "💅",
    highlights: ["📄 CSS-in-JS powers customized author-side 'moods' or themes"]
  },
  vercel: {
    name: "Vercel",
    highlights: [
      "📡 Native NextJS deployment solution (from CLI)",
      "🔧 Lambda function for waitlist signup",
      "🌎 Domain management"
    ]
  }
};

const lessons = [
  {
    title: (
      <div>
        Cutting edge technologies are{" "}
        <span className="text-indigo-400">not always</span> the best solution
      </div>
    ),
    content: (
      <>
        Perhaps this is better explained through example: NextJS is an amazing
        framework. After writing the Ponder client in standalone react, writing
        the blogs site with Next was a revelation. It allowed me to build fast
        and focus on the important aspects of the product. As we were beginning
        to build, Next released a new feature called Incremental Static
        Regeneration (ISR), which did on-the-fly static site generation at
        request time instead of compile time. It was way faster than SSR, worked
        like magic and had minimal setup. Unfortunately our feature-set included
        the ability for authors to change the theme of their site, and there was
        no way of making that feature &quot;feel&quot; right with ISR, since one
        couldn&apos;t invalidate the existing cache across all the blog&apos;s
        pages at once. It was a painful but right decision to use SSR instead no
        matter how much I wanted to use ISR. (someday I&apos;m sure they will
        introduce partial cache invalidation).
      </>
    )
  },
  {
    title: (
      <>
        Don&apos;t let the <span className="text-indigo-400">ideal</span> be the
        enemy of the <span className="text-indigo-400">good</span>.
      </>
    ),
    content: (
      <>
        In a way I think both me and Dave (co-founder) really like polished
        experiences (in design and code respectively). This being our company
        and it being a startup we learned that good and working is better than
        perfect and under development. This also led me to develop better
        practices of incremental refactoring.
      </>
    )
  },
  {
    title: (
      <>
        Incremental refactoring is almost always{" "}
        <span className="text-indigo-400">better than rewrites</span>.
      </>
    ),
    content: (
      <>
        The drive to rewrite something is especially strong when you are new at
        something. You&apos;re learning so much so fast that pretty soon you
        realize you could&apos;ve done things so much better. This feeling felt
        like trap, what is paramount is results in the form of having a working
        product. However, I got much better at achieving the same result by
        instead doing incremental refactoring which helped me keep the speed of
        development while also increasing stability.
      </>
    )
  },
  {
    title: (
      <>
        Code <span className="text-indigo-400">clarity</span> through
        consistency is
        <span className="text-indigo-400"> better than perfection</span>.
      </>
    ),
    content: (
      <>
        Another example: Even in a development team of one I sometimes faced the
        issue of wanting to change the way I did something, either stylistically
        or syntactically, because I learned new things or people showed me
        better ways of expressing things. When you&apos;re iterating fast
        though, I found 99% of the time it&apos;s better to stick to a correct
        (if not perfect) set of rules, have a linter enforce them and just
        forget about it.
      </>
    )
  },
  {
    title: (
      <>
        When time spent <span className="text-indigo-400">working</span> grows,
        so should my{" "}
        <span className="text-indigo-400">mindfulness practice</span>
      </>
    ),
    content: (
      <>
        Last but probably the most valuable lesson for me was that it is not
        enough for me to maintain my mindfulness practice as my work volume
        fluctuates, it is imperative that my practice grows proportional to it.
        There&apos;s a certain momentum (what I&apos;ve heard being referred to
        as &apos;codebrain&apos;) that my mind builds when programming that if
        left unchecked will continue on and bleed into the rest of my day, which
        results in a too active mind, less clarity and less sleep, which in turn
        can hurt the work. Ironically, I&apos;ve found it&apos;s especially
        necessary for me to do this when the work is fun (and it almost always
        does). I learned to stop every so often and take some time to meditate,
        then go back to work or go back about my day.
      </>
    )
  }
];

const walkthroughs = [
  {
    title: "walkthrough",
    src: "https://player.vimeo.com/video/484970796",
    highlights: [
      "Simple and elegant design by Dave Gorum to showcase content from Ponder communities",
      "Blazing fast load times thanks to SSR/SSG",
      "Chronological, collection-based and member-based content streams per blog.",
      "Personalized Blog profile",
      "Personalized Member profiles",
      "Built-in high-fidelity OpenGraph metadata for beautiful social media unfurls"
    ]
  },
  {
    title: "customization",
    src: "https://player.vimeo.com/video/482506771",
    highlights: [
      "Customize your blog&apos;s color palette with Moods.",
      "Personalize your typeface with font family presets.",
      "Preset layout options",
      "Show the world what your group blog is all about through taglines, description, logos and special link."
    ]
  }
];
