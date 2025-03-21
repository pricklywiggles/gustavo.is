'use client';
import * as React from 'react';
import { CogIcon } from '@heroicons/react/24/outline';
import Settings from './Settings';

export default function Toolbar({
  clientId,
  packetId
}: {
  clientId: string;
  packetId: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className='relative flex justify-between m-4'>
      <button onClick={() => setIsOpen(!isOpen)}>
        <CogIcon className='w-6 h-6 text-gray-400' />
      </button>
      <button
        className='bg-blue-500 mt-4 text-white p-2 rounded-md'
        onClick={() => (window.location.href = '/tartle/oauth')}
      >
        Reset
      </button>
      {isOpen ? (
        <Settings
          setIsOpen={setIsOpen}
          clientId={clientId}
          packetId={packetId}
        />
      ) : null}
    </div>
  );
}
