import styled from "@emotion/styled";
import PropTypes from "prop-types";

/**
 * Implementation of Every Layout's Switcher component.
 * Two elements are displayed either side by side (if space permits) or on top of each other
 * Props: side, sideWidth, contentMin, space, noStretch
 *
 * @visibleName A Sidebar Primitive.
 */
export const Sidebar = ({ children, ...props }) => (
  <SidebarContainer {...props}>
    <div className="sidebar">{children}</div>
  </SidebarContainer>
);

const SidebarContainer = styled.div`
  & > div {
    display: flex;
    flex-wrap: wrap;
    margin: calc(${(props) => props.space} / 2 * -1);
    ${(props) => (props.noStretch ? "align-items: flex-start;" : "")}
  }
  & > div > * {
    margin: calc(${(props) => props.space} / 2);
    ${(props) => (props.sideWidth ? `flex-basis: ${props.sideWidth};` : "")};
    flex-grow: 1;
  }

  &
    > div
    > ${(props) => (props.side === "left" ? ":last-child" : ":first-child")} {
    flex-basis: 0;
    flex-grow: 999;
    min-width: ${(props) => props.contentMin};
  }
`;

SidebarContainer.propTypes = {
  side: PropTypes.string,
  sideWidth: PropTypes.string,
  contentMin: PropTypes.string,
  space: PropTypes.string,
  noStretch: PropTypes.bool
};

SidebarContainer.defaultProps = {
  /** Whether the sidebar is to the left or right of content */
  side: "left",
  /** How big the content has to be before it wraps */
  contentMin: "50%",
  space: "var(--s1)",
  noStretch: false
};
