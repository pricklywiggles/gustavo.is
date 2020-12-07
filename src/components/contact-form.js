import { Stack, Center, Sidebar, Imposter, Box } from "components/layouts";
import * as React from "react";
import { useForm } from "react-hook-form";
import styled from "@emotion/styled";
import Link from "next/link";
import { TwitterLogo, GitHubLogo, LinkedInLogo } from "components/svg/logos";

export function ContactForm() {
  const [count, setCount] = React.useState(0);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log("Submitting", data);
    fetch("/api/contact", { method: "POST", body: JSON.stringify(data) });
  };
  console.log(errors);

  const handleChange = (event) => setCount(event.target.value.length);

  const fieldClasses = (fieldName) =>
    errors[fieldName]
      ? "placeholder-red-500 focus:ring-red-500 border-red-500 border"
      : "placeholder-gray-500 focus:ring-lt-primary-lighter border-transparent border";

  return (
    <div className="max-w-4xl mx-auto sm:mt-16">
      <div className="">
        <div className="flex flex-col sm:flex-row">
          <div className="p-6 pt-6 sm:w-2/5">
            <h2 className="font-bold text-3xl">Get in touch!</h2>
            <div className="mt-4">
              <p>
                I love hearing from people all over the world. Whether you want
                to just chat, collaborate or already have a team of great folks
                having fun building great experiences, I would love to hear from
                you.
              </p>
              <SocialSection className="hidden sm:block" />
            </div>
          </div>
          <div className="sm:w-3/5 -mt-6 sm:mt-0 p-6 w-9/10">
            <form
              className="well-shadow p-6 bg-blueGray-400 text-blueGray-700 shadow-inner rounded-3xl"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div>
                <label htmlFor="full_name" className="sr-only">
                  Full name
                </label>
                <input
                  type="text"
                  name="name"
                  autoComplete="name"
                  className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md ${fieldClasses(
                    "name"
                  )}`}
                  placeholder={`${
                    errors.name
                      ? "⚠️ You forgot your name"
                      : "What's your name?"
                  }`}
                  ref={register({
                    required: "Please enter your name",
                    maxLength: 100
                  })}
                />
              </div>
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md  ${fieldClasses(
                    "email"
                  )}`}
                  placeholder={
                    errors.email ? "⚠️ Don't forget your email" : "Email"
                  }
                  ref={register({
                    required: "Please enter your email",
                    maxLength: 320
                  })}
                />
                <div>
                  <label htmlFor="message" className="sr-only">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows="4"
                    onChange={handleChange}
                    className={`block w-full py-3 px-4 mb-4 bg-lt-bg-lightest rounded-md ${fieldClasses(
                      "message"
                    )}`}
                    placeholder={
                      errors.message
                        ? "⚠️ Don't be shy, tell me something"
                        : "Tell me everything!*"
                    }
                    ref={register({
                      required: "You forgot to write something",
                      maxLength: 2000
                    })}
                  ></textarea>
                </div>
                <div className="flex justify-between ">
                  <div
                    className={` ${
                      count >= 2000 ? "text-error-600" : "text-blueGray-600"
                    }`}
                  >
                    {count >= 2000
                      ? `You typed ${-2000 + count} characters too many`
                      : `${2000 - count} characters left`}
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="block ml-auto py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </form>
            <div className="text-right font-quirky ml-auto mr-3 mt-1 text-xs text-gray-500 dark:text-gray-200">
              *Don&apos;t forget to be nice{" "}
              <span role="img" aria-label="winky face">
                😉
              </span>
            </div>
          </div>
        </div>
        <SocialSection className="sm:hidden -mt-6 px-6 pb-6" />
      </div>
    </div>
  );
}

const SocialSection = ({ className }) => (
  <div className={className}>
    <p className="pt-4 font-semibold">Or find me on the web...</p>
    <div className="flex mt-5 justify-around text-lt-bg dark:text-dk-bg">
      <Link href="https://github.com/pricklywiggles">
        <div className="hover:cursor-pointer flex rounded-full w-12 h-12 bg-blueGray-400 overflow-hidden well-shadow ">
          <GitHubLogo className="m-auto  fill-current w-10 h-10 " />
        </div>
      </Link>
      <Link href="https://twitter.com/pricklywiggles">
        <div className="hover:cursor-pointer flex bg-blueGray-400 w-12 h-12 rounded-full well-shadow">
          <TwitterLogo className="m-auto pt-1 fill-current w-8 h-8" />
        </div>
      </Link>
      <Link href="https://www.linkedin.com/in/gustavogallegos/">
        <div className="hover:cursor-pointer flex bg-blueGray-400 w-12 h-12  rounded-full well-shadow">
          <LinkedInLogo className="m-auto pb-1 fill-current w-7 h-7" />
        </div>
      </Link>
    </div>
  </div>
);

const Error = styled.div`
  width: 100%;
  position: relative;
  ${(props) =>
    props.message
      ? `
    &::before {
      content: "${props.message}";
      position: absolute;
      width: 100%;
      font-weight: 400;
      color: red;
      text-align: right;
      text-transform: lowercase;
      font-variant: small-caps;
      opacity: 80%;
    }
  `
      : "display: none;"}
`;
