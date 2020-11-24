import {
  Stack,
  Center,
  Box,
  Switcher,
  Sidebar,
  Cover,
  Cluster,
  Frame,
  Imposter,
  Grid,
  Reel
} from "components/layouts";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

// eslint-disable-next-line react/display-name
export default function Home() {
  return (
    <Container>
      <div>
        <Stack>
          <Cluster justify="space-between">
            <Box>Logo</Box>
            <Cluster>
              <Box>Link 1</Box>
              <Box>Link 2</Box>
              <Box>Link 3</Box>
              <Box>Link 4</Box>
            </Cluster>
          </Cluster>
          <Center maxWidth="80%">
            <Cover minHeight="50%">
              <div>Some cover header text</div>
              <h1>This text is the main text of the cover</h1>
              <div>Some cover footer text</div>
            </Cover>
            <Imposter fixed>
              <Box css={{ backgroundColor: "black" }}>This is an imposter!</Box>
            </Imposter>
          </Center>
          <Center maxWidth="80%">
            <Frame ratio="4:4">
              <img
                alt="vista"
                src="https://images.unsplash.com/photo-1605441065768-a2798213ac26?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1300&q=80"
              />
            </Frame>

            <Box>This is the Biographical section which is mostly text</Box>
          </Center>
          <div>
            <div>Projects</div>
            <Switcher threshold="875px">
              <Box>
                <Sidebar sideWidth="50px" noStretch>
                  <Box>Project Image</Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Sidebar>
              </Box>
              <Box>
                <Sidebar sideWidth="50px" noStretch>
                  <Box>Project Image</Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Sidebar>
              </Box>
              <Box>
                <Sidebar sideWidth="50px" noStretch>
                  <Box>Project Image</Box>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </p>
                </Sidebar>
              </Box>
            </Switcher>
          </div>
          <Center maxWidth="80%">
            <div>Contact Me</div>
            <Box>
              Contact Form with some nice controls and a superior textarea
            </Box>
          </Center>
          <Grid>
            <Box>Grid Item 1</Box>
            <Box>Grid Item 2</Box>
            <Box>Grid Item 3</Box>
            <Box>Grid Item 4</Box>
            <Box>Grid Item 5</Box>
            <Box>Grid Item 6</Box>
            <Box>Grid Item 7</Box>
            <Box>Grid Item 8</Box>
            <Box>Grid Item 9</Box>
            <Box>Grid Item 10</Box>
            <Box>Grid Item 11</Box>
            <Box>Grid Item 12</Box>
          </Grid>
          <Reel>
            <Box>Reel Item 1</Box>
            <Box>Reel Item 2</Box>
            <Box>Reel Item 3</Box>
            <Box>Reel Item 4</Box>
            <Box>Reel Item 5</Box>
            <Box>Reel Item 6</Box>
            <Box>Reel Item 7</Box>
            <Box>Reel Item 8</Box>
            <Box>Reel Item 9</Box>
            <Box>Reel Item 10</Box>
            <Box>Reel Item 11</Box>
            <Box>Reel Item 12</Box>
          </Reel>
          <div>Footer</div>
        </Stack>
      </div>
    </Container>
  );
}

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  & > * {
    width: 80vw;
    margin: auto;
    border: 1px solid darkblue;
  }

  ${Box} {
    border: 0.5px solid red;
    border-radius: 20px;
  }

  ${Stack} {
    border: 1px dashed gray;
    & > * {
      border: 1px dotted yellow;
    }
  }
`;
