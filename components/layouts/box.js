import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Box component.
 *
 * @visibleName A Layout Box Primitive.
 */
export const Box = styled.div`
  padding: ${(props) => props.padding};
  border: ${(props) => props.borderWidth} solid;
  color: var(--colors-dark);
  background-color: inherit;
  outline: 0.125rem solid transparent;
  outline-offset: -0.125rem;

  * {
    color: inherit;
  }
`;

Box.propTypes = {
  /** space around the box's content */
  padding: PropTypes.string,
  /** width of the border */
  borderWidth: PropTypes.string
};

Box.defaultProps = {
  padding: "var(--s1)",
  borderWidth: "var(--border-thin)"
};
