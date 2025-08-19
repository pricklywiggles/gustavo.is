import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const p = searchParams.get('p');

  if (p !== process.env.SLEEP_PASSWORD) {
    return NextResponse.json({ error: `Invalid token ${p}` }, { status: 401 });
  }

  try {
    const res = await fetch(`https://webhooks.whpl.sh/sleep`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.WEBHOOKS_TOKEN}`
      }
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          error: `Failed to sleep status: ${res.status}`
        },
        { status: 500 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      {
        error: `Failed to sleep`
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
}
