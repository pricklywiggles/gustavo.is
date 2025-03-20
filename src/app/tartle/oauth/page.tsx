/* eslint-disable @next/next/no-sync-scripts */
import DataSync from './components/DataSync';
import Toolbar from './components/Toolbar';
import DVCArea from './components/DVCArea';

async function Oauth({
  searchParams
}: {
  searchParams: Promise<{ token: string; refreshToken: string }>;
}) {
  const { token, refreshToken } = await searchParams;
  return (
    <>
      <Toolbar />
      <div className='mt-28 w-screen'>
        <div className='w-min mx-auto'>
          <div className='text-sm tracking-tight font-extrabold   sm:text-md md:text-lg lg:text-xl'>
            <DVCArea token={token} refreshToken={refreshToken} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Oauth;
