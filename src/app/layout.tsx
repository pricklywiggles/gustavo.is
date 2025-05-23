import Header from '@/components/header';
import './globals.css';
import { wotfard } from '@/fonts/fonts';

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
    <html lang='en' suppressHydrationWarning>
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
      <body
        className={`${wotfard.variable} font-sans text-gray-800 bg-lt-bg dark:text-gray-300 dark:bg-dk-bg`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
