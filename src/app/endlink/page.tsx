import Head from 'next/head';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      <Script src='https://demo.tartle.co/scripts/endlink-landing.js' />

      {/* <Script id='tartle-endpoint'>
        {`
          const urlParams = new URLSearchParams(window.location.search);
          const sellerId = urlParams.get('seller_id');
          const token = urlParams.get('token');
          console.log('Found data: ', {sellerId, token});
          localStorage.setItem('ENDLINK_TOKEN', token);
       `}
      </Script> */}
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className='text-4xl tracking-tight font-extrabold   sm:text-5xl md:text-6xl lg:text-7xl'>
            <div className='text-gray-800 dark:text-gray-200 mb-24'>
              DO YOU KNOW THE MUFFIN MAN?
            </div>
          </div>
          <div className='flex gap-6'>
            <Link
              href='/endlink/completed'
              className='flex items-center  whitespace-nowrap text- justify-center py-3 ml-auto px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              THE MUFFIN MAN!!??
            </Link>
            <Link
              href='/endlink/rejected'
              className='flex items-center justify-center py-3 ml-auto px-6 -mb-2 border border-transparent text-base shadow-md font-medium rounded-md text-white bg-lt-primary active:shadow-sm hover:bg-lt-primary-darker focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lt-primary-lighter'
            >
              No
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
