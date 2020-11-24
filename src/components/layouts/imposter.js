import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Imposter = styled.div`
  position: ${(props) => (props.fixed ? "fixed" : "absolute")};
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  ${(props) =>
    props.contain
      ? `
    overflow: auto;
    max-width: calc(100% - (${props.margin} * 2));
    max-height: calc(100% - (${props.margin} * 2));`
      : ""}
`;

Imposter.propTypes = {
  fixed: PropTypes.bool,
  contain: PropTypes.bool,
  margin: PropTypes.string
};

Imposter.defaultProps = {
  fixed: false,
  contain: false,
  margin: "0"
};
