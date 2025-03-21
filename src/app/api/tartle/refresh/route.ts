import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { getFingerprint } from '@/utils/fingerprint';
import { Settings } from '@/types/common';

export const POST = async (request: Request) => {
  const { refresh_token } = await request.json();
  const testAppUserId = await getFingerprint(request);

  console.log({ testAppUserId });
  const config = (await get(testAppUserId)) as Settings;

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
      status: response.status
    });
  } catch (error) {
    console.error({ error });
    return NextResponse.json(
      { error: 'Failed to refresh token' },
      { status: 500 }
    );
  }
};
