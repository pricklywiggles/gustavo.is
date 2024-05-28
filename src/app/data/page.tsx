import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      {/* <Script
        id='tartle-script'
        data-env='https://demo.tartle.co'
        src='https://demo.tartle.co/scripts/tartle-widget.js'
      /> */}
      <Script
        id='tartle-script'
        data-env='http://localhost:3000'
        src='http://localhost:3000/scripts/tartle-widget.js'
      />
      {/* <Script
        id="tartle-script"
        // data-env="http://localhost:3000"
        src="http://source.tartle.co/scripts/tartle-widget.js"
      /> */}
      <Script id='tartle-pubkey'>
        {`
          console.log("Setting up event listener")
          window.addEventListener('message', function (event) {
            console.log(event.data)
            if (event.data.type === 'tt-pubkey') {
              console.log('Public key:', event.data.payload.pubkey);
            }
            });
        `}
      </Script>
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className=''>
            {/* <div
              id='tartle-container'
              className='rounded-md overflow-hidden'
              data-packet-id='R1vaQ7Bebmx8N'
              data-referral-code='a4fc47faffd3cce77ea6df565fcbeaf6'
            /> */}
            <div
              id='tartle-container'
              className='rounded-md overflow-hidden'
              data-packet-id='oNpQVoKWjzXJN'
              data-referral-code='2d454d17021543451c2747d2b9fdcd7f'
            />
            {/* <div
              id="tartle-container"
              className="rounded-md overflow-hidden"
              data-packet-id="WY7aQd95N6xvd"
              data-referral-code="60c188d139d8555039bae931f49a0b59"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
