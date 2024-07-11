/* eslint-disable @next/next/no-sync-scripts */
'use client';
import Head from 'next/head';
import Script from 'next/script';
import * as React from 'react';

const origins = {
  production: 'https://source.tartle.co',
  development: 'http://localhost:3000',
  staging: 'https://staging.tartle.co',
  demo: 'https://demo.tartle.co'
};

type Origin = keyof typeof origins;

export default function Completed({
  searchParams
}: {
  searchParams: { env: Origin };
}) {
  const envParam = searchParams['env'];
  const [key, setKey] = React.useState<string>('');
  let env: Origin = 'production';
  if (
    envParam === 'staging' ||
    envParam === 'development' ||
    envParam === 'demo'
  ) {
    env = envParam;
  }

  React.useEffect(() => {
    setKey(localStorage.getItem('tartleEndlinkToken') || '');
  }, []);

  return (
    <>
      <Script defer src={`${origins[env]}/scripts/endlink-completion.js`} />
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className='text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl'>
            <div className='text-gray-800 dark:text-gray-200 mb-24'>{key}</div>
          </div>
        </div>
      </div>
    </>
  );
}
