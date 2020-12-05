import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;

  & > * {
    margin-top: 0;
    margin-bottom: 0;
  }

  & > * + * {
    margin-top: ${(props) => props.space};
  }

  &:only-child {
    height: 100%;
  }

  & > :nth-of-type(${(props) => props.splitAt}) {
    margin-bottom: auto;
  }
`;

Stack.propTypes = {
  space: PropTypes.string,
  splitAt: PropTypes.number
};

Stack.defaultProps = {
  space: "var(--s1)",
  splitAt: 4
};
