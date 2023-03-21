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
              src="http://localhost:3000/frictionless/widget?packet_id=KQy7J9WzGNxV9&referral_code=2d454d17021543451c2747d2b9fdcd7f"
              width="500px"
              id="tartle-iframe"
            />
          </div>
        </div>
      </div>
    </>
  );
}
