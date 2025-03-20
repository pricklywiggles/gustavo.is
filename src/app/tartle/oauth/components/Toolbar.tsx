'use client';
import * as React from 'react';
import { CogIcon } from '@heroicons/react/24/outline';
import Settings from './Settings';

export default function Toolbar() {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className='relative'>
      <button onClick={() => setIsOpen(!isOpen)}>
        <CogIcon className='m-2 w-6 h-6 text-gray-400' />
      </button>
      {isOpen ? <Settings setIsOpen={setIsOpen} /> : null}
    </div>
  );
}
