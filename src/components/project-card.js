import React from "react";
import Link from "next/link";
import { logos } from "utils/data";

export function ProjectCard({ title, href, logo, stack, description }) {
  const [hovering, setHovering] = React.useState(false);
  return (
    <Link href={href}>
      <div
        className={`flex flex-nowrap mx-auto max-w-min sm:flex-col mb-6 sm:mb-0 overflow-hidden shadow-md hover:shadow-lg transition-all transform scale-90 hover:scale-100 sm:scale-100 sm:hover:scale-101 bg-lt-bg-lightest dark:bg-lt-bg dark:text-gray-700 rounded-xl sm:p-4 ${
          hovering ? "cursor-pointer" : ""
        }`}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        <div
          className={`card-logo ${
            hovering ? "card-logo-hover" : ""
          } relative  w-48 h-48`}
        >
          {React.createElement(logo, {
            className:
              "absolute p-2 bg-dk-bg border-8 border-double border-primary-800 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-3/4 w-3/4 rounded-full"
          })}
        </div>
        <div className="flex p-2 flex-col justify-around border-l sm:border-l-0 sm:border-t border-dk-bg-400 px-2 text-center w-48 h-48">
          <div className="self-center">
            <div className=" text-md font-semibold border-2 border-lt-bg-darker bg-lt-bg-lighter px-2 uppercase mt-0 sm:-mt-10 rounded-full shadow-sm">
              {title}
            </div>
          </div>
          <div className="flex justify-around">
            {stack.map((technology) =>
              React.createElement(logos[technology].component, {
                key: technology,
                className: "h-6 w-6"
              })
            )}
          </div>
          <div className="description">{description}</div>
          {/* <div
            className={`${
              hovering ? "opacity-100" : "opacity-0"
            } text-3xl mb-5`}
          >
            ↣
          </div> */}
        </div>
      </div>
    </Link>
  );
}
