import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Frame component.
 * Props: ratio ("16:9")
 *
 * @visibleName A Layout Frame Primitive.
 */
export const Frame = styled.div`
  padding-bottom: ${(props) => {
    const dimensions = props.ratio.split(":").map(Number);
    const ratio = (dimensions[1] / dimensions[0]) * 100;
    return `${ratio}`;
  }}%;
  position: relative;

  & > * {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  & > img,
  & > video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /*z-index: -1;*/
  }
`;

Frame.propTypes = {
  ratio: PropTypes.string
};

Frame.defaultProps = {
  ratio: "16:9"
};
