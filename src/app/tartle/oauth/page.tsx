/* eslint-disable @next/next/no-sync-scripts */
import DataSync from './components/DataSync';
import Toolbar from './components/Toolbar';
import DVCArea from './components/DVCArea';
import { getConfigValue } from '@/app/actions';

async function Oauth({
  searchParams
}: {
  searchParams: Promise<{ token: string; refreshToken: string }>;
}) {
  const { token, refreshToken } = await searchParams;
  const packetId = await getConfigValue('packet_id');
  const clientId = await getConfigValue('client_id');
  return (
    <>
      <Toolbar clientId={clientId} packetId={packetId} />
      <div className='mt-28 w-full'>
        <div className='w-min mx-auto'>
          <div className='text-sm tracking-tight font-extrabold   sm:text-md md:text-lg lg:text-xl'>
            <DVCArea
              token={token}
              refreshToken={refreshToken}
              initialPacketId={packetId}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Oauth;
