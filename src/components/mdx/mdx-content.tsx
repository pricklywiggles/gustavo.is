import * as runtime from "react/jsx-runtime";
import { Callout } from "./callout";
import { MdxImage } from "./mdx-image";

const sharedComponents = {
  Callout,
  Image: MdxImage,
};

// Velite compiles MDX to JavaScript at build time. The code string is a
// build-time artifact, not user input, so evaluating it here is safe.
const useMDXComponent = (code: string) => {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
};

interface MDXContentProps {
  code: string;
  components?: Record<string, React.ComponentType>;
}

export function MDXContent({ code, components }: MDXContentProps) {
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
