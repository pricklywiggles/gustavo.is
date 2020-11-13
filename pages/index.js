import Head from "next/head";
import React from "react";
import { css } from "@emotion/core";
import { Header } from "../components/header";
import styled from "@emotion/styled";

export default function Home() {
  return (
    <main>
      <Head>
        <title>Hello World</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div
        css={css`
          margin: 0 auto;
          max-width: 1200px;
        `}
      >
        <Header />
        <main
          css={css`
            color: var(--colors-primary);
            font-size: 2em;
            padding-top: 100px;
          `}
        >
          <div>
            <h1>This is an h1</h1>
            <h2>This is an h2</h2>
            <h3>This is an h3</h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Dolor
              sit amet consectetur adipiscing elit. Ut etiam sit amet nisl purus
              in. Nec ultrices dui sapien eget mi. Sagittis orci a scelerisque
              purus semper eget duis. In massa tempor nec feugiat nisl pretium
              fusce id. Tristique senectus et netus et malesuada fames. Feugiat
              sed lectus vestibulum mattis. Dui vivamus arcu felis bibendum.
              Ullamcorper a lacus vestibulum sed arcu non. Pellentesque elit
              ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at.
              Sit amet massa vitae tortor condimentum. Amet porttitor eget dolor
              morbi non arcu. Sed viverra ipsum nunc aliquet. Odio ut sem nulla
              pharetra diam sit amet nisl. Commodo nulla facilisi nullam
              vehicula ipsum a arcu. Elementum nisi quis eleifend quam
              adipiscing vitae proin sagittis. Aenean et tortor at risus viverra
              adipiscing at. Ante metus dictum at tempor commodo. Bibendum arcu
              vitae elementum curabitur vitae. Platea dictumst vestibulum
              rhoncus est pellentesque. Augue eget arcu dictum varius duis at
              consectetur lorem. Id interdum velit laoreet id. Viverra nibh cras
              pulvinar mattis nunc sed blandit libero volutpat. Proin sagittis
              nisl rhoncus mattis rhoncus. A cras semper auctor neque. Rhoncus
              dolor purus non enim. Vulputate eu scelerisque felis imperdiet.
            </p>
            <p>
              Erat imperdiet sed euismod nisi. Eu nisl nunc mi ipsum faucibus
              vitae aliquet nec ullamcorper. Tortor condimentum lacinia quis vel
              eros. Ultricies leo integer malesuada nunc. Dignissim diam quis
              enim lobortis scelerisque fermentum. Gravida in fermentum et
              sollicitudin ac. Tincidunt vitae semper quis lectus nulla at
              volutpat diam ut. Dui ut ornare lectus sit amet est placerat.
              Condimentum id venenatis a condimentum vitae. Praesent elementum
              facilisis leo vel fringilla est. Molestie at elementum eu
              facilisis sed. Ut morbi tincidunt augue interdum velit euismod in.
              In tellus integer feugiat scelerisque varius morbi enim nunc
              faucibus. Vel facilisis volutpat est velit. Sed egestas egestas
              fringilla phasellus faucibus scelerisque eleifend donec. Egestas
              erat imperdiet sed euismod nisi porta lorem mollis. Odio ut enim
              blandit volutpat maecenas. At urna condimentum mattis pellentesque
              id. Lectus vestibulum mattis ullamcorper velit sed ullamcorper
              morbi. Nibh tortor id aliquet lectus proin nibh nisl. Risus at
              ultrices mi tempus imperdiet nulla. Id leo in vitae turpis massa
              sed elementum tempus. Mauris nunc congue nisi vitae suscipit
              tellus mauris. Lorem ipsum dolor sit amet, consectetur adipiscing
              elit, sed do eiusmod tempor incididunt ut labore et dolore magna
              aliqua. Dolor sit amet consectetur adipiscing elit. Ut etiam sit
              amet nisl purus in. Nec ultrices dui sapien eget mi. Sagittis orci
              a scelerisque purus semper eget duis. In massa tempor nec feugiat
              nisl pretium fusce id. Tristique senectus et netus et malesuada
              fames. Feugiat sed lectus vestibulum mattis. Dui vivamus arcu
              felis bibendum. Ullamcorper a lacus vestibulum sed arcu non.
              Pellentesque elit ullamcorper dignissim cras tincidunt lobortis
              feugiat vivamus at. Sit amet massa vitae tortor condimentum. Amet
              porttitor eget dolor morbi non arcu. Sed viverra ipsum nunc
              aliquet. Odio ut sem nulla pharetra diam sit amet nisl. Commodo
              nulla facilisi nullam vehicula ipsum a arcu. Elementum nisi quis
              eleifend quam adipiscing vitae proin sagittis. Aenean et tortor at
              risus viverra adipiscing at. Ante metus dictum at tempor commodo.
              Bibendum arcu vitae elementum curabitur vitae. Platea dictumst
              vestibulum rhoncus est pellentesque. Augue eget arcu dictum varius
              duis at consectetur lorem. Id interdum velit laoreet id. Viverra
              nibh cras pulvinar mattis nunc sed blandit libero volutpat. Proin
              sagittis nisl rhoncus mattis rhoncus. A cras semper auctor neque.
              Rhoncus dolor purus non enim. Vulputate eu scelerisque felis
              imperdiet. Erat imperdiet sed euismod nisi. Eu nisl nunc mi ipsum
              faucibus vitae aliquet nec ullamcorper. Tortor condimentum lacinia
              quis vel eros. Ultricies leo integer malesuada nunc. Dignissim
              diam quis enim lobortis scelerisque fermentum. Gravida in
              fermentum et sollicitudin ac. Tincidunt vitae semper quis lectus
              nulla at volutpat diam ut. Dui ut ornare lectus sit amet est
              placerat. Condimentum id venenatis a condimentum vitae. Praesent
              elementum facilisis leo vel fringilla est. Molestie at elementum
              eu facilisis sed. Ut morbi tincidunt augue interdum velit euismod
              in. In tellus integer feugiat scelerisque varius morbi enim nunc
              faucibus. Vel facilisis volutpat est velit. Sed egestas egestas
              fringilla phasellus faucibus scelerisque eleifend donec. Egestas
              erat imperdiet sed euismod nisi porta lorem mollis. Odio ut enim
              blandit volutpat maecenas. At urna condimentum mattis pellentesque
              id. Lectus vestibulum mattis ullamcorper velit sed ullamcorper
              morbi. Nibh tortor id aliquet lectus proin nibh nisl. Risus at
              ultrices mi tempus imperdiet nulla. Id leo in vitae turpis massa
              sed elementum tempus. Mauris nunc congue nisi vitae suscipit
              tellus mauris.
            </p>
          </div>
        </main>
      </div>
      <footer></footer>
    </main>
  );
}
