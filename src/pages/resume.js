import * as React from "react";
import { accounts, resume } from "utils/data";
import Link from "next/link";
import dayjs from "dayjs";
import { useToggle } from "utils/hooks";
import { ContactForm, LogoLink, SocialSection } from "components/contact";
import {
  CheckmarkIcon,
  CloseIcon,
  DownloadDocumentIcon,
  EnvelopeIcon
} from "components/svg/icons";

export default function Resume() {
  const [showContact, toggle] = useToggle();

  const { statement, skills, patent, experience } = resume;

  return (
    <div className="mx-auto max-w-max p-4 pt-6 sm:pt-10 text-coolGray-700 dark:text-coolGray-300">
      <div className="flex justify-between">
        <div className="lg:mx-auto">
          <h1 className="text-2xl sm:text-4xl font-semibold max-w-max lg:text-5xl lg:pt-8">
            Gustavo Gallegos
          </h1>
          <div className="uppercase text-xs text-coolGray-500 dark:text-coolGray-400">
            Web Developer
          </div>
          <div className="flex justify-between text-dk-bg">
            {Object.entries(accounts).map(([key, account]) => (
              <LogoLink
                className="transform scale-50 sm:scale-75"
                key={key}
                {...account}
              />
            ))}
          </div>
        </div>
        <div>
          <div className="flex flex-col justify-between lg:absolute lg:right-10">
            <button
              className="m-2 flex items-center justify-center dark:border py-1 px-2  sm:p-3 shadow-xl dark:border-dk-bg-lighter rounded-lg bg-lt-primary-lighter dark:bg-dk-primary-darker text-lt-bg dark:text-coolGray-300"
              onClick={toggle}
            >
              <EnvelopeIcon className="h-5 mr-1" />
              Contact
            </button>
            <a
              href="api/get_resume"
              className="cursor-pointer m-2 flex items-center dark:border py-1 px-2 sm:p-3 shadow-md dark:border-dk-bg-lighter rounded-lg bg-lt-primary-lighter dark:bg-dk-primary-darker text-lt-bg dark:text-coolGray-300"
            >
              <DownloadDocumentIcon className="h-5 mr-1" /> Download
            </a>
          </div>
        </div>
      </div>
      {showContact ? <ContactModal toggle={toggle} /> : null}
      <blockquote className="pt-4 max-w-measure lg:mx-auto lg:text-center">
        {statement}
      </blockquote>

      <div className="lg:flex">
        <div className="lg:order-last lg:pl-8">
          <Section title="Skills">
            <ul className="ml-6 list-disc">
              {skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </Section>
          <Section title="Patents">
            <div className="ml-6">
              <div className="text-xs pt-2 uppercase text-coolGray-500 dark:text-coolGray-400">
                {patent.number}
              </div>
              <a
                target="_blank"
                rel="noreferrer"
                className="text-dk-primary-lighter"
                href={patent.url}
              >
                {patent.title}
              </a>
              <div className="text-xs text-coolGray-500 dark:text-coolGray-400">
                {patent.subtitle}
              </div>
            </div>
          </Section>
        </div>
        <Section className="col-span-3" title="Experience">
          {experience.map(({ title, company, startDate, endDate, results }) => (
            <div key={`${company}-${title}`} className="ml-6 py-2">
              <div className="text-xs pt-2 uppercase text-coolGray-500 dark:text-coolGray-400">
                {company.name} - {company.location}
              </div>
              <div className="font-semibold">{title}</div>
              <div className="text-xs text-coolGray-500 dark:text-coolGray-400">
                {dayjs(startDate).format("MMM YYYY")} -{" "}
                {endDate ? dayjs(endDate).format("MMM YYYY") : ""}
              </div>
              <ul className="ml-5">
                {results.map((result, i) => (
                  <li
                    key={i}
                    className="py-1 list-disc leading-snug max-w-measure"
                  >
                    {result}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

Resume.displayName = "Resume";

const Section = ({ title, className, children }) => (
  <div className={`pt-6 ${className}`}>
    <h2 className="text-xl font-semibold">{title}</h2>
    {children}
  </div>
);

function ContactModal({ toggle }) {
  const [result, setResult] = React.useState(null);

  return (
    <div className="fixed z-20 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <div
          className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Send a message form"
        >
          <div>
            <button
              className="absolute top-0 right-0 mt-2 mr-2 p-2 rounded-full text-gray-500"
              onClick={toggle}
            >
              <CloseIcon className="m-auto w-100 h-6" />
            </button>
            <div className="mt-10 text-center sm:mt-5">
              {result === "success" ? (
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                    <CheckmarkIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Your message was sent!
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        I will get back to you as soon as possible, you can also
                        reach me on the following places
                      </p>
                      <SocialSection
                        noText
                        className="transform scale-75 pb-3"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <ContactForm dialog onFinished={setResult} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
