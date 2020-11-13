import Document, { Html, Head, Main, NextScript } from "next/document";
import { css, Global } from "@emotion/core";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        {/* <Global styles={globalStyles} /> */}
        <Head>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&family=Indie+Flower&family=Aleo:ital,wght@0,300;0,400;1,300&family=Roboto:wght@300&display=swap"
            rel="stylesheet"
          ></link>
        </Head>
        <body>
          <script src="/noflash.js" />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
