import Head from "next/head";
import React from "react";
import Link from "next/link";
import { Center, Cluster } from "components/layouts";
import { headerRoom } from "styles/util";
import { WithLove } from "components/sprinkles";
import { ContactForm } from "components/contact";
import { ProjectCard } from "components/project-card";
import { projects } from "utils/data";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Center css={headerRoom} gutterWidth="var(--s1)">
        <div>
          <h1>Hey there! I&apos;m Gustavo.</h1>
          <div
            css={{
              fontFamily: "Archia",
              fontSize: "var(--font-size-base)",
              fontStyle: "italic",
              textAlign: "right",
              position: "relative",
              top: "-2.5rem"
            }}
          >
            (as if you didn&apos;t know by now)
          </div>

          <p css={{ fontSize: "var(--font-size-biggish)" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
            sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
            in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
            purus semper eget duis. In massa tempor nec feugiat nisl pretium
            fusce id. Tristique senectus et netus et malesuada fames. Lorem
            ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Dolor sit amet
            consectetur adipiscing elit. Ut etiam sit amet nisl purus in. Nec
            ultrices dui sapien eget mi. Sagittis orci a scelerisque purus
            semper eget duis. In massa tempor nec feugiat nisl pretium fusce id.
            Tristique senectus et netus et malesuada fames.
          </p>
        </div>
      </Center>
      <Center maxWidth="100vw" intrinsic>
        <h2>Examples of my work</h2>
      </Center>
      <Cluster justify="center" space="4em" css={{ overflow: "visible" }}>
        {projects.map((project) => (
          <ProjectCard key={project.title} {...project} />
        ))}
      </Cluster>
      <Center alignText>
        <h2 css={{ paddingTop: "var(--s1)" }}>Get in touch!</h2>
      </Center>
      <ContactForm />
      <Center intrinsic>
        <footer>
          <WithLove css={{ alignSelf: "center" }} />
        </footer>
      </Center>
    </main>
  );
}
