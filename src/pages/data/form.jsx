import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      <Script
        id="tartle-iframe"
        data-env="staging"
        src="https://demo.tartle.co/scripts/tartle-widget.js"
      />
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
