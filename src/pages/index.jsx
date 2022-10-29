import Head from 'next/head';
import React from 'react';
import { BeatingHeart } from 'components/sprinkles';
import { ContactForm, SocialSection } from 'components/contact';
import { ProjectCard } from 'components/project-card';
import { projects } from 'utils/data';
import { ProfilePhoto } from 'components/profile-photo';
import { CheckmarkIcon } from 'components/svg/icons';
import Sparkles from '../components/sparkles';
import Link from 'next/link';

export default function Home() {
  const [result, setResult] = React.useState(null);

  return (
    <main>
      <div className="mx-auto mt-8 sm:mt-20 max-w-measure">
        <div className="px-6 sm:px-10 md:px-0 text-left text-gray-600 dark:text-gray-400">
          <div className="flex justify-between">
            <h1 className="relative text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="text-gray-800 dark:text-gray-200">Hi there! </span>
              <span className="block">
                <span className="relative text-indigo-600">
                  I&apos;m Gustavo
                  <span className="absolute -right-4 sm:-right-8 -bottom-1 sm:bottom-1 tracking-tighter font-archia text-tiny text-gray-600 dark:text-gray-400">
                    ..but you can call me goose
                  </span>
                </span>
              </span>
            </h1>
            <div className="w-32 md:w-40 lg:w-52">
              <ProfilePhoto />
            </div>
          </div>
          <div className="mt-3 text-base sm:text-lg md:mt-5 md:text-xl">
            <p>
              I&lsquo;m a developer specializing in Javascript, React and GraphQL and currently
              living in Los Angeles. I&lsquo;ve loved technology since I was very young. I remember
              when I was a 15 year old kid living in Guadalajara I somehow convinced my parents to
              buy me an IBM PS/2 desktop so I could try some Basic and C++ programming. A technician
              came to your house to install it, as was common back then, and I stood right next to
              him memorizing the commands he typed into the DOS prompt. By the time he left I
              thought to myself &quot;That didn&lsquo;t look so hard&quot;, so I sat down and typed
              my very first computer command...
              <code className="block mx-auto text-sm my-4  font-code w-max px-4 py-1 rounded-md p- bg-gray-800 text-gray-300 uppercase">
                C&gt; format c:
                <span className="r animate-pulse">_</span>
              </code>
            </p>
            <p>
              And thus began a long sequence of learning opportunities that continue to this day. By
              the time I went to high school I had taught myself C and C++. I soon left Mexico for
              the US to get a CS degree and later began my career as a developer at Microsoft before
              moving to the Bay Area to work helping startups grow several times their size,
              including a stint as Director of QA at Max Levchin&lsquo;s Slide and later as the
              Technical Program Manager for the Health division of Jawbone. It was rewarding work,
              but I missed the feeling of finding elegant solutions to problems through code.
            </p>
            <p className="mt-4">
              In 2018 I decided to jump back into development by co-founding the company behind
              ponder.to, a group blogging platform we recently had to shutter. As difficult as it
              was to get back to speed after not coding for a long time, I loved every minute of it.
              Using code to bring an experience to life is a joy, no matter how many{' '}
              <span className="pl-2 text-sm pr-2 font-semibold font-code uppercase">format c:</span>
              moments you have along the way. I'm currently working at{' '}
              <Sparkles>
                <Link href="https://tartle.co" className="text-green-600">
                  TARTLE
                </Link>
              </Sparkles>{' '}
              (yes, in all caps), a B-Corporation dedicated to providing an ethical alternative to
              data brokers, where people are in control of their personal information and get paid
              directly by the companies that want to use it.{' '}
            </p>
            <p className="mt-4">
              If you've read all this, why don't you drop me a line below? I'd love to hear from
              you.
            </p>
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold px-6 text-2xl py-10  sm:text-center">Projects and products</h2>
        <div className="flex flex-col sm:flex-row justify-around mx-auto max-w-measure">
          {projects.map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </div>
      <div className="max-w-4xl mx-auto sm:mt-16">
        <div className="">
          <div className="flex flex-col sm:flex-row">
            <div className="p-6 pt-6 sm:w-2/5">
              <h2 className="font-bold text-3xl">Get in touch!</h2>
              <div className="mt-4">
                <p>
                  I love hearing from people all over the world. Whether you want to just chat,
                  collaborate or are already building great experiences and think I&apos;d be a
                  great addition to your team, I would love to hear from you.
                </p>
                <SocialSection className="hidden sm:block" />
              </div>
            </div>
            <div className="sm:w-3/5 -mt-6 sm:mt-0 p-6 w-9/10">
              {result === 'success' ? (
                <div className="flex  items-center bg-blueGray-400 min-h-full p-6 well-shadow shadow-inner rounded-3xl">
                  <div>
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                      <CheckmarkIcon className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <h3
                        className="text-lg leading-6 font-medium text-gray-100"
                        id="modal-headline">
                        Your message was sent!
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          I will get back to you as soon as possible, feel free to also reach out to
                          me on LinkedIn, Twitter or GitHub
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <ContactForm
                    className="bg-blueGray-400 p-6 well-shadow shadow-inner rounded-3xl"
                    onFinished={setResult}
                  />
                  <div className="text-right font-quirky ml-auto mr-3 mt-1 text-xs text-gray-500 dark:text-gray-200">
                    *Don&apos;t forget to be nice{' '}
                    <span role="img" aria-label="winky face">
                      😉
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <SocialSection className="sm:hidden -mt-6 px-6 pb-6" />
        </div>
      </div>

      <div>
        <footer className="text-center mb-2">
          Made with
          <BeatingHeart />
          in Los Angeles
        </footer>
      </div>
    </main>
  );
}

Home.displayName = 'Home';
