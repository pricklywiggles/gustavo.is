import { SiteHeader } from '@/components/header/SiteHeader';
import './globals.css';
import { wotfard, wavesSignal, pixelRobot } from '@/fonts/fonts';

export const metadata = {
  title: 'Gustavo Gallegos',
  description: "Gustavo's personal website"
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
      </body>
    </html>
  );
}
