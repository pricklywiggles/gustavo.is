import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      {/* <Script
        id='tartle-script'
        data-env={currentEnv !== 'prod' ? domains[currentEnv] : undefined}
        src={`${domains[currentEnv]}/scripts/tartle-widget.js`}
      /> */}
      <Script id='tartle-endpoint'>
        {`
          const urlParams = new URLSearchParams(window.location.search);
          const sellerId = urlParams.get('seller_id');
          const token = urlParams.get('token');
          console.log('Found data: ', {sellerId, token});
          const endpointUrl = "https://demo.tartle.co/api/v3/endlinks/complete?token=" + token;
          fetch(endpointUrl).then((response) => console.log("Response: ", response)).catch((error) => console.error("Error: ", error));
        `}
      </Script>
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className=''></div>
        </div>
      </div>
    </>
  );
}
