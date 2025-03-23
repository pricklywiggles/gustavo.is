'use server';
import { getConfig, setConfigValues } from './actions';

// Push data to a tartle packet on behalf of a user
export const pushSellersPacket = async (
  token: string,
  data: any,
  packetId: string
) => {
  await setConfigValues({ packet_id: packetId });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/api/v5/packets/${packetId}/sellers_packets/push`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ id: packetId, payload: data })
    }
  );
  const responseData = isJson(response) ? await response.json() : null;

  console.log({ status: response.status, responseData });

  if (!response.ok) {
    throw new Error(responseData?.error || 'Failed to sync data');
  }

  return responseData;
};

// Use a refresh_token to get a new tartle access token.
export const refreshTartleToken = async () => {
  try {
    const config = await getConfig();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
          refresh_token: config.refresh_token,
          grant_type: 'refresh_token'
        })
      }
    );

    const responseData = await response.json();
    await setConfigValues({
      token: responseData.access_token,
      refresh_token: responseData.refresh_token
    });

    return { success: response.ok, data: responseData };
  } catch (error) {
    return {
      success: false,
      data: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

const isJson = (response: Response) =>
  response.headers.get('content-type')?.includes('application/json');
