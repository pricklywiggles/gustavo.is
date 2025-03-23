import { NextResponse } from 'next/server';
import { getId } from '@/utils/fingerprint';
import { getConfig, setConfigValues } from '@/actions/actions';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');
  const endpointUri = process.env.NEXT_PUBLIC_TARTLE_API_URI + '/oauth/token';

  const testAppUserId = await getId(request.headers);

  const config = await getConfig();

  console.log({ config });

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
      await setConfigValues({
        token: data.access_token,
        refresh_token: data.refresh_token
      });
    } catch (error) {
      console.error(error);
    }

    console.log({ data });

    if (data) {
      return NextResponse.redirect(new URL('/tartle/oauth/test', request.url));
    } else {
      return NextResponse.json({ error: 'No data' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: response.statusText }, { status: 500 });
}
