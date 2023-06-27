import path from 'path';
import fs from 'fs';
import { NextResponse } from 'next/server';

export async function GET() {
  let filePath = path.resolve('.', 'public', 'sitemap.xml');
  const fileBuffer = fs.readFileSync(filePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'application/xml'
    }
  });
}
