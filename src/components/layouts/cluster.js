import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Cluster = ({ children, ...props }) => (
  <ClusterContainer {...props}>
    <div>{children}</div>
  </ClusterContainer>
);

const ClusterContainer = styled.div`
  overflow: hidden;

  & > div {
    display: flex;
    flex-wrap: wrap;
    justify-content: ${(props) => props.justify};
    align-items: ${(props) => props.align};
    margin: calc(-1 * ${(props) => props.space} / 2);
  }

  & > div > * {
    margin: calc(${(props) => props.space} / 2);
  }
`;

Cluster.propTypes = {
  justify: PropTypes.string,
  align: PropTypes.string,
  space: PropTypes.string
};

Cluster.defaultProps = {
  justify: "flex-start",
  align: "center",
  space: "var(--s1)"
};
