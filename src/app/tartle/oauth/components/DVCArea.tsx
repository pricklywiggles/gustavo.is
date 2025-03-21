'use client';

import { jwtDecode } from 'jwt-decode';
import * as React from 'react';
import DataSync from './DataSync';

type TokenPayload = {
  sub: string;
  aud: string;
  client_id: string;
  client_owner_id: string;
  jti: string;
  iat: number;
  exp: number;
};

const authorizeUrl = `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/authorize`;
const buildParams = (clientId: string): Record<string, string> => ({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI as string,
  code_challenge: 'TobtCP4Evcwv9CPcOFzdeCdTuyezQb6nqQjOjXQwNUo',
  code_challenge_method: 'S256',
  scope: 'write'
});

const ClientIdLoader = ({
  children
}: {
  children: (clientId: string | null) => React.ReactNode;
}) => {
  const [result, setResult] = React.useState<string | null>(null);
  React.useEffect(() => {
    fetchWelcomeData(setResult);
  }, []);

  return children(result);
};

const DVCArea = ({
  token: initialToken,
  refreshToken: initialRefreshToken
}: {
  token: string;
  refreshToken: string;
}) => {
  const [token, setToken] = React.useState(initialToken);
  const [refreshToken, setRefreshToken] = React.useState(initialRefreshToken);
  const [error, setError] = React.useState<string | null>(null);

  const decodedToken = token ? jwtDecode<TokenPayload>(token) : null;

  const handleRefreshToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
    getRefreshedToken(
      refreshToken,
      (token, refreshToken) => {
        setToken(token);
        setRefreshToken(refreshToken);
        setError(null);
      },
      setError
    );
  };

  console.log({ token, refreshToken });

  return (
    <div className='border-2 border-gray-300 rounded-xl p-4 max-w-xl break-words'>
      {token ? (
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
              >
                Refresh Token
              </button>
              {error ? (
                <div className='mt-2 border-2 border-red-500 bg-black rounded-xl p-4 max-w-xl break-words'>
                  <pre className='font-mono text-sm whitespace-pre-wrap'>
                    {error}
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
          <DataSync token={token} />
        </>
      ) : (
        <ClientIdLoader>
          {(clientId: string | null) => (
            <div className='flex gap-10'>
              <span className='whitespace-nowrap content-center justify-center font-bold'>
                TEST ME&nbsp;&nbsp;&nbsp;&nbsp;👉
              </span>
              {clientId ? (
                <a
                  className='dvc-button'
                  href={`${authorizeUrl}?${new URLSearchParams(
                    buildParams(clientId)
                  ).toString()}`}
                >
                  <div className='logo-container'>
                    <svg
                      viewBox='0 0 35 40'
                      fill='none'
                      className='logo-cube'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <defs id='defs1' />
                      <path
                        d='M 17.162176,39.288721 34.3247,29.6706 34.2922,9.87187 17.1292,0 0,9.9281 0.032495,29.7268 17.162176,39.288721 17.204142,35.299053 3.77803,27.556 3.75303,12.0864 17.1367,4.33042 l 13.41,7.71228 0.025,15.4695 -13.367558,7.786853 z'
                        fill='currentColor'
                        id='path1'
                      />
                      <g id='layer1'>
                        <path
                          d='M 30.5467,12.0427 17.1367,4.33042 3.75303,12.0864 17.16235,19.64436 Z'
                          fill='currentColor'
                          id='path1-8'
                          style={{ fill: '#7c7c7c', fillOpacity: 1 }}
                        />
                      </g>
                      <g id='layer2'>
                        <path
                          d='M 17.204142,35.299053 17.16235,19.64436 3.75303,12.0864 3.77803,27.556 Z'
                          fill='currentColor'
                          id='path1-8-5'
                          style={{ fill: '#c8c8c8', fillOpacity: 1 }}
                        />
                      </g>
                      <g id='layer3'>
                        <path
                          d='M 17.204142,35.299053 17.149865,19.62251 30.5467,12.0427 l 0.025,15.4695 z'
                          fill='currentColor'
                          id='path1-8-5-9'
                          style={{ fill: '#ffffff', fillOpacity: 1 }}
                        />
                      </g>
                    </svg>

                    <svg
                      className='tartle-logo'
                      viewBox='0 0 35 40'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <path
                        d='M17.9966 39.1338L34.3247 29.6706L34.2922 9.87187L17.1292 0L0 9.9281L0.032495 29.7268L13.0075 37.1904L16.8555 39.4037V20.5498H25.8913V16.4419H4.58537V20.5498H13.0075V32.865L3.77803 27.556L3.75303 12.0864L17.1367 4.33042L30.5467 12.0427L30.5717 27.5122L17.9966 34.8008V39.1338Z'
                        fill='currentColor'
                      />
                    </svg>
                  </div>
                  <span>DataVault Connect</span>
                </a>
              ) : (
                <span>Loading...</span>
              )}
            </div>
          )}
        </ClientIdLoader>
      )}
    </div>
  );
};

const fetchWelcomeData = async (
  setResult: (clientId: string | null) => void
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/client_id`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch welcome data');
    }

    const data = await response.json();
    setResult(data);
  } catch (err) {
    setResult(null);
  }
};

const getRefreshedToken = async (
  refreshToken: string,
  onSuccess: (token: string, refreshToken: string) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/tartle/refresh`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refresh_token: refreshToken })
      }
    );

    const data = await response.json();

    if (response.ok) {
      onSuccess(data.access_token, data.refresh_token);
    } else {
      onError(data.error_description);
    }
  } catch (err) {
    onError(err instanceof Error ? err.message : 'An error occurred');
    console.error(err);
  }
};

export default DVCArea;
