import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { Settings } from '@/types/common';
import { getFingerprint } from '@/utils/fingerprint';

export const POST = async (request: Request) => {
  const { token, data } = await request.json();

  const testAppUserId = await getFingerprint(request);
  const config = (await get(testAppUserId)) as Settings;

  console.log({ config, token, data });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/api/v5/packets/${config.packet_id}/sellers_packets/push`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: config.packet_id,
        payload: data
      })
    }
  );

  console.log({ response });
  let responseData;
  try {
    responseData = await response.json();
    console.log({ responseData });

    return NextResponse.json(responseData, {
      status: response.status
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ error: 'Failed to sync data' }, { status: 500 });
  }
};
