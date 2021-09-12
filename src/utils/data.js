import * as Logos from 'components/svg/logos';

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
    title: 'Ponder',
    href: '/remembering/ponder',
    logo: Logos.PonderLogo,
    stack: ['react', 'graphql', 'neo4j'],
    description: 'A fun and simple tool for creating collaborative blogs.'
  },
  {
    title: 'Ponder Blogs',
    href: '/remembering/ponder-blogs',
    logo: Logos.PonderBlogsLogo,
    stack: ['nextjs', 'graphql', 'neo4j'],
    description: 'A collection of creative group blogs from the Ponder community.'
  }
];

export const accounts = {
  github: { url: 'https://github.com/pricklywiggles', logo: Logos.GitHubLogo },
  twitter: {
    url: 'https://twitter.com/pricklywiggles',
    logo: Logos.TwitterLogo
  },
  linkedIn: {
    url: 'https://www.linkedin.com/in/gustavogallegos/',
    logo: Logos.LinkedInLogo
  }
};

const TwitterCardSize = {
  small: 'summary',
  large: 'summary_large_image'
};

export const metadata = {
  Home: {
    title: "Hi, I'm Gustavo Gallegos. A web developer in Los Angeles.",
    description:
      "I'm a web developer (React, NextJS, Javascript, GraphQL, HTML and CSS) living in in Los Angeles. See my portfolio and contact information",
    openGraph: {
      'og:title': "Hi, I'm Gustavo Gallegos and this is my dev portfolio",
      'og:description':
        "I'm a web developer in Los Angeles. See a collection of previous projects, lessons learned and my contact information. Cheers!",
      'og:image': 'https://gustavo.is/og_home.png',
      'og:site_name': "Gustavo Gallegos' Dev Portfolio",
      'og:url': 'https://gustavo.is',
      'og:type': 'website',
      'twitter:card': TwitterCardSize.large
    }
  },
  Ponder: {
    title: 'A look back at building Ponder, a group blogging platform.',
    description:
      'We recently had to sunset Ponder, Check out what it was, the technologies used, and the lessons I learned building it.',
    openGraph: {
      'og:title': 'Looking back at Ponder, a group blogging platform',
      'og:description':
        'We recently had to sunset Ponder, Check out what it was, the technologies used, and the lessons I learned building it.',
      'og:image': 'https://gustavo.is/og_ponder.png',
      'og:site_name': "Gustavo Gallegos' Dev Portfolio",
      'og:url': 'https://gustavo.is/remembering/ponder',
      'og:type': 'website',
      'twitter:card': TwitterCardSize.large
    }
  },
  PonderBlogs: {
    title: 'A retrospective of things I learned building Ponder Blogs',
    openGraph: {
      'og:title':
        "Now that we've sunset the Ponder Blogs site, I spent some time reflecting on the lessons I learned building it.",
      'og:description':
        "Now that we've sunset the Ponder Blogs site, I spent some time reflecting on the lessons I learned building it.",
      'og:image': 'https://gustavo.is/og_ponder_blogs.png',
      'og:site_name': "Gustavo Gallegos' Dev Portfolio",
      'og:url': 'https://gustavo.is/remembering/ponder-blogs',
      'og:type': 'website',
      'twitter:card': TwitterCardSize.large
    }
  },
  Resume: {
    title: "Hi there! I'm Gustavo Gallegos. This is my resume.",
    description:
      "I'm a web developer in Los Angeles, CA and I'm looking for my tribe. This is my resume.",
    openGraph: {
      'og:title': "Hi there! I'm Gustavo Gallegos. This is my resume.",
      'og:description':
        "I'm a web developer in Los Angeles, CA and I'm looking for my tribe. This is my resume",
      'og:image': 'https://gustavo.is/og_resume.png',
      'og:site_name': "Gustavo Gallegos' Dev Portfolio",
      'og:url': 'https://gustavo.is',
      'og:type': 'website',
      'twitter:card': TwitterCardSize.small
    }
  }
};
