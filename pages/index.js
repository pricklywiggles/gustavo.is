import Head from "next/head";
import React from "react";
import { css } from "@emotion/core";
import { Header } from "../components/header";
import { Box, Center } from "../components/layouts";
import { headerRoom } from "../styles/util";
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
            I&apos;m a frontend developer living in Los Angeles with my
            wonderful dog Luna. When I was a 15 year kid in Guadalajara I
            somehow convinced my dad to buy me an IBM PS/2 so I could try doing
            some Basic and C++ programming. I remember excitedly looking over
            the technician&apos;s shoulder as he began setting it up
            &quot;FORMAT C:&quot; he typed, before inserting and removing
            various floppy disks, gave me some manuals, and left. I felt the
            future was in my grasp as I ran up the stairs, sat down and drew a
            smile across my face as I typed my first command... &quot;FORMAT
            C:&quot; ...and thus began a long sequence of learning opportunities
            that continue to this day. After leaving for the US to get a CS
            degree, I began my career as a developer at Microsoft before moving
            to the Bay Area to work at Slide and later Jawbone as a Technical
            Program Manager. Two years ago I decided to jump back into
            development by co-founding the company behind ponder.to, a group
            blogging platform that we recently had to shutter. As difficult as
            it was to get back to speed after not coding for a long time, I
            loved every minute of it, using code to bring an experience to life
            is a joy, no matter how many &quot;FORMAT C:&quot; moments you have
            along the way. I love working on my own things but I am eager to
            find my tribe, people with whom I can make something meaningful and
            from whom I can continue this learning journey. Does that sound like
            you? drop me a line below!
          </p>
          <h2>Portfolio</h2>
          <h3>Ponder.to</h3>
          <h2>Get in touch!</h2>
        </div>
      </Center>
      <footer></footer>
    </main>
  );
}
