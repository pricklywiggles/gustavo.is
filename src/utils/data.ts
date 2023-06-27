import * as Logos from '@/components/logos';

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
    href: '/remembering/ponder_blogs',
    logo: Logos.PonderBlogsLogo,
    stack: ['nextjs', 'graphql', 'neo4j'],
    description:
      'A collection of creative group blogs from the Ponder community.'
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
