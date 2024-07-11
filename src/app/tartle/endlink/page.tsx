'use client';
import Head from 'next/head';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import * as React from 'react';

const origins = {
  production: 'https://source.tartle.co',
  development: 'http://localhost:3000',
  staging: 'https://staging.tartle.co',
  demo: 'https://demo.tartle.co'
};

type Origin = keyof typeof origins;

const callTartleEndpoint = async (
  origin: Origin,
  endpoint: 'complete' | 'screenout' | 'failed_quality' | 'quota_full',
  token: string,
  setResult: React.Dispatch<React.SetStateAction<string>>
) =>
  fetch(
    `${origins[origin]}/api/v3/endlinks/${endpoint}?tartle_endlink_token=${token}`
  )
    .then((res) =>
      res.ok
        ? setResult(`${endpoint} succeeded`)
        : setResult(`${endpoint} failed ${res.status}`)
    )
    .catch(() => setResult(`${endpoint} failed`));

export default function DataForm({
  searchParams
}: {
  searchParams: { env: Origin };
}) {
  const [result, setResult] = React.useState<string>('');
  const [token, setToken] = React.useState<string>('');
  const envParam = searchParams['env'];
  let env: Origin = 'production';
  if (
    envParam === 'staging' ||
    envParam === 'development' ||
    envParam === 'demo'
  ) {
    env = envParam;
  }

  React.useEffect(() => {
    setToken(localStorage.getItem('tartleEndlinkToken') || '');
  }, []);

  return (
    <>
      <Script src={`${origins[env]}/scripts/endlink-landing.js`} />
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className='text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl'>
            <div className='text-gray-800 dark:text-gray-200 mb-24'>
              ENDLINK TEST
            </div>
          </div>
          <div className='flex flex-col gap-5 justify-start'>
            <div className='text-center'>{result}</div>
            <a
              href={`/tartle/completed?env=${env}`}
              className='flex items-center  whitespace-nowrap text-center justify-center py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              Page with completion script
            </a>
            <button
              onClick={() =>
                callTartleEndpoint(env, 'complete', token, setResult)
              }
              className='flex items-center  whitespace-nowrap text-center justify-center py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              Call completion endpoint
            </button>
            <button
              onClick={() =>
                callTartleEndpoint(env, 'screenout', token, setResult)
              }
              className='flex items-center  whitespace-nowrap text-center justify-center py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              Call screenout endpoint
            </button>
            <button
              onClick={() =>
                callTartleEndpoint(env, 'failed_quality', token, setResult)
              }
              className='flex items-center  whitespace-nowrap text-center justify-center py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              Call failed quality endpoint
            </button>
            <button
              onClick={() =>
                callTartleEndpoint(env, 'quota_full', token, setResult)
              }
              className='flex items-center  whitespace-nowrap text-center justify-center py-3 px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              Call quota full endpoint
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
