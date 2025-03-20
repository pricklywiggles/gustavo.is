'use client';

import { useState } from 'react';

type ApiError = {
  errors: Record<string, string[]>;
};

type SellersPacketResponse =
  | {
      message: string;
      sellers_packet: {
        account_id: number;
        status: string;
        updated_at: string;
        id: number;
        packet_id: number;
        created_at: string;
        beneficiary_account_id: null;
        autosell_setting: string;
        first_published_at: string;
      };
    }
  | ApiError;

const DataSync = ({ token }: { token: string }) => {
  const [result, setResult] = useState<[number, SellersPacketResponse] | null>(
    null
  );
  const data = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    address: '123 Main St, Anytown, USA',
    city: 'Anytown',
    state: 'CA',
    zip: '12345'
  };

  if (!token) return null;

  const handleSync = async () => {
    const response = await fetch('/api/tartle/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token, data })
    });

    let responseData: SellersPacketResponse;

    try {
      responseData = await response.json();
      setResult([response.status, responseData]);
    } catch {
      setResult([
        response.status,
        { errors: { base: ['Error parsing response'] } }
      ]);
    }
  };

  const isFailure = !result || result[0] >= 400;
  const isIdle = result === null;

  return (
    <div className='mt-5 border-2 font-normal border-gray-300 rounded-xl p-4 max-w-xl break-words'>
      {isIdle
        ? 'Ready!, click the button to sync this data'
        : isFailure
        ? '🚨 Sync Failed'
        : '🎉 Success! Sync result:'}
      <div className='mt-5 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-xl break-words'>
        <pre className='font-mono text-sm whitespace-pre-wrap'>
          {JSON.stringify(isIdle ? data : result, null, 2)}
        </pre>
      </div>
      <button
        onClick={handleSync}
        className='bg-blue-500 mt-4 text-white p-2 rounded-md w-full'
      >
        Sync Data
      </button>
    </div>
  );
};

export default DataSync;
