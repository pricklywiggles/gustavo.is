import React from "react";
import Link from "next/link";
import { logos } from "utils/data";
import styled from "@emotion/styled";

export function ProjectCard({ title, href, logo, stack, description }) {
  const [hovering, setHovering] = React.useState(false);
  return (
    <Link href={href}>
      <div
        className={`flex flex-nowrap mx-auto sm:mx-0 sm:flex-col mb-6 sm:mb-0 overflow-hidden shadow-md hover:shadow-lg transition-all transform hover:scale-101 bg-lt-bg-lightest dark:bg-lt-bg dark:text-gray-700 rounded-xl sm:p-4 ${
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

//   return (
//     <Link href={href}>
//       <Card>
//         <div>
//           <img src={logo} alt={`${title} logo`} className="logo" />
//           <div className="highlight" />
//         </div>
//         <div>
//           <div className="title">{title}</div>
//           <div>
//             {stack.map((technology) => (
//               <Logo
//                 key={technology}
//                 src={logos[technology]}
//                 size="2.5ch"
//               />
//             ))}
//           </div>
//           <div className="description">{description}</div>
//         </div>
//       </Card>
//     </Link>
//   );
// }

const Card = styled.div`
  --flow: row nowrap;
  --head-width: 10em;
  --head-height: 10em;
  --body-width: 12em;
  --body-height: 11em;
  --border-top: none;
  --border-left: 2px dotted #888888;
  --container-padding: var(--s1) 0 var(--s1) 0;

  @media (min-width: 768px) {
    --flow: column;
    --body-width: 10em;
    --body-height: 13em;
    --border-left: none;
    --border-top: 2px dotted #888888;
    --container-padding: 0 var(--s1) 0 var(--s1);
  }

  display: flex;
  flex-flow: var(--flow);
  border: none;
  color: var(--colors-background);
  background-color: rgb(var(--colors-background-light-rgb));
  padding: var(--container-padding);
  border-radius: var(--s-2);
  box-shadow: inset 0 0 3px 1px var(--colors-background-lighter);

  --explore: var(--colors-primary);
  &:hover {
    --explore: var(--colors-background);
  }

  /* head */
  & > div:first-of-type {
    position: relative;
    width: var(--head-width);
    height: var(--head-height);

    & img {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;
      height: 70%;
      padding: 10px;
      border-radius: 999px;
      background: var(--colors-background);
      border: 5px double rgb(var(--colors-background-light-rgb));
    }

    &::after {
      display: block;
      content: "";
      position: absolute;
      ${"" /* z-index: 100; */}
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 60%;
      border-radius: 100%;
      background: linear-gradient(
        to bottom,
        rgba(255, 255, 255, 1) 0%,
        rgba(255, 255, 255, 0) 100%
      );
      opacity: 0.52;
      transition: transform 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
    }
  }

  &:hover {
    & > div:first-of-type {
      &::after {
        transform: translate(-50%, -40%);
      }
    }
    box-shadow: none;
    transform: scale(1.01);
    cursor: pointer;
  }
  transition: all 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);

  /* body */
  & > div:nth-of-type(2) {
    width: var(--body-width);
    height: var(--body-height);
    border-top: var(--border-top);
    border-left: var(--border-left);
    padding: var(--s-2);
    display: flex;
    flex-flow: column;
    text-align: center;

    & > div:first-of-type {
      padding-bottom: var(--s-3);
      text-transform: lowercase;
      font-variant: small-caps;
      font-weight: bold;
      font-size: var(--font-size-big);
    }

    & > div:nth-of-type(2) {
      display: flex;
      flex-flow: row nowrap;
      width: 100%;
      justify-content: space-around;
      padding-bottom: var(--s-1);
    }
    & > div:nth-of-type(3) {
      &::after {
        display: block;
        width: 100%;
        color: var(--explore);
        text-transform: lowercase;
        font-variant: small-caps;
        font-size: var(--font-size-bigger);
        content: "↠";
        transition: all 0.65s cubic-bezier(0.18, 0.9, 0.58, 1);
      }
    }
  }
`;
