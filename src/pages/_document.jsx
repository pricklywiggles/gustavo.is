import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="en">
        <Head>
          <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="anonymous"></link>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/normalize/8.0.1/normalize.min.css"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Reenie+Beanie&family=Indie+Flower&family=Aleo:ital,wght@0,300;0,400;1,300&family=Roboto:wght@300&display=swap"
            rel="stylesheet"></link>
          <link
            rel="preload"
            href="/fonts/Wotfard/wotfard-bold-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Wotfard/wotfard-semibold-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Wotfard/wotfard-bold-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/Archia/archia-regular-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/BasierMono/basiercirclemono-regular-webfont.ttf"
            as="font"
            type="font/ttf"
            crossOrigin="anonymous"
          />
        </Head>
        <body className="text-gray-800 bg-lt-bg dark:text-gray-300 dark:bg-dk-bg">
          <script src="/noflash.js" defer />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
