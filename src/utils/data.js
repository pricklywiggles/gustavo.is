import * as React from "react";
import * as Logos from "components/svg/logos";
import Link from "next/link";

export const logos = {
  graphql: { themed: false, component: Logos.GraphQLLogo },
  react: { themed: false, component: Logos.ReactLogo },
  neo4j: { themed: false, component: Logos.Neo4jLogo },
  nextjs: { themed: true, component: Logos.NextLogo },
  urql: { themed: false, component: Logos.UrqlLogo },
  vercel: { themed: true, component: Logos.VercelLogo },
  digitalOcean: { themed: true, component: Logos.DigitalOceanLogo },
  apollo: { themed: true, component: Logos.ApolloLogo }
};

export const projects = [
  {
    title: "Ponder",
    href: "/projects/ponder",
    logo: Logos.PonderLogo,
    stack: ["react", "graphql", "neo4j"],
    description: "A fun and simple tool for creating collaborative blogs."
  },
  {
    title: "Ponder Blogs",
    href: "/projects/ponder-blogs",
    logo: Logos.PonderBlogsLogo,
    stack: ["nextjs", "graphql", "neo4j"],
    description:
      "A collection of creative group blogs from the Ponder community."
  }
];

export const companies = {
  microsoft: {
    name: "Microsoft Corp.",
    location: "Redmond, WA"
  },
  slide: {
    name: "Slide, Inc.",
    location: "San Francisco, CA"
  },
  togeru: {
    name: "Togeru",
    location: "San Francisco, CA"
  },
  jawbone: {
    name: "Jawbone",
    location: "San Francisco, CA"
  },
  meaning: {
    name: "Meaning, Inc.",
    location: "Los Angeles, CA"
  }
};

export const resume = {
  statement:
    "Results-oriented developer with in depth cross-functional experience in major Silicon Valley startups and a proven builder of end to end web experiences. Deeply interested in the intersection of technology and mindfulness.",
  education: {
    university: "University of Pennsylvania",
    school: "School of Engineering and Applied Sciences",
    startDate: new Date("August, 1995"),
    endDate: new Date("December, 1999"),
    results: [
      "BSE in Computer Science, concentration on natural language processing",
      "Microsoft Scholarship (full tuition) 96-99"
    ]
  },
  skills: [
    "React (SPA and NextJS based), hooks, advanced patterns.",
    "GraphQL (Apollo, URQL) client and server implementations.",
    "Javascript (ES6+), HTML.",
    "CSS, TailwindCSS, styled-components, emotion.",
    "Deep cross-functional knowledge, teamwork focus.",
    "Coaching, execution and agile process expert with proven track record.",
    "Self starter with entrepreneurial spirit.",
    "Passion for continuous learning.",
    "Attention to detail/polish for crafting user experiences.",
    "Spanish (native/bilingual)"
  ],
  patent: {
    number: "US Patent 7,823,138 B2",
    title: "Distributed Testing for Computing Features (with Carlos Arguelles)",
    subtitle: "In use at Microsoft Corp.",
    url:
      "http://patft.uspto.gov/netacgi/nph-Parser?Sect1=PTO2&Sect2=HITOFF&p=1&u=%2Fnetahtml%2FPTO%2Fsearch-bool.html&r=15&f=G&l=50&co1=AND&d=PTXT&s1=7823138&OS=7823138&RS=7823138"
  },
  experience: [
    {
      title: "Co-founder and CTO",
      company: companies.meaning,
      startDate: new Date("March 1 2019"),
      endDate: null,
      results: [
        <>
          Developed <Link href="/projects/ponder">Ponder</Link>, a React client
          web application for authoring group blogs that leveraged refreshable
          JWT authentication and real-time in-app messaging notifications,
          optimistic updates, Slack-inspired private communities, unlimited
          image uploads and messaging system.
        </>,
        "Implemented a fully featured Apollo GraphQL server for Ponder and Ponder Blogs clients including resolvers and directives for JWT authentication, Neo4j graph DB Cypher queries, unlimited image uploads to DigitalOcean Spaces (via AWS S3 SDK) as well as Integrations with Sentry for exception reporting, Segment for analytics and PostMark for email notifications.",
        <>
          Developed <Link href="/projects/ponder-blogs">Ponder Blogs</Link>, a
          NextJS-based SSR/SSG destination site for group blogs published
          through the ponder client. Features included author-customizable
          layouts and color themes and instant availability of new content
          thanks to SSR and useSWR.
        </>
      ]
    },
    {
      title: "Engineering Program Manager",
      company: companies.jawbone,
      startDate: new Date("January 1 2013"),
      endDate: new Date("April 1 2019"),
      results: [
        "Designed and implemented the company-wide health software development process at Jawbone for all platforms (iOS, Web and android).",
        "Created and led a new Software Engineering Program Management organization, including a team of agile squad coaches that helped collectively launch over 25 major software versions powering 12 major hardware launches for products used by over 12 million users.",
        "Continuously coordinated with VPs, Product Managers, Team leads and external partners to set and execute schedules resulting in consistent on-time product releases."
      ]
    },
    {
      title: "Software Product Manager",
      company: companies.jawbone,
      startDate: new Date("September 1 2010"),
      endDate: new Date("January 1 2013"),
      results: [
        "Developed a five year plan and feature roadmap for the UP health platform. Drove the UP v1.0 iOS application effort from the investigation phase through planning, execution and worldwide launch. Personally managed the schedule and release of the first 27 sprints of the iOS and Web teams."
      ]
    },
    {
      title: "Director of Product Management",
      company: companies.togeru,
      startDate: new Date("February 1 2010"),
      endDate: new Date("September 1 2010"),
      results: [
        "Designed the prototype for a web-based healthcare portal and accompanying iOS app for sharing structured data (such as workout and nutrition plans) between health professionals and their clients. Prototype paved the way to a successful early acquisition."
      ]
    },
    {
      title: "Product Manager",
      company: companies.slide,
      startDate: new Date("November 1 2008"),
      endDate: new Date("April 1 2010"),
      results: [
        "Executed the release of the common component game platform in a very tight schedule. Took a leadership role in the SuperPocus team directing product and strategy, metrics analysis and feature design. Grew the game into one of the top 10 fastest growing games on the Facebook Platform."
      ]
    },
    {
      title: "Director of Quality Assurance",
      company: companies.slide,
      startDate: new Date("December 1 2005"),
      endDate: new Date("November 1 2008"),
      results: [
        "Coached and supervised a team of over 70 QA and Automation engineers, shipping dozens of social media widgets across Facebook, Bebo, Hi5, Orkut and MySpace with over 140MM unique monthly users.",
        "Designed and implemented the company's software agile processes."
      ]
    },
    {
      title: "Software Design Engineer/Test",
      company: companies.microsoft,
      startDate: new Date("March 1 2000"),
      endDate: new Date("December 1 2005"),
      results: [
        "Designed and implemented a scalable distributed system for testing the Natural Language Group's features (including the Word grammar checker) using very large datasets, increasing the amount of data tested in a cycle by over 800% in a tenth of the previous time. Granted a patent alongside Carlos Arguelles for this system (US Patent 7,823,138 B2)"
      ]
    }
  ]
};

export const accounts = {
  github: { url: "https://github.com/pricklywiggles", logo: Logos.GitHubLogo },
  twitter: {
    url: "https://twitter.com/pricklywiggles",
    logo: Logos.TwitterLogo
  },
  linkedIn: {
    url: "https://www.linkedin.com/in/gustavogallegos/",
    logo: Logos.LinkedInLogo
  }
};

const TwitterCardSize = {
  small: "summary",
  large: "summary_large_image"
};

export const openGraphData = {
  Home: {
    "og:title": "Hi, I'm Gustavo Gallegos and this is my dev portfolio",
    "og:description":
      "I'm a web developer in Los Angeles. See a collection of previous projects, lessons learned and my contact information. Cheers!",
    "og:image": "https://gustavo.is/og_home.png",
    "og:site_name": "Gustavo Gallegos' Dev Portfolio",
    "og:url": "https://gustavo.is",
    "twitter:card": TwitterCardSize.large
  },
  Ponder: {
    "og:title": "Looking back at Ponder, a group blogging platform",
    "og:description":
      "We recently had to sunset Ponder, Check out what it was, the technologies used, and the lessons I learned building it.",
    "og:image": "https://gustavo.is/og_ponder.png",
    "og:site_name": "Gustavo Gallegos' Dev Portfolio",
    "og:url": "https://gustavo.is/projects/ponder",
    "twitter:card": TwitterCardSize.large
  },
  PonderBlogs: {
    "og:title":
      "Looking back at Ponder Blogs, a destination site for Ponder content",
    "og:description":
      "Now that Ponder Blogs is no more, I spent some time reflecting on the lessons I learned building it.",
    "og:image": "https://gustavo.is/og_ponder_blogs.png",
    "og:site_name": "Gustavo Gallegos' Dev Portfolio",
    "og:url": "https://gustavo.is/projects/ponder-blogs",
    "twitter:card": TwitterCardSize.large
  },
  Resume: {
    "og:title": "Hi there! I'm Gustavo Gallegos.",
    "og:description":
      "I'm a web developer in Los Angeles, CA. This is my resume, you should hire me.",
    "og:image": "https://gustavo.is/og_resume.png",
    "og:site_name": "Gustavo Gallegos' Dev Portfolio",
    "og:url": "https://gustavo.is",
    "twitter:card": TwitterCardSize.small
  }
};
