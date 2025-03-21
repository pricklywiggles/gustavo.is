'use client';

import { updateSettings } from '@/app/actions';
import { useActionState } from 'react';
import * as React from 'react';
const authorizeUrl = `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/authorize`;

const SettingsForm = ({
  setIsOpen
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [state, formAction] = useActionState(updateSettings, {
    message: ''
  });

  React.useEffect(() => {
    if (state.message === 'Settings updated successfully!') {
      setTimeout(() => {
        setIsOpen(false);
        window.location.reload();
      }, 3000);
    }
  }, [state.message, setIsOpen]);

  return (
    <form className='text-base flex flex-col gap-3' action={formAction}>
      <div>
        <label htmlFor='client_id'>Client ID</label>
        <input
          className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
          type='text'
          id='client_id'
          name='client_id'
          required
        />
      </div>

      <div>
        <label htmlFor='client_secret'>Client Secret</label>
        <input
          className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
          type='text'
          id='client_secret'
          name='client_secret'
          required
        />
      </div>

      <div>
        <label htmlFor='packet_id'>Packet ID</label>
        <input
          className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
          type='text'
          id='packet_id'
          name='packet_id'
          required
        />
      </div>

      {state.message ? (
        <div className='border-2 rounded-lg mt-2 text-gray-400 p-2 border-white'>
          {state.message}
        </div>
      ) : null}

      <button
        className='bg-blue-500 mt-4 text-white p-2 rounded-md'
        type='submit'
      >
        Update Settings
      </button>
    </form>
  );
};

export default function Settings({
  setIsOpen
}: {
  setIsOpen: (isOpen: boolean) => void;
}) {
  return (
    <div className='absolute bg-blue-900 top-20 left-0 grid grid-cols-1 place-items-center'>
      <div className='border-2 p-4  rounded-xl  w-fit'>
        <div className='w-min mx-auto'>
          <div className='text-xs tracking-tight font-extrabold   sm:text-md md:text-lg lg:text-xl'>
            <SettingsForm setIsOpen={setIsOpen} />
          </div>
        </div>
      </div>
    </div>
  );
}
