import Head from "next/head";
import React from "react";
import Link from "next/link";
import { headerRoom } from "styles/util";
import { WithLove } from "components/sprinkles";
import { ContactForm } from "components/contact-form";
import { ProjectCard } from "components/project-card";
import { projects } from "utils/data";
import { Stack } from "components/layouts/stack";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto max-w-measure">
        <div className="px-10 md:px-0 text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-gray-200 sm:text-5xl md:text-6xl">
            <span className="inline xl:inline">Hi there! </span>
            <span className="inline pl-1 text-indigo-600">
              I&apos;m Gustavo
            </span>
            <span className="inline relative top-2 pl-1 -ml-28 font-archia text-tiny text-gray-400">
              ..but you can call me goose
            </span>
          </h1>
          <p className="mt-3 mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl">
            I'm a frontend developer living in Los Angeles with my wonderful dog
            Luna. When I was a 15 year kid in Guadalajara I somehow convinced my
            dad to buy me an IBM PS/2 so I could try doing some Basic and C++
            programming. I remember excitedly looking over the technician's
            shoulder as he began setting it up "FORMAT C:" he typed, before
            inserting and removing various floppy disks, gave me some manuals,
            and left. I felt the future was in my grasp as I ran up the stairs,
            sat down and drew a smile across my face as I typed my first
            command... "FORMAT C:" ...and thus began a long sequence of learning
            opportunities that continue to this day. After leaving for the US to
            get a CS degree, I began my career as a developer at Microsoft
            before moving to the Bay Area to work at Slide and later Jawbone as
            a Technical Program Manager. Two years ago I decided to jump back
            into development by co-founding the company behind ponder.to, a
            group blogging platform that we recently had to shutter. As
            difficult as it was to get back to speed after not coding for a long
            time, I loved every minute of it, using code to bring an experience
            to life is a joy, no matter how many &quot;format c:&quot; moments
            you have along the way. I love working on my own things but I am
            eager to find my tribe, people with whom I can make something
            meaningful and from whom I can continue this learning journey. Does
            that sound like you? drop me a line below!
          </p>
        </div>
      </div>
      <div className="bg-dk-bg-800">
        <h2 className="text-xl py-10 font-bold text-center">
          Examples of my work
        </h2>

        <div justify="center" space="4em">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
      <div>
        <h2>Get in touch!</h2>
      </div>
      <ContactForm />
      <div>
        <footer>
          <WithLove />
        </footer>
      </div>
    </main>
  );
}
