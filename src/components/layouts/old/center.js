import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Center component.
 * Props: maxWidth, alignText, gutterWidth, intrinsic.
 *
 * @visibleName A Layout Center Primitive.
 */
export const Center = styled.div`
  display: block;
  box-sizing: content-box;
  margin-left: auto;
  margin-right: auto;
  ${(props) => (props.alignText ? "text-align: center;" : "")};
  max-width: ${(props) => props.maxWidth};
  ${(props) =>
    props.gutterWidth !== "0"
      ? `
    padding-left: ${props.gutterWidth};
    padding-right: ${props.gutterWidth};`
      : ""};

  ${(props) => {
    return props.intrinsic
      ? `
    display: flex;
    flex-direction: column;
    align-items: center;`
      : "";
  }};
`;

Center.propTypes = {
  /** maximum width */
  maxWidth: PropTypes.string,
  /** center align text content */
  alignText: PropTypes.bool,
  /** minimum stpace on either side of the content */
  gutterWidth: PropTypes.string,
  /** Center child elements based on their content width */
  intrinsic: PropTypes.bool
};

Center.defaultProps = {
  maxWidth: "var(--measure)",
  alignText: false,
  gutterWidth: "0",
  intrinsic: false
};
