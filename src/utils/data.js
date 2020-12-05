import * as Logos from "components/svg/logos";

export const stackIcons = {
  graphql: Logos.GraphQLLogo,
  react: Logos.ReactLogo,
  neo4j: Logos.Neo4jLogo,
  nextjs: Logos.NextLogo,
  urql: Logos.UrqlLogo,
  vercel: Logos.VercelLogo,
  digitalOcean: Logos.DigitalOceanLogo,
  apollo: Logos.ApolloLogo
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
