// import Header from '@/components/header'; // kept for reference during transition
import { SiteHeader } from '@/components/header/SiteHeader';
import './globals.css';
import { wotfard, wavesSignal, pixelRobot } from '@/fonts/fonts';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

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
    <html lang='en' suppressHydrationWarning className={cn("font-sans", geist.variable)}>
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
        className={`${wotfard.variable} ${wavesSignal.variable} ${pixelRobot.variable} font-sans text-gray-800 bg-lt-bg dark:text-gray-300 dark:bg-dk-bg`}
      >
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
