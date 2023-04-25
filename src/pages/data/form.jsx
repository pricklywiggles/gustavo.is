import Script from 'next/script';

export default function DataForm() {
  return (
    <>
      <Script data-env="development" src="http://localhost:3000/scripts/tartle-widget.js" />
      <div className="mt-28 w-screen">
        <div className="w-min mx-auto">
          <div className="">
            <div
              id="tartle-container"
              className="rounded-md overflow-hidden"
              data-packet-id="jVYa25pL4v1r3"
              data-referral-code="2d454d17021543451c2747d2b9fdcd7f"
            />
          </div>
        </div>
      </div>
    </>
  );
}
