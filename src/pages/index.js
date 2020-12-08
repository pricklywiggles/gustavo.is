import Head from "next/head";
import React from "react";
import { BeatingHeart } from "components/sprinkles";
import { ContactForm } from "components/contact-form";
import { ProjectCard } from "components/project-card";
import { projects } from "utils/data";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto mt-8 sm:mt-20 max-w-measure">
        <div className="px-10 md:px-0 text-left text-gray-600 dark:text-gray-400">
          <h1 className="relative text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl">
            <span className="inline xl:inline text-gray-800 dark:text-gray-200">
              Hi there!{" "}
            </span>
            <span className="block sm:inline">
              <span className="relative text-indigo-600 " stuff="inline pl-1 ">
                I&apos;m Gustavo
                <span
                  className="absolute -right-8 -bottom-1 sm:bottom-1 tracking-tighter font-archia text-tiny text-gray-600 dark:text-gray-400"
                  stuff="relative block -top-3 text-right tracking-tighter sm:-left-20 font-archia text-tiny text-gray-200"
                >
                  ..but you can call me goose
                </span>
              </span>
            </span>
          </h1>
          <p className="mt-3 mx-auto text-base sm:text-lg md:mt-5 md:text-xl">
            I&quot;m a frontend developer living in Los Angeles with my
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
            is a joy, no matter how many &quot;format c:&quot; moments you have
            along the way. I love working on my own things but I am eager to
            find my tribe, people with whom I can make something meaningful
            continue this learning journey. Does that sound like you? drop me a
            line and check out some of my work below!
          </p>
        </div>
      </div>
      <div className="px-6">
        <h2 className="font-bold text-2xl py-10  sm:text-center">
          Projects and products
        </h2>
        <div className="flex flex-col sm:flex-row justify-around mx-auto max-w-measure">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
      <ContactForm />

      <div>
        <footer className="text-center">
          Made with
          <BeatingHeart />
          in Los Angeles
        </footer>
      </div>
    </main>
  );
}
