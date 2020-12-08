import styled from "@emotion/styled";
import PropTypes from "prop-types";

export function Stack({ space, splitAt, children }) {
  return (
    <div style={{ "--space": space, "--splitAt": splitAt }} className="stack">
      {children}
    </div>
  );
}

Stack.propTypes = {
  space: PropTypes.string,
  splitAt: PropTypes.string
};

Stack.defaultProps = {
  space: "20px",
  splitAt: "4"
};
