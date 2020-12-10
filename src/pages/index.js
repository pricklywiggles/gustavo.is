import Head from "next/head";
import React from "react";
import { BeatingHeart } from "components/sprinkles";
import { ContactForm } from "components/contact-form";
import { ProjectCard } from "components/project-card";
import { projects } from "utils/data";
import { ProfilePhoto } from "components/profile-photo";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mx-auto mt-8 sm:mt-20 max-w-measure">
        <div className="px-6 sm:px-10 md:px-0 text-left text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <h1 className="relative text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gray-800 dark:text-gray-200">
                Hi there!{" "}
              </span>
              <span className="block">
                <span
                  className="relative text-indigo-600 "
                  stuff="inline pl-1 "
                >
                  I&apos;m Gustavo
                  <span
                    className="absolute -right-4 sm:-right-8 -bottom-1 sm:bottom-1 tracking-tighter font-archia text-tiny text-gray-600 dark:text-gray-400"
                    stuff="relative block -top-3 text-right tracking-tighter sm:-left-20 font-archia text-tiny text-gray-200"
                  >
                    ..but you can call me goose
                  </span>
                </span>
              </span>
            </h1>
            <div className="w-32 md:w-40 lg:w-52">
              <ProfilePhoto />
            </div>
          </div>
          <p className="mt-3 text-base sm:text-lg md:mt-5 md:text-xl">
            I&lsquo;m a developer living in Los Angeles with my wonderful dog
            Luna, specializing in Javascript, React and GraphQL. I&lsquo;ve
            loved technology since I was very young. I remember when I was a 15
            year kid in Guadalajara I somehow convinced my parents to buy me an
            IBM PS/2 desktop so I could try some Basic and C++ programming. A
            technician came to your house to install it, as was common back
            then, and I stood right next to him memorizing the commands he typed
            into the DOS prompt. By the time he left I thought to myself
            &quot;That didn&lsquo;t look so hard&quot;, so I sat down and typed
            my very first computer command:
            <code className="block text-sm my-4 mx-auto font-code w-max px-4 py-2 rounded-md p- bg-gray-800 text-gray-200 uppercase">
              format c:
              <span className="r animate-pulse">_</span>
            </code>{" "}
            thus beginning a long sequence of learning opportunities up to this
            day. By the time I went to high school I had taught myself C and
            C++. I soon left Mexico for the US to get a CS degree and later
            began my career as a developer at Microsoft before moving to the Bay
            Area to work helping startups grow several times their size,
            including a stint as Director of QA at Max Levchin&lsquo;s Slide and
            later as the Technical Program Manager for the Health division of
            Jawbone. It was rewarding work, but I missed the feeling of finding
            elegant solutions to problems through code. So two years ago I
            decided to jump back into development by co-founding the company
            behind ponder.to, a group blogging platform we recently had to
            shutter. As difficult as it was to get back to speed after not
            coding for a long time, I loved every minute of it. Using code to
            bring an experience to life is a joy, no matter how many{" "}
            <span className="pl-2 text-sm pr-2 font-semibold font-code uppercase">
              format c:
            </span>
            moments you have along the way. I love working on my own things but
            I am eager to find my tribe, people I can learn from and with whom I
            can make something meaningful and continue this learning journey.
            Does that sound like you? drop me a line below!
          </p>
        </div>
      </div>
      <div>
        <h2 className="font-bold px-6 text-2xl py-10  sm:text-center">
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
