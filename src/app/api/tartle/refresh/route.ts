import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const POST = async (request: Request) => {
  const { refresh_token } = await request.json();

  const config = (await get(process.env.EDGE_CONFIG_OBJECT_KEY as string)) as {
    client_id: string;
    client_secret: string;
  };

  const body = {
    client_id: config.client_id,
    client_secret: config.client_secret,
    redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
    refresh_token,
    grant_type: 'refresh_token'
  };

  console.log({ body });

  let response;
  try {
    response = await fetch(
      `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      }
    );
    const responseData = await response.json();
    console.log({ responseData });
    return NextResponse.json(responseData, {
      status: response.status,
      headers: response.headers
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
};
