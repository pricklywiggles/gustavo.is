import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Switcher component. Switch directly between horizontal and vertical layouts at a given (container width-based) breakpoint or 'threshold'
 *
 * @visibleName A Switcher Primitive.
 */
export const Switcher = ({ children, ...props }) => (
  <SwitcherContainer {...props}>
    <div>{children}</div>
  </SwitcherContainer>
);

const SwitcherContainer = styled.div`
  display: block;
  & > * {
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
    ${"" /* margin: calc(${(props) => props.space} / 2) * -1); */}
  }

  & > * > * {
    flex-grow: 1;
    ${(props) =>
      `flex-basis: calc((${props.threshold} - 100%) * 999);
      margin: calc(${props.space} / 2);`}
  }

  ${(props) => `
  & > * > :nth-last-child(n+${props.limit + 1}),
  & > * > :nth-last-child(n+${props.limit + 1}) ~ * {
    flex-basis: 99.23%;
  `}
`;

SwitcherContainer.propTypes = {
  threshold: PropTypes.string,
  space: PropTypes.string,
  limit: PropTypes.number
};

SwitcherContainer.defaultProps = {
  /** CSS width value representing the container breakpoint */
  threshold: "var(--measure)",
  /** CSS margin value */
  space: "var(--s1)",
  /** Maximum number of items permitted horizontally */
  limit: 3
};
