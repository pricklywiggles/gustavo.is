import Script from 'next/script';

const jsUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/scripts/tartle-iframe.js'
    : 'https://staging.tartle.co/scripts/tartle-iframe.js';

console.log('env', process.env.NODE_ENV);

export default function DataForm() {
  return (
    <>
      <Script
        id="tartle-iframe"
        data-env="development"
        src="https://staging.tartle.co/scripts/tartle-iframe.js"
      />
      <div className="mt-28 w-screen">
        <div className="w-min mx-auto">
          <div className="">
            <div
              id="tartle-container"
              className="rounded-md overflow-hidden"
              data-packet-id="oNpQVoKWjzXJN"
              data-referral-code="2d454d17021543451c2747d2b9fdcd7f"
            />
            {/* <iframe
              className="rounded-md"
              // src="https://staging.tartle.co/frictionless/embedded_packet?packet_id=R1vaQ7Bebmx8N&referral_code=a4fc47faffd3cce77ea6df565fcbeaf6"
              src="http://localhost:3000/frictionless/embedded_packet?packet_id=oNpQVoKWjzXJN&referral_code=2d454d17021543451c2747d2b9fdcd7f"
              // src="http://localhost:3000/frictionless/widget?packet_id=jVYa25pL4v1r3&referral_code=2d454d17021543451c2747d2b9fdcd7f"
              width="500px"
              id="tartle-iframe"
            /> */}
          </div>
        </div>
      </div>
    </>
  );
}
