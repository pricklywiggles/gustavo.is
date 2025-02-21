import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const authorizationCode = searchParams.get('code');
  console.log({ authorizationCode });

  const endpointUri = process.env.TARTLE_API_URI + '/oauth/token';
  const params = {
    code: authorizationCode,
    grant_type: 'authorization_code',
    code_verifier:
      '141P2WU52o65kheE6tJzf2tI70Ib9uHn4Fp9_HtGa4vLfHKV2KCXOwDh4heqdZIJEizu5iTFyiDHxL_3FzYhdQ',
    client_secret: process.env.TARTLE_CLIENT_SECRET,
    client_id: process.env.TARTLE_CLIENT_ID,
    redirect_uri: process.env.TARTLE_REDIRECT_URI,
    state: 'boo'
  };

  const response = await fetch(endpointUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(params)
  });

  if (response.ok) {
    const data = await response.json();
    console.log({ data });

    return NextResponse.redirect(
      new URL('/tartle/oauth?token=' + data.access_token, request.url)
    );
  }

  return NextResponse.json({ error: response.statusText }, { status: 500 });
}
