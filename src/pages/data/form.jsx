import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      <Script id="tartle-iframe" src="/scripts/tartle-iframe.js" />
      <div className="mt-28 w-screen">
        <div className="w-min mx-auto">
          <div className="">
            <iframe
              class="rounded-md"
              src="https://source.tartle.co/frictionless/tartle?packet_id=djBaXmyYnqWMd&referral_code=4c20162cea7302d7537db9b2a48dc119"
              width="500px"
              id="tartle-iframe"
            />
          </div>
        </div>
      </div>
    </>
  );
}
