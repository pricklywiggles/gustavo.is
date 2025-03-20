import { NextResponse } from 'next/server';
import { get } from '@vercel/edge-config';

export const config = { matcher: '/client_id' };

export async function middleware() {
  const config = (await get(process.env.EDGE_CONFIG_OBJECT_KEY as string)) as {
    client_id: string;
    client_secret: string;
    packet_id: string;
  };

  return NextResponse.json(config.client_id);
}
