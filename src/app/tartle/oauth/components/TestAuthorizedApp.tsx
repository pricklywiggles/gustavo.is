'use client';

import { jwtDecode } from 'jwt-decode';
import * as React from 'react';
import DataSync from './DataSync';
import { refreshTartleToken } from '@/actions/tartleActions';

type TokenPayload = {
  sub: string;
  aud: string;
  client_id: string;
  client_owner_id: string;
  jti: string;
  iat: number;
  exp: number;
};

const TestAuthorizedApp = ({
  token: initialToken,
  refreshToken: initialRefreshToken,
  initialPacketId
}: {
  token: string;
  refreshToken: string;
  initialPacketId: string;
}) => {
  console.log({ initialToken, initialRefreshToken, initialPacketId });
  const [token, setToken] = React.useState(initialToken);
  const [refreshToken, setRefreshToken] = React.useState(initialRefreshToken);
  const [error, setError] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const decodedToken = token ? jwtDecode<TokenPayload>(token) : null;

  const handleRefreshToken = async () => {
    setIsLoading(true);
    refreshTartleToken()
      .then(({ success, data }) => {
        if (success) {
          setToken(data.access_token);
          setRefreshToken(data.refresh_token);
          setError(null);
        } else {
          setError(data);
        }
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Unknown error');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className='flex flex-col gap-4'>
        <div>
          Token:{' '}
          <div className='mt-2 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-xl break-words'>
            <pre className='font-mono text-sm whitespace-pre-wrap'>
              {JSON.stringify(token, null, 2)}
            </pre>
          </div>
        </div>
        <div>
          Refresh Token:{' '}
          <div className='mt-2 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-xl break-words'>
            <pre className='font-mono text-sm whitespace-pre-wrap'>
              {refreshToken}
            </pre>
          </div>
          <button
            className='bg-blue-500 mt-4 text-white p-2 rounded-md w-full'
            onClick={handleRefreshToken}
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh Token'}
          </button>
          {error ? (
            <div className='mt-2 border-2 border-red-500 bg-black rounded-xl p-4 max-w-xl break-words'>
              <pre className='font-mono text-sm whitespace-pre-wrap'>
                {JSON.stringify(error, null, 2)}
              </pre>
            </div>
          ) : null}
        </div>

        <div>
          Decoded Token:{' '}
          <div className='mt-2 border-2 border-gray-500 bg-black rounded-xl p-4 max-w-xl break-words'>
            <pre className='font-mono text-sm whitespace-pre-wrap'>
              {JSON.stringify(decodedToken, null, 2)}
            </pre>
          </div>
        </div>
      </div>
      <DataSync token={token} initialPacketId={initialPacketId} />
    </>
  );
};

export default TestAuthorizedApp;
