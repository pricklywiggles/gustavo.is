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
import Link from "next/link";
import { css } from "@emotion/core";
import styled from "@emotion/styled";

// eslint-disable-next-line react/display-name
export default function Home() {
  return (
    <Center maxWidth="30ch" alignText={true}>
      <Box />
      <Box />
      <Stack css={container}>
        <Link href="/layouts/home">
          <Box>Home Layout</Box>
        </Link>
        <Link href="/layouts/card">
          <Box>Card</Box>
        </Link>
        <Link href="/layouts/test">
          <Box>All Layout Components</Box>
        </Link>
      </Stack>
    </Center>
  );
}

const container = css`
  ${Box} {
    border: 0.5px solid red;
    border-radius: 20px;
  }
`;
