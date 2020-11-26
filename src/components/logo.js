import styled from "@emotion/styled";

export const Logo = styled.div`
  --size: ${(props) => props.size};
  --inner-size: calc(var(--size) / var(--ratio));

  @media (min-width: 700px) {
    --size: calc(${(props) => props.size} * var(--ratio));
    --inner-size: ${(props) => props.size};
  }

  position: relative;
  border: none;
  width: var(--size);
  height: var(--size);
  align-self: center;
  background: ${(props) =>
    props.src ? `url(${props.src}) no-repeat center` : "none"};
  background-size: var(--inner-size) var(--inner-size);

  /* if icon is white and theme is light, invert to black through theme inversion var */
  ${(props) =>
    props.invertable ? "filter: invert(var(--icon-inversion));" : ""}
  /* programmatic control not tied to the theme */
  ${(props) => (props.invert ? "filter: invert(100%);" : "")}
  /* option to use emoticon instead of src svg */
    ${(props) =>
    props.icon
      ? `
  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-55%) translateX(-50%);
    content: "${props.icon}";
    font-size: var(--font-size-biggest);
  }`
      : ""}
`;

Logo.defaultProps = {
  size: "7ch"
};
