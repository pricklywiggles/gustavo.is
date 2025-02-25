import { NextResponse } from 'next/server';

export const POST = async (request: Request) => {
  const { token, data } = await request.json();

  console.log({ token, data });

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/api/v5/packets/${process.env.NEXT_PUBLIC_TARTLE_PACKET_ID}/sellers_packets/push`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: process.env.NEXT_PUBLIC_TARTLE_PACKET_ID,
        payload: data
      })
    }
  );

  const responseData = await response.json();
  return NextResponse.json(responseData);
};
