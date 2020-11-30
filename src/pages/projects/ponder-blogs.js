import React from "react";
import {
  Cover,
  Center,
  Box,
  Switcher,
  Cluster,
  Sidebar,
  Frame
} from "components/layouts";
import { Logo } from "components/logo";
import styled from "@emotion/styled";
import { stackIcons } from "utils/data";

export default function PonderBlogsProject() {
  return (
    <Container>
      <Center alignText={true}>
        <Cover minHeight="90vh">
          <h1>
            <img
              css={{ width: "6ch" }}
              src="/logos/ponder-blogs-logo.svg"
              alt="Vercel Logo"
              className="logo"
            />{" "}
            blogs, a collection of creative group blogs from the Ponder
            community.
          </h1>
          <div>
            Explore the project{" "}
            <span role="img" aria-label="">
              👇
            </span>
          </div>
        </Cover>
      </Center>
      <Section alternate>
        <Center maxWidth="calc(var(--measure) * 2)">
          <Center alignText>
            <h2>Purpose</h2>
          </Center>
          <Sidebar contentMin="45%">
            <Box>
              <Center>
                <Frame css={{ minWidth: "350px" }} ratio="1:1">
                  <img
                    alt="ponder homepage screenshot"
                    css={{ borderRadius: "20px" }}
                    src="/ponderblogs-screen1.jpg"
                  ></img>
                </Frame>
              </Center>
            </Box>

            <Box>
              <Center>
                <h3>
                  Ponder Blogs was a destination site where anyone could read
                  the public content authored with Ponder.
                </h3>
                <p>
                  Powered by NextJS, the Ponder Blogs was a mixture of SSR
                  (servier side rendered) and SSG (statically generated)
                  content, making it blazingly fast while still allowing for
                  having dynamic elements and instant publishing as well as
                  advanced features like allowing authors to choose theme and
                  layout variations.
                </p>
                <p>
                  My contributions included the graphql server code, as well as
                  all the client code except for styling (css and styled
                  components), which was the beautiful work of my co-founder
                  Dave Gorum.
                </p>
              </Center>
            </Box>
          </Sidebar>
        </Center>
      </Section>
      <Section>
        <Center alignText>
          <h2>Technologies</h2>
        </Center>
        <Center alignText maxWidth="90%">
          <Cluster align="flex-start" justify="space-around" space="var(--s3)">
            {Object.entries(technologies).map(
              ([key, { name, logoUrl, icon, invertable, highlights = [] }]) => (
                <Card key={key}>
                  <div>
                    <Logo src={logoUrl} icon={icon} invertable={invertable} />
                    <div className="title">{name}</div>
                    {highlights.map((highlight) => (
                      <div className="highlight" key={highlight}>
                        {highlight}
                      </div>
                    ))}
                  </div>
                </Card>
              )
            )}
          </Cluster>
        </Center>
      </Section>
      <Section alternate>
        <Center alignText={true}>
          <h2>Highlights</h2>
        </Center>
        <Switcher threshold="90ch" space="0">
          <Box className="video">
            <Center gutterWidth="5.5px">
              <Embed>
                <iframe
                  title="Ponder blogs video"
                  src="https://player.vimeo.com/video/484970796"
                  width="640"
                  height="564"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              </Embed>
            </Center>
          </Box>
          <Box>
            <Center>
              <ul>
                <li>Chatlog-style blog post authoring</li>
                <li>Optimistic updates</li>
                <li>Continuous auto-save</li>
                <li>Independent inputs can be reordered, edited or deleted</li>
                <li>
                  Images can be uploaded via file upload or drag and drop{" "}
                </li>
                <li>Unlimited image uploads</li>
                <li>Images stored in DigitalOcean Spaces via AWS S3 driver</li>
              </ul>
            </Center>
          </Box>
        </Switcher>
      </Section>
      <Section>
        <Switcher threshold="90ch" space="0">
          <Box>
            <Center>
              <ul>
                <li>
                  One-on-one conversations for more meaningful discussions
                </li>
                <li>
                  Private to the group, conversations are not published to the
                  blog.
                </li>
                <li>Message inbox</li>
                <li>
                  Real-time in-app notifications powered by GraphQL
                  subscriptions (urql client, apollo server).
                </li>
                <li>Email notifications via PostMark</li>
              </ul>
            </Center>
          </Box>
          <Box className="video">
            <Center>
              <Embed>
                <iframe
                  title="Ponder Blogs customization video"
                  src="https://player.vimeo.com/video/484967092"
                  width="640"
                  height="564"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              </Embed>
            </Center>
          </Box>
        </Switcher>
      </Section>
    </Container>
  );
}

const Embed = styled.div`
  & > :first-child {
    width: 100%;
  }
  @supports (--custom: property) {
    position: relative;

    &::before {
      content: "";
      display: block;
      padding-bottom: calc(100% / (16 / 9));
    }
    & > :first-child {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }
`;

const Container = styled.div`
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  li {
    line-height: 1.5;
    padding-top: 1em;
    ::before {
      content: "⚡︎ ";
      color: yellow;
    }
  }
  @media (max-width: 990px) {
    .video {
      order: -1;
    }
  }
`;

const Section = ({ alternate, children }) => (
  <SectionWrapper alternate={alternate}>
    {/* <Center maxWidth="calc(var(--measure) * 2)"> */}
    {children}
    {/* </Center> */}
  </SectionWrapper>
);

const SectionWrapper = styled.div`
  padding: var(--s1);
  background-color: ${(props) =>
    props.alternate
      ? "var(--colors-background-lighter)"
      : "var(--colors-background)"};
`;

const Card = styled(Box)`
  width: 280px;
  line-height: var(--s2);

  & > div {
    display: flex;
    flex-flow: column;
  }

  .title {
    font-size: var(--font-size-big);
    text-transform: lowercase;
    font-variant: small-caps;

    &::after {
      display: block;
      content: "";
      width: 100%;
      padding-bottom: var(--s0);
      border-bottom: 2px dotted var(--colors-fun);
      margin-bottom: 10px;
    }
  }
`;

const technologies = {
  nextjs: {
    name: "NextJS",
    logoUrl: stackIcons.nextjs,
    invertable: true,
    highlights: [
      "⚛️ Server side rendering for speedy yet up to date member content",
      "⚡️ Static site generation for non-dynamic content",
      "📰 OpenGraph metadata in all pages for social site unfurling"
    ]
  },
  apollo: {
    name: "Apollo GraphQL Server",
    logoUrl: stackIcons.apollo,
    invertable: true,
    highlights: [
      "💫  Fully directive-based model for cypher queries, no resolvers"
    ]
  },
  neo4j: {
    name: "Neo4J Graph DB",
    logoUrl: stackIcons.neo4j,
    highlights: [
      "🔌 
    ]
  },
  vercel: {
    name: "Vercel",
    logoUrl: stackIcons.vercel,
    invertable: true,
    highlights: [
      "📡 SPA Client deployment",
      "🔧 Utility lambda functions (JS)",
      "🌎 Domain management"
    ]
  },

  styledComponents: {
    name: "Styled-Components",
    icon: "💅",
    highlights: ["📄 CSS-in-JS powers powerful author-side 'moods' or themes"]
  }
};
