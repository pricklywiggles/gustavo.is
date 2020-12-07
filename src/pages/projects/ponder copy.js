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

export default function PonderProject() {
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
            />
            , a group blogging platform.
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
            <h2>Inception and Purpose</h2>
          </Center>
          <Sidebar contentMin="45%">
            <Box>
              <Center>
                <Frame css={{ minWidth: "350px" }} ratio="1:1">
                  <img
                    alt="ponder homepage screenshot"
                    css={{ borderRadius: "20px" }}
                    src="/ponder-screen1.jpg"
                  ></img>
                </Frame>
              </Center>
            </Box>

            <Box>
              <Center>
                <h3>
                  Founded in mid-2019 by Kristen Pavle, Dave Gorum and myself,
                  Ponder was a blogging platform focused on simplicity aimed at
                  people that wanted to publish a blog collaboratively.
                </h3>
                <p>
                  We built a product where small groups of people collaborated
                  on creating content, had private discussions and published
                  their content to the web.
                </p>
                <p>
                  Following the Slack team model, each group blog collaborated
                  privately and users could be members of a number of different
                  blogs. The group would then choose which content to publish on
                  the Ponder Blogs site.
                </p>
                <p>
                  We worked hard to design a product that would promote
                  meaningful content and meaningful discussions as a small
                  counterbalance to pervailing social media trends.
                </p>
                <p>
                  My responsibility was engineering, I was the sole developer
                  (frontend/backend/db and ops), it was the most challenging yet
                  rewarding experience in my professional life. Never have I
                  learned so much in such a short amount of time.
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
                  title="Post editor"
                  src="https://player.vimeo.com/video/482506828"
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
                  title="Conversations video"
                  src="https://player.vimeo.com/video/482506771"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              </Embed>
            </Center>
          </Box>
        </Switcher>
      </Section>
      <Section alternate>
        <Switcher threshold="90ch" space="0">
          <Box className="video">
            <Center>
              <Embed>
                <iframe
                  title="Collections video"
                  src="https://player.vimeo.com/video/482505654"
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
                <li>
                  Organize your content by adding posts to collections shared
                  with all members of the blog.
                </li>
                <li>View collection feeds.</li>
                <li>
                  Personalize your collection with cover image and metadata.
                </li>
                <li>
                  Assign a unique url to a collection feed to share with anyone.
                </li>
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
                <li>Create up to 10 different blogs</li>
                <li>Invite any number of members</li>
                <li>
                  Each blog is private and isolated from the rest, with its own
                  set of members.
                </li>
                <li>
                  A privacy-first model gives you a different identity for each
                  blog while still being able to context switch between them
                  from any screen.
                </li>
                <li>
                  Owner can assign (and revoke) admin privileges to any member.
                </li>
                <li>Pinnable announcements for members feeds.</li>
              </ul>
            </Center>
          </Box>
          <Box className="video">
            <Center>
              <Embed>
                <iframe
                  title="Groups Video"
                  src="https://player.vimeo.com/video/482507258"
                  frameBorder="0"
                  allow="autoplay; fullscreen"
                  allowFullScreen
                ></iframe>
              </Embed>
            </Center>
          </Box>
        </Switcher>
      </Section>
      <Section alternate>
        <Switcher threshold="90ch" space="0">
          <Box className="video">
            <Center>
              <Embed>
                <iframe
                  title="Publishing video"
                  src="https://player.vimeo.com/video/482507338"
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
                <li>
                  Once a blog is made public, all published content is available
                  at a personalized ponder.to/[blog] url.
                </li>
                <li>
                  Public blogs can be personalized by admins by adding moods
                  (color themes, layout, font and styling presets) from the
                  app.ponder.to site at any time making each blog unique.
                </li>
                <li>
                  The public-facing blog site is a separate SSR NextJS
                  application, you can read more about it in the Ponder Blogs
                  project exploration page.
                </li>
              </ul>
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
  react: {
    name: "React",
    logoUrl: stackIcons.react,
    highlights: [
      "📄 React single page app",
      "📦 Bundled with Parcel",
      "🪝 Modern hook based architecture"
    ]
  },
  urql: {
    name: "Urql",
    logoUrl: stackIcons.urql,
    highlights: [
      "🕊 Lightweight GraphQL client",
      "🏪 Normalized cache",
      "🔒 Custom auth exchange",
      "⚡️ Subscriptions for real time notifications"
    ]
  },
  neo4j: {
    name: "Neo4J Graph DB",
    logoUrl: stackIcons.neo4j,
    highlights: [
      "🔌 Our own model and js driver code",
      "💾 Simple analytics scripts",
      "💫 Cypher graphql directives"
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
  digitalOcean: {
    name: "DigitalOcean",
    logoUrl: stackIcons.digitalOcean,
    highlights: [
      "🏚 GraphQL server hosting",
      "👯‍♂️ Deployed production, development and staging environments",
      "📦 AWS S3 compatible storage"
    ]
  },
  apollo: {
    name: "Apollo GraphQL Server",
    logoUrl: stackIcons.apollo,
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
