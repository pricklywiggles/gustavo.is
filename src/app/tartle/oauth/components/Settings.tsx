'use client';

import { updateSettings } from '@/actions/formActions';
import { useActionState } from 'react';
import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function Settings({
  setIsOpen,
  clientId: initialClientId
}: {
  setIsOpen: (isOpen: boolean) => void;
  clientId: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(updateSettings, {
    message: ''
  });
  const [reloadMessage, setReloadMessage] = React.useState(false);

  React.useEffect(() => {
    if (state.message === 'Settings updated successfully!') {
      setReloadMessage(true);
      setTimeout(() => {
        setIsOpen(false);
        window.location.replace(window.location.origin + '/tartle/oauth');
      }, 2000);
    }
  }, [state.message, setIsOpen, router]);

  return (
    <div className='absolute bg-blue-900 top-20 left-0 grid grid-cols-1 place-items-center'>
      <div className='border-2 p-4  rounded-xl  w-fit'>
        <div className='w-min mx-auto'>
          <div className='text-xs tracking-tight font-extrabold   sm:text-md md:text-lg lg:text-xl'>
            <form className='text-base flex flex-col gap-3' action={formAction}>
              {reloadMessage ? (
                <></>
              ) : (
                <>
                  <div>
                    <label htmlFor='client_id'>Client ID</label>
                    <input
                      className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
                      type='text'
                      id='client_id'
                      name='client_id'
                      defaultValue={initialClientId}
                    />
                  </div>

                  <div>
                    <label htmlFor='client_secret'>Client Secret</label>
                    <input
                      className='border-2 border-gray-300 rounded-md p-2 text-gray-600'
                      type='password'
                      id='client_secret'
                      name='client_secret'
                      placeholder='********'
                      data-1p-ignore
                      data-lpignore='true'
                      data-form-type='other'
                      data-pw-ignore
                    />
                  </div>
                </>
              )}

              {state.message ? (
                <div className='border-2 w-48 rounded-lg mt-2 text-gray-400 p-2 border-white'>
                  {state.message}
                  <div className='text-white-700'>
                    {reloadMessage ? 'Wait for reload...' : ''}
                  </div>
                </div>
              ) : null}

              <button
                className='bg-blue-500 mt-4 text-white p-2 rounded-md'
                type='submit'
              >
                Update Settings
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
