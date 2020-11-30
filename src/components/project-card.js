import { Logo } from "components/logo";
import Link from "next/link";
import { stackIcons } from "utils/data";
import styled from "@emotion/styled";

export function ProjectCard({ title, href, logo, stack, description }) {
  return (
    <Link href={href}>
      <Card>
        <div>
          <img src={logo} alt={`${title} logo`} className="logo" />
          <div className="highlight" />
        </div>
        <div>
          <div className="title">{title}</div>
          <div>
            {stack.map((technology) => (
              <Logo
                key={technology}
                src={stackIcons[technology]}
                size="2.5ch"
              />
            ))}
          </div>
          <div className="description">{description}</div>
        </div>
      </Card>
    </Link>
  );
}

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
