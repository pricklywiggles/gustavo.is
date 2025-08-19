import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  //Grab the "p" url param
  const { searchParams } = new URL(request.url);
  const p = searchParams.get('p');

  if (p !== process.env.SLEEP_PASSWORD) {
    return NextResponse.json({ error: `Invalid token ${p}` }, { status: 401 });
  }

  fetch(`https://webhooks.whpl.sh/sleep`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.WEBHOOKS_TOKEN}`,
      'Content-Type': 'application/json'
    }
  })
    .then((res) => res.json())
    .then((data) => {
      return NextResponse.json(data, { status: 200 });
    })
    .catch((err) => {
      return NextResponse.json({ error: err.message }, { status: 500 });
    });

  return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
}
