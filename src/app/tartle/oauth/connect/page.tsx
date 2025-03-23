/* eslint-disable @next/next/no-sync-scripts */
import { getConfig } from '@/actions/actions';
import DataVaultConnectButton from '../components/DataVaultConnectButton';
import { generateCodeChallenge } from '@/utils/pkce';

export default async function Connect() {
  const config = await getConfig();

  const codeChallenge = await generateCodeChallenge(config.code_verifier);

  return (
    <div className='flex gap-10'>
      {config.client_id ? (
        <>
          <span className='whitespace-nowrap content-center justify-center font-bold'>
            TEST ME&nbsp;&nbsp;&nbsp;&nbsp;👉
          </span>
          <DataVaultConnectButton
            clientId={config.client_id}
            codeChallenge={codeChallenge}
          />
        </>
      ) : (
        <div className='w-fit whitespace-nowrap'>
          Click the cog to set your client values
        </div>
      )}
    </div>
  );
}
