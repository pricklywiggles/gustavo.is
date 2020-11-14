import React from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";

export default function Link({ href, children }) {
  const router = useRouter();
  let className = children.props.className ?? "";

  if (router.pathname === href) {
    className = `${className} current`;
  }
  return (
    <NextLink href={href}>
      {React.cloneElement(children, { className })}
    </NextLink>
  );
}
