import Toolbar from './components/Toolbar';
import { getConfig } from '@/actions/actions';

export const metadata = {
  title: 'Tartle Oauth Test App',
  description: 'Tartle Oauth Test App'
};

export default async function OauthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const config = await getConfig();

  return (
    <>
      <Toolbar clientId={config.client_id} />
      <div className='mt-28 w-full'>
        <div className='w-min mx-auto'>
          <div className='text-sm tracking-tight font-extrabold   sm:text-md md:text-lg lg:text-xl'>
            <div className='border-2 border-gray-300 rounded-xl p-4 max-w-xl break-words'>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
