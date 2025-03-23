/* eslint-disable @next/next/no-sync-scripts */
import TestAuthorizedApp from '../components/TestAuthorizedApp';
import { getConfig } from '@/actions/actions';

export default async function Test() {
  const config = await getConfig();

  return (
    <TestAuthorizedApp
      token={config.token}
      refreshToken={config.refresh_token}
      initialPacketId={config.packet_id}
    />
  );
}
