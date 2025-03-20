/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import Script from 'next/script';

export default async function Completed({
  searchParams
}: {
  searchParams: Promise<{ env: string }>;
}) {
  const { env: envParam } = await searchParams;

  let src = 'https://source.tartle.co/scripts/endlink-completion.js';
  if (envParam) {
    src = 'https://demo.tartle.co/scripts/endlink-completion-demo.js';
  }

  return (
    <>
      <Script src={src} />
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className='text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl'>
            <div className='text-gray-800 dark:text-gray-200 mb-24'>👍</div>
          </div>
        </div>
      </div>
    </>
  );
}
