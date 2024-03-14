import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      {/* <Script
        id='tartle-script'
        src='http://localhost:3000/scripts/endlink-landing.js'
      /> */}
      <Script id='tartle-endpoint'>
        {`
          const token = localStorage.getItem('ENDLINK_TOKEN');
          if (!token) {
            console.error("No token found");
          } else {
            const endpointUrl = "https://source.tartle.co/api/v3/endlinks/complete?token=" + token;
            fetch(endpointUrl).then((response) => console.log("Response: ", response)).catch((error) => console.error("Error: ", error));
          }
        `}
      </Script>
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
