/* eslint-disable @next/next/no-sync-scripts */
import Head from 'next/head';
import Script from 'next/script';

export default function Completed() {
  return (
    <>
      <Script src='https://demo.tartle.co/scripts/endlink-completion.js' />
      {/* <Script id='tartle-complete'>
        {`
          console.log("Running completion script")
          const ready = callback => {
            if (document.readyState !== 'loading') {
              callback();
            } else {
              document.addEventListener('DOMContentLoaded', callback);
            }
          };

          ready(function() {
            const token = localStorage.getItem('ENDLINK_TOKEN');
            if (!token) {
              console.error("No token found");
            } else {
              const endpointUrl = "https://source.tartle.co/api/v3/endlinks/complete?token=" + token;
              console.log("Endpoint: ", endpointUrl);
              fetch(endpointUrl).then((response) => console.log("Response: ", response)).catch((error) => console.error("Error: ", error));
            }
          })
        `}
      </Script> */}
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
