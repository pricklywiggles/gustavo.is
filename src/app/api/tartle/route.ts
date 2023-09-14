import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
}
