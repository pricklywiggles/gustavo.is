import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const POST = async (request: Request) => {
  const { token, data } = await request.json();

  const config = (await get(process.env.EDGE_CONFIG_OBJECT_KEY as string)) as {
    packet_id: string;
  };

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
  } catch (error) {
    console.error({ error });
  }

  console.log({ responseData });

  return NextResponse.json(responseData, {
    status: response.status,
    headers: response.headers
  });
};
