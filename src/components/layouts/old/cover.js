import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Cover component.
 * Props: selector, minHeight, space, noPadding;
 *
 * @visibleName A Layout Cover Primitive.
 */
export const Cover = styled.div`
  display: flex;
  flex-direction: column;
  min-height: ${(props) => `calc(${props.minHeight} - (${props.space} * 2))`};
  padding: ${(props) => (props.noPadding ? "0" : props.space)};

  & > * {
    margin-top: ${(props) => props.space};
    margin-bottom: ${(props) => props.space};
  }

  & > :first-child:not(${(props) => props.selector}) {
    margin-top: 0;
  }

  & > :last-child:not(${(props) => props.selector}) {
    margin-bottom: 0;
  }

  & > ${(props) => props.selector} {
    margin-top: auto;
    margin-bottom: auto;
  }
`;

Cover.propTypes = {
  selector: PropTypes.string,
  minHeight: PropTypes.string,
  space: PropTypes.string,
  noPadding: PropTypes.bool
};

Cover.defaultProps = {
  selector: "h1",
  minHeight: "100vh",
  space: "var(--s1)",
  noPadding: false
};
