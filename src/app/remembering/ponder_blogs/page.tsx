import React from 'react';
import { PonderBlogsLogo } from '@/components/logos';
import { TabbedContent } from '@/components/tabbed-content';
import { Section } from '@/components/section';
import {
  SparkleIcon,
  GradCapIcon,
  ChipIcon,
  FilmIcon
} from '@/components/icons';
import { TechnologyCard } from '@/components/technology-card';
import { buildStaticMetadata } from '@/utils/opengraph';

export default function PonderBlogsProject() {
  return (
    <div className="dark:text-gray-300 text-gray-800">
      <div className="relative  mt-10 mb-10 bg-lt-bg dark:bg-dk-bg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative transition-all duration-500 z-10 pb-8 md:py-10 bg-lt-bg dark:bg-dk-bg md:max-w-lg lg:max-w-2xl ">
            <svg
              className="hidden md:block transition-all duration-500 absolute right-0 inset-y-0 h-full w-48 dark:text-dk-bg text-lt-bg fill-current transform translate-x-1/2"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <polygon points="50,0 100,0 50,100" />
            </svg>

            <main className="max-w-7xl px-4 sm:px-6 md:py-10 lg:px-8">
              <div className="text-center md:text-left text-gray-800 dark:text-gray-200 ">
                <h1 className="text-4xl tracking-tight font-extrabold  sm:text-5xl md:text-4xl lg:text-6xl">
                  <PonderBlogsLogo className="inline-flex align-baseline h-10 md:h-12 mx-auto md:mx-0" />{' '}
                  blogs,
                  <span className="block xl:inline">
                    a collection of creative blogs from the Ponder community.
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
                backgroundSize: '800px auto',
                width: '400%',
                height: '800%'
              }}
            ></div>
          </div>
        </div>
      </div>

      <Section
        className="pb-4"
        icon={SparkleIcon}
        title="Inception and Purpose"
      >
        <div className="pb-2 max-w-measure text-lg sm:text-xl leading-snug font-medium">
          <p className="pb-2 sm:pb-4">
            Ponder Blogs was a destination site where anyone could read the
            public content authored with Ponder.
          </p>
          <p className="pb-2 sm:pb-4">
            Powered by NextJS, Ponder Blogs was a mixture of SSR (server side
            rendered) and SSG (statically generated) content, making it
            blazingly fast while still allowing for dynamic elements and instant
            publishing as well as advanced features like allowing authors to
            choose theme and layout variations.
          </p>
          <p>
            I was in charge of development, while the beautiful design was the
            work of my co-founder{' '}
            <a className="link" href="https://twitter.com/davegorum">
              Dave Gorum
            </a>
          </p>
        </div>
      </Section>

      <Section icon={GradCapIcon} title="Lessons learned">
        <TabbedContent>
          {lessons.map(({ name, title, content }) => (
            <div
              key={name}
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
        <div className="mt-8 mx-auto justify-items-center md:gap-10 grid grid-cols-1 md:grid-cols-2 ">
          {Object.entries(technologies).map(([key, technology]) => (
            <div key={key} className="mb-10 w-min">
              <TechnologyCard id={key} {...technology} />
            </div>
          ))}
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
                      </span>{' '}
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

PonderBlogsProject.displayName = 'PonderBlogs';

const technologies = {
  nextjs: {
    name: 'NextJS',
    type: 'Client Framework',
    highlights: [
      '⚛️ Server side rendering for speedy yet up to date member content',
      '⚡️ Static site generation for non-dynamic content',
      '📰 OpenGraph metadata in all pages for social site unfurling'
    ]
  },
  apollo: {
    name: 'Apollo GraphQL Server',
    type: 'GraphQL Server',
    highlights: [
      '💫  Fully directive-based model for cypher queries, no explicit resolvers',
      '🔐 Shared codebase from Ponder client but separate schema ensures privacy of non-published data'
    ]
  },
  neo4j: {
    name: 'Neo4J Aura',
    type: 'Graph Database',
    highlights: ['⚡️ Optimized indexes for speedy blogs data retrieval']
  },
  styledComponents: {
    name: 'Styled-Components',
    type: 'CSS in JS library',
    icon: '💅',
    highlights: ["📄 CSS-in-JS powers customized author-side 'moods' or themes"]
  },
  vercel: {
    name: 'Vercel',
    type: 'Client Hosting/Deployment',
    highlights: [
      '📡 Native NextJS deployment solution (from CLI)',
      '🔧 Lambda function for waitlist signup',
      '🌎 Domain management'
    ]
  }
};

const lessons = [
  {
    name: 'tech',
    title: (
      <div>
        Cutting edge technologies are{' '}
        <span className="text-indigo-400">not always</span> the best solution
      </div>
    ),
    content: (
      <>
        Perhaps this is better explained through example: NextJS is an amazing
        framework. After writing the Ponder client in standalone react, writing
        the blogs site with NextJS was a revelation. It allowed me to build fast
        and focus on the important aspects of the product. As we were beginning
        to build, Next released a new feature called Incremental Static
        Regeneration (ISR), which did on-the-fly static site generation at
        request time instead of compile time. It was way faster than SSR, worked
        like magic and had minimal setup. Unfortunately our feature-set included
        the ability for authors to change the theme of their site, and there was
        no way of making that feature &quot;feel&quot; right with ISR, since one
        couldn&apos;t invalidate the existing cache across all the blog&apos;s
        pages at once. It was a painful but right decision to use SSR instead no
        matter how much better ISR was in every other respect. (someday I&apos;m
        sure they will introduce partial cache invalidation).
      </>
    )
  },
  {
    name: 'ideal',
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
        practices for incremental refactoring.
      </>
    )
  },
  {
    name: 'refactor',
    title: (
      <>
        Incremental refactoring is almost always{' '}
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
    name: 'consistency',
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
    name: 'mindfulness',
    title: (
      <>
        As time spent <span className="text-indigo-400">working</span> grows, so
        should my <span className="text-indigo-400">mindfulness practice</span>
      </>
    ),
    content: (
      <>
        Last but probably the most valuable lesson for me was that it is not
        enough for me to maintain my mindfulness practice as my work volume
        fluctuates, it is imperative that my practice grows proportional to it.
        There&apos;s a certain momentum (what I&apos;ve heard being referred to
        as &apos;codebrain&apos;) that my mind builds when programming that if
        left unchecked will continue on and bleed into the rest of my day (or
        most often, night), resulting in a too active mind, less clarity and
        less sleep, in turn affecting the work. Ironically, I&apos;ve found
        it&apos;s especially necessary for me to do this when the work is the
        most fun. I learned to stop frequently and take some time to meditate,
        then go back to work or go back about my day.
      </>
    )
  }
];

const walkthroughs = [
  {
    title: 'walkthrough',
    src: 'https://player.vimeo.com/video/484970796',
    highlights: [
      'Simple and elegant design by Dave Gorum to showcase content from Ponder communities',
      'Blazing fast load times thanks to SSR/SSG',
      'Chronological, collection-based and member-based content streams per blog.',
      'Personalized Blog info page',
      'Personalized Member profiles',
      'Built-in high-fidelity OpenGraph metadata for beautiful social media unfurls'
    ]
  },
  {
    title: 'customization',
    src: 'https://player.vimeo.com/video/482506771',
    highlights: [
      "Customize your blog's color palette with Moods.",
      'Personalize your typeface with font family presets.',
      'Preset layout options',
      'Show the world what your group blog is all about through taglines, description, logos and special link.'
    ]
  }
];

export const metadata = buildStaticMetadata('ponderBlogs');
