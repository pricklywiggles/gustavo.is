import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';
import { getId } from '@/utils/fingerprint';
import { Settings } from '@/types/common';
import { setConfigValues } from '@/actions/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');
  const endpointUri = process.env.NEXT_PUBLIC_TARTLE_API_URI + '/oauth/token';

  const testAppUserId = await getId(request.headers);

  const config = (await get(testAppUserId, {
    consistentRead: true
  })) as Settings;

  const params = {
    code: authorizationCode,
    grant_type: 'authorization_code',
    code_verifier: config.code_verifier,
    client_secret: config.client_secret,
    client_id: config.client_id,
    redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
    state: 'boo'
  };

  const response = await fetch(endpointUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (!response.ok) {
    const errorData = await response.json();
    return NextResponse.json(
      { error: errorData.error_description || 'Failed to get token' },
      { status: 500 }
    );
  }

  if (response.ok) {
    let data;
    try {
      data = await response.json();
      setConfigValues({
        token: data.access_token,
        refresh_token: data.refresh_token
      });
    } catch (error) {
      console.error(error);
    }

    console.log({ data });

    if (data) {
      await wait(1000); // Wait for the edge config to be updated
      return NextResponse.redirect(new URL('/tartle/oauth/test', request.url));
    } else {
      return NextResponse.json({ error: 'No data' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: response.statusText }, { status: 500 });
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
