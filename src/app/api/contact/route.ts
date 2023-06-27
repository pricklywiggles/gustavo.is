import { NextRequest, NextResponse } from 'next/server';
import * as postmark from 'postmark';

type ContactData = {
  name: string;
  email: string;
  message: string;
};

const isProduction = process.env.NODE_ENV === 'production';

let client: postmark.ServerClient;
if (isProduction)
  client = new postmark.ServerClient(process.env.POSTMARK_API_TOKEN || '');

export async function POST(req: NextRequest) {
  console.log({ isProduction });
  if (isProduction) {
    const data = req.json() as unknown as ContactData;
    const { name, email, message } = data;

    if (!isProduction) {
      return NextResponse.json({ message: 'Sent' }, { status: 200 });
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: 'Invalid Email' }, { status: 400 });
    } else {
      try {
        await client.sendEmail({
          From: process.env.POSTMARK_SENDER || '',
          To: process.env.POSTMARK_RECIPIENT,
          Subject: 'Gustavo.is CONTACT FORM',
          TextBody: `${name} (${email}): ${message}`,
          MessageStream: 'outbound'
        });

        return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
      } catch (error) {
        return NextResponse.json({ message: error }, { status: 400 });
      }
    }
  } else return NextResponse.json({ message: 'SUCCESS' }, { status: 200 });
}

const isValidEmail = (email: string) =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))[ ]*$/.test(
    email
  );
