import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Grid = styled.div`
  display: grid;
  grid-gap: ${(props) => props.space};

  @supports (width: min(${(props) => props.min}, 100%)) {
    grid-template-columns: repeat(
      auto-fit,
      minmax(min(${(props) => props.min}, 100%), 1fr)
    );
  }
`;

Grid.propTypes = {
  min: PropTypes.string,
  space: PropTypes.string
};

Grid.defaultProps = {
  min: "250px",
  space: "var(--s1)"
};
