/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import Script from 'next/script';

const origins = {
  production: 'https://source.tartle.co',
  development: 'http://localhost:3001',
  staging: 'https://staging.tartle.co'
};

export default function Completed({
  searchParams
}: {
  searchParams: { env: 'production' | 'staging' | 'development' };
}) {
  const envParam = searchParams['env'];
  let env: 'production' | 'staging' | 'development' = 'production';
  if (envParam === 'staging' || envParam === 'development') {
    env = envParam;
  }

  return (
    <>
      <Script src={`${origins[env]}/scripts/endlink-completion.js`} />
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
