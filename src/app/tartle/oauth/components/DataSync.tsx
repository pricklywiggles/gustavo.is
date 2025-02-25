'use client';

import { useState } from 'react';

type SellersPacketResponse = {
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
};

const DataSync = ({ token }: { token: string }) => {
  const [result, setResult] = useState<SellersPacketResponse | string>('');
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

    if (response.ok) {
      const responseData = await response.json();
      setResult(responseData);
    } else {
      setResult('An error occurred');
    }
  };

  return (
    <div className='mt-5 border-2 font-normal border-gray-300 rounded-xl p-4 max-w-md break-words'>
      Ready!, click the button to sync this data:
      <div className='mt-5 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-md break-words'>
        <pre className='font-mono text-sm whitespace-pre-wrap'>
          {JSON.stringify(data, null, 2)}
        </pre>
      </div>
      <button onClick={handleSync} className='dvc-button !mt-5 !px-2'>
        Sync Data
      </button>
    </div>
  );
};

export default DataSync;
