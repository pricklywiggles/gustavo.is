import * as React from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { EnvelopeIcon } from "./svg/icons";
import { accounts } from "utils/data";

export function ContactForm({ className, dialog, onFinished }) {
  const [count, setCount] = React.useState(0);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = (data) => {
    console.log("Submitting", data);
    fetch("/api/contact", {
      method: "POST",
      body: JSON.stringify(data)
    })
      .then((res) => res.json())
      .then(({ message }) => {
        console.log(message);
        if (message === "SUCCESS") {
          if (onFinished) onFinished("success");
          else console.warn("ContactForm has no onFinished callback");
        }
      })
      .catch((error) => {
        console.log(error);
        onFinished("failure");
      });
  };
  console.log(errors);

  const handleChange = (event) => setCount(event.target.value.length);

  const fieldClasses = (fieldName) =>
    errors[fieldName]
      ? `placeholder-red-500 focus:ring-red-500 border-red-500 border`
      : `placeholder-gray-500 focus:ring-lt-primary-lighter  ${
          dialog ? "border-coolGray-200 border-2" : "border-transparent border"
        }`;

  return (
    <form
      className={`relative h-full  text-blueGray-700 ${className}`}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* {sent ? (
        <div className="absolute flex flex-col p-6 justify-center rounded-3xl items-center text-blueGray-500 bg-blur-50 inset-1">
          <div>
            <EnvelopeIcon className="inline h-28" />
            <CheckmarkIcon className="inline h-28" />
          </div>
          <div className="text-4xl text-center py-10">
            All done! <span className="block">Thanks for reaching out.</span>
          </div>
        </div>
      ) : null} */}

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
            errors.name ? "⚠️ You forgot your name" : "What's your name?"
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
          placeholder={errors.email ? "⚠️ Don't forget your email" : "Email"}
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
        <div className={`${dialog ? "" : "flex justify-between"}`}>
          <div
            className={`text-sm ${
              count >= 2000 ? "text-error-600" : "text-blueGray-600"
            } ${dialog ? "text-left -mt-2" : ""}`}
          >
            {count >= 2000
              ? `You typed ${-2000 + count} characters too many`
              : `${2000 - count} characters left`}
          </div>
          <div>
            <button
              type="submit"
              className={`flex items-center justify-center ${
                dialog ? "w-full py-2 mt-4" : "py-3 ml-auto px-6 -mb-2"
              } border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter`}
            >
              <EnvelopeIcon className="h-5 mr-1" />
              Send
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

export const SocialSection = ({ className, noText }) => (
  <div className={className}>
    {noText ? null : (
      <p className="pt-4 font-semibold">Or find me on the web...</p>
    )}
    <div className="flex mt-5 justify-around text-lt-bg dark:text-dk-bg">
      {Object.entries(accounts).map(([key, account]) => (
        <LogoLink key={key} {...account} />
      ))}
    </div>
  </div>
);

export function LogoLink({ className, url, logo }) {
  return (
    <Link href={url}>
      <div
        className={`hover:cursor-pointer flex rounded-full w-12 h-12 bg-blueGray-400 overflow-hidden well-shadow ${className}`}
      >
        {React.createElement(logo, {
          className: "m-auto  fill-current w-10 h-10"
        })}
      </div>
    </Link>
  );
}
