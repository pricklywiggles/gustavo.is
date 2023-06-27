import { Indie_Flower } from 'next/font/google';
import localFont from 'next/font/local';

export const wotfard = localFont({
  variable: '--font-wotfard',
  src: [
    {
      path: './wotfard/wotfard-regular-webfont.ttf',
      weight: '400',
      style: 'normal'
    },
    {
      path: './wotfard/wotfard-semibold-webfont.ttf',
      weight: '600',
      style: 'semibold'
    },
    {
      path: './wotfard/wotfard-bold-webfont.ttf',
      weight: '700',
      style: 'bold'
    }
  ]
});

export const archia = localFont({
  variable: '--font-archia',
  src: './archia/archia-regular-webfont.ttf',
  display: 'swap'
});

export const basierMono = localFont({
  variable: '--font-basier-mono',
  src: './basierMono/basiercirclemono-regular-webfont.ttf'
});

export const indieFlower = Indie_Flower({
  subsets: ['latin'],
  display: 'swap',
  weight: '400',
  variable: '--font-indie-flower'
});
