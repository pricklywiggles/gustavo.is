import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  //Grab the "p" url param
  const { searchParams } = new URL(request.url);
  const p = searchParams.get('p');

  if (p !== process.env.SLEEP_PASSWORD) {
    return NextResponse.json({ error: `Invalid token ${p}` }, { status: 401 });
  }

  try {
    const res = await fetch(`https://webhooks.whpl.sh/sleep`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WEBHOOKS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to sleep' }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: err }, { status: 500 });
  }

  return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
}
