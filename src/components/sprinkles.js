import { Box } from "./layouts";
import styled from "@emotion/styled";

export const WithLove = () => (
  <BoxWrapper>
    <div>Made with </div>
    <span role="img" aria-label="love">
      🤎
    </span>
    <div>in Los Angeles</div>
  </BoxWrapper>
);

const BoxWrapper = styled(Box)`
  & > * {
    font-size: var(--font-size-smallish);
  }
  div:first-of-type {
    float: left;
  }
  div {
    float: left;
  }
  span {
    float: left;
    padding-left: var(--s-2);
    padding-right: var(--s-3);
    animation: font-bounce-small 1s 0s cubic-bezier(0.18, 1.06, 0.6, 0.95)
      infinite;
  }
`;
