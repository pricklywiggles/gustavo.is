import Script from 'next/script';
import React from 'react';

const origins = {
  production: 'https://source.tartle.co',
  development: 'http://localhost:3000',
  staging: 'https://staging.tartle.co',
  demo: 'https://demo.tartle.co'
};

const tartleData = {
  production: {
    packetId: 'R1vaQ7Bebmx8N',
    referralCode: 'a4fc47faffd3cce77ea6df565fcbeaf6'
  },
  development: {
    packetId: 'oNpQVoKWjzXJN',
    referralCode: '2d454d17021543451c2747d2b9fdcd7f'
  },
  staging: {
    packetId: 'zWlQNPBXd6JG6',
    referralCode: '3a8ec2aab8d5fb6105f5b1f88cd4eb7b'
  },
  demo: {
    packetId: 'zWlQNPBXd6JG6',
    referralCode: '3a8ec2aab8d5fb6105f5b1f88cd4eb7b'
  }
};

type Origin = keyof typeof origins;

export default async function DataForm({
  searchParams
}: {
  searchParams: { env: Origin };
}) {
  const envParam = await searchParams['env'];
  let env: Origin = Object.keys(origins).includes(envParam)
    ? envParam
    : 'production';
  console.log('envParam:', envParam, tartleData[env]);

  return (
    <>
      <Script
        id='tartle-script'
        data-env={origins[env]}
        src={`${origins[env]}/scripts/tartle-widget.js`}
      />
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
            <div
              id='tartle-container'
              className='rounded-md overflow-hidden'
              data-packet-id={tartleData[env].packetId}
              data-referral-code={tartleData[env].referralCode}
            />
          </div>
        </div>
      </div>
    </>
  );
}
