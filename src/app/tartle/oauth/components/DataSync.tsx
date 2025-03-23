'use client';

import { syncTartleData } from '@/actions/formActions';
import { useState } from 'react';
import { useActionState } from 'react';

const DataSync = ({
  token,
  initialPacketId
}: {
  token: string;
  initialPacketId: string;
}) => {
  const [state, formAction] = useActionState(syncTartleData, {
    success: true,
    message: ''
  });
  const [packetId, setPacketId] = useState<string>(initialPacketId);

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

  const isIdle = state.message === '';

  return (
    <form
      className='grid grid-cols-1 gap-4 mt-5 border-2 font-normal border-gray-300 rounded-xl p-4 max-w-xl break-words'
      action={formAction}
    >
      {isIdle
        ? 'Ready!, click the button to sync this data'
        : state.success
        ? '🎉 Success! Sync result:'
        : '🚨 Sync Failed'}
      <div className='mt-5 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-xl break-words'>
        <pre className='font-mono text-sm whitespace-pre-wrap'>
          {JSON.stringify(isIdle ? data : state.message, null, 2)}
        </pre>
      </div>
      <input type='hidden' name='token' value={token} />
      <input type='hidden' name='data' value={JSON.stringify(data)} />
      <div className='flex flex-col gap-2'>
        <label htmlFor='packet_id'>Packet ID</label>
        <input
          className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
          type='text'
          id='packet_id'
          name='packet_id'
          value={packetId || ''}
          onChange={(e) => setPacketId(e.target.value)}
        />
      </div>
      <button
        type='submit'
        className='bg-blue-500 mt-4 text-white p-2 rounded-md w-full'
      >
        Sync Data
      </button>
    </form>
  );
};

export default DataSync;
