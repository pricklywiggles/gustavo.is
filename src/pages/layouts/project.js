import React from "react";
import {
  Cover,
  Center,
  Box,
  Switcher,
  Cluster,
  Sidebar,
  Frame,
  Stack
} from "components/layouts";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

const technologies = {
  react: {
    name: "React",
    logoUrl: "/react-logo.svg",
    highlights: [
      "React single page app.",
      "Bundled with Parcel.",
      "Modern hook based architecture."
    ]
  },
  urql: { name: "Urql GraphQL Client", logoUrl: "/urql-logo.svg" },
  neo4j: { name: "Neo4J Aura Graph Database", logoUrl: "/neo4j-logo.svg" },
  vercel: { name: "Vercel", logoUrl: "/vercel-logo.svg" },
  digitalOcean: { name: "DigitalOcean", logoUrl: "/digitalocean-logo.svg" },
  apollo: { name: "Apollo GraphQL Server", logoUrl: "/apollo-logo.svg" },
  styledComponents: {
    name: "Styled-Components",
    icon: "💅"
  }
};

export default function Project(props) {
  const [activeTech, setActiveTech] = React.useState("react");

  return (
    <Container>
      <Center alignText="center">
        <Cover minHeight="90vh">
          <h1>
            <img
              css={{ width: "6ch" }}
              src="/logomark.svg"
              alt="Vercel Logo"
              className="logo"
            />
            , a group blogging platform.
          </h1>
          <div>Explore the project 👇</div>
        </Cover>
      </Center>
      <Section alternate>
        <Center alignText>
          <h2>Inception and Purpose</h2>
        </Center>
        <Sidebar>
          <Box>
            <Center>
              <Frame css={{ minWidth: "400px" }} ratio="1:1">
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
                We built a product where small groups of people collaborated on
                creating content, had private discussions and published their
                content to the web.
              </p>
              <p>
                Following the Slack team model, each group blog collaborated
                privately and users could be members of a number of different
                blogs. The group would then choose which content to publish on
                the Ponder Blogs site.
              </p>
              <p>
                We worked hard to design a product that would promote meaningful
                content and meaningful discussions as a small counterbalance to
                pervailing social media trends.
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
      </Section>
      <Center alignText>
        <h2>Technologies</h2>
      </Center>
      <Center alignText="center" maxWidth="100%">
        <Box>
          <Cluster css={{ overflow: "visible" }} justify="space-around">
            {Object.keys(technologies).map((name) => (
              <Logo
                key={name}
                onClick={() => setActiveTech(name)}
                src={technologies[name].logoUrl}
                isActive={activeTech === name}
                icon={technologies[name].icon}
              />
            ))}
          </Cluster>
        </Box>
        <Box css={{ borderTop: "1px solid yellow" }}>
          <Stack>
            {technologies[activeTech].highlights?.map((highlight) => (
              <div>{highlight}</div>
            ))}
          </Stack>
        </Box>
      </Center>
      <Section alternate>
        <Center alignText>
          <h2>Highlights</h2>
        </Center>

        <Switcher threshold="90ch" space="0">
          <Box className="video">
            <Center>
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
                <li>Organize your post by adding it to a collection.</li>
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
              <p>
                Once a blog has been made public, all published content is
                available to anyone at ponder.to/[Blog Name] using NextJS and
                SSR.
              </p>
              <p>
                Public blogs can be personalized by adding moods (color themes
                with styling rules) through different font families and some
                minor layout options, making each blog unique, all possible
                thanks to styled-components.
              </p>
              <p>
                For an in depth look, see the Ponder Blogs project exploration
                page.
              </p>
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
    line-height: 2;
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
    <Center maxWidth="calc(var(--measure) * 2)">{children}</Center>
  </SectionWrapper>
);

const SectionWrapper = styled.div`
  padding: var(--s1);
  background-color: ${(props) =>
    props.alternate
      ? "var(--colors-background-secondary)"
      : "var(--colors-background)"};
`;

// const Logo = ({ onClick, legend, bg, src, activeTech }) => (
//   <TechButton
//     onClick={onClick}
//     src={src}
//     bg={bg}
//     active={activeTech === legend}
//   ></TechButton>
// );

const Logo = styled.button`
  ${(props) =>
    props.isActive
      ? `
      box-shadow: 
        0 0 5px 2px var(--colors-primary),
        inset 0 0 10px 5px var(--colors-primary);
      `
      : ""}
  border: none;
  border-radius: 999px;
  padding: 0;
  width: 5ch;
  height: 5ch;
  background: ${(props) =>
    props.src ? `black url(${props.src}) no-repeat center` : "black"};
  background-size: 3ch 3ch;

  ${(props) =>
    props.icon
      ? `
    &::before {
      content: "💅";
      font-size: var(--font-size-big);
    }`
      : ""}

  @media (min-width: 700px) {
    width: 7ch;
    height: 7ch;
    background-size: 5ch 5ch;
    &::before {
      font-size: var(--font-size-bigger);
    }
  }
`;
