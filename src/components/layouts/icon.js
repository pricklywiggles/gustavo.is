import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Icon = styled.div`
  svg {
    width: 0.75em;
    width: 1cap;
    height: 0.75em;
    width: 1cap;
  }

  /* When not providing space, we can just add a space betwen the svg and the text (preferred) */
  ${(props) =>
    props.space
      ? `
    display: inline-flex;
    align-items: baseline;

    svg {
      margin-inline-end: 1rem;
    }
  `
      : ""}
`;

Icon.propTypes = {
  space: PropTypes.string
};
