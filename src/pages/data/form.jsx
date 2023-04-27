import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      <Script data-env="staging" src="https://demo.tartle.co/scripts/tartle-widget.js" />
      <Script id="tartle-pubkey">
        {`
          console.log("Setting up event listener")
          window.addEventListener('message', function (event) {
            console.log(event.data)
            if (event.data.action === 'tt-pubkey') {
              console.log('Public key:', event.data.pubkey);
            }
            });
        `}
      </Script>
      <div className="mt-28 w-screen">
        <div className="w-min mx-auto">
          <div className="">
            <div
              id="tartle-container"
              className="rounded-md overflow-hidden"
              data-packet-id="R1vaQ7Bebmx8N"
              data-referral-code="a4fc47faffd3cce77ea6df565fcbeaf6"
            />
          </div>
        </div>
      </div>
    </>
  );
}
