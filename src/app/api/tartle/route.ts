import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');
  const endpointUri = process.env.NEXT_PUBLIC_TARTLE_API_URI + '/oauth/token';

  const config = (await get(process.env.EDGE_CONFIG_OBJECT_KEY as string)) as {
    client_id: string;
    client_secret: string;
  };

  const params = {
    code: authorizationCode,
    grant_type: 'authorization_code',
    code_verifier:
      '141P2WU52o65kheE6tJzf2tI70Ib9uHn4Fp9_HtGa4vLfHKV2KCXOwDh4heqdZIJEizu5iTFyiDHxL_3FzYhdQ',
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
    throw new Error(errorData.error_description || 'Failed to get token');
  }

  if (response.ok) {
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error(error);
    }

    if (data) {
      return NextResponse.redirect(
        new URL(
          '/tartle/oauth?token=' +
            data.access_token +
            '&refreshToken=' +
            data.refresh_token,
          request.url
        )
      );
    } else {
      return NextResponse.json({ error: 'No data' }, { status: 500 });
    }
  }

  return NextResponse.json({ error: response.statusText }, { status: 500 });
}
