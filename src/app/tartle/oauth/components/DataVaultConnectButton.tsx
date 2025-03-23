const DataVaultConnectButton = ({
  clientId,
  codeChallenge
}: {
  clientId: string;
  codeChallenge: string;
}) => (
  <a
    className='dvc-button'
    href={new URL(
      `/oauth/authorize?${new URLSearchParams({
        client_id: clientId,
        response_type: 'code',
        redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI as string,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256',
        scope: 'write'
      })}`,
      process.env.NEXT_PUBLIC_TARTLE_API_URI
    ).toString()}
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
);

export default DataVaultConnectButton;
