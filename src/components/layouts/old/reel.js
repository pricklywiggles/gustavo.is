import styled from "@emotion/styled";
import PropTypes from "prop-types";

export const Reel = styled.div`
  display: flex;
  height: auto;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-color: var(--colors-primary) var(--colors-background);
  padding-bottom: ${(props) => props.space};

  &::-webkit-scrollbar {
    height: ${(props) => props.space};
  }

  &::-webkit-scrollbar-track {
    background-color: var(--colors-background);
  }

  &::-webkit-scrollbar-thumb {
    background-color: var(--colors-background);
    background-image: linear-gradient(
      var(--colors-background) 0,
      var(--colors-background) 0.25rem,
      var(--colors-primary) 0.25rem,
      var(--colors-primary) 0.75rem,
      var(--colors-background) 0.75rem
    );
  }

  & > * {
    flex: 0 0 auto;
  }

  & > img {
    height: 100%;
    flex-basis: auto;
    width: auto;
  }

  & > * + * {
    margin-left: ${(props) => props.space};
  }
`;

Reel.propTypes = {
  itemWidth: PropTypes.string,
  space: PropTypes.string,
  height: PropTypes.string
  // trackColor: PropTypes.string,
  // thumbColor: PropTypes.string
};

Reel.defaultProps = {
  itemWidth: "auto",
  space: "var(--s0)",
  height: "auto"
};
