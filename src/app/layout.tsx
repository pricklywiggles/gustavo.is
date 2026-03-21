import { SiteHeader } from '@/components/header/SiteHeader';
import { SiteFooter } from '@/components/footer/SiteFooter';
import './globals.css';
import { wotfard, wavesSignal, pixelRobot } from '@/fonts/fonts';

export const metadata = {
  metadataBase: new URL('https://gustavo.is'),
  title: {
    default: 'Gustavo Gallegos',
    template: '%s — Gustavo Gallegos',
  },
  description: 'Product designer and engineer. Previously at Microsoft and Ponder.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gustavo.is',
    siteName: 'Gustavo Gallegos',
    title: 'Gustavo Gallegos',
    description: 'Product designer and engineer. Previously at Microsoft and Ponder.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gustavo Gallegos',
    description: 'Product designer and engineer. Previously at Microsoft and Ponder.',
  },
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${wotfard.variable} ${wavesSignal.variable} ${pixelRobot.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
        try {
          if (localStorage.theme === 'true' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        } catch (_) {}
      `
          }}
        />
      </head>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
