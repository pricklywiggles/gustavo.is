// We use fingerprint as keys for the edge config to save oauth client credentials
import { headers as getHeaders } from 'next/headers';

export interface Fingerprint {
  userAgent: string | null;
  acceptLanguage: string | null;
  acceptEncoding: string | null;
  ipAddress: string | null;
  connectionInfo: {
    protocol: string;
    host: string | null;
    connection: string | null;
  };
  forwardedFor: string | null;
  realIP: string | null;
}

export const getId = async (headers?: Headers): Promise<string> => {
  const headersList = headers || (await getHeaders());

  // Get IP from various headers
  const ipAddress =
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    headersList.get('x-client-ip') ||
    '0.0.0.0';

  const host = headersList.get('host');
  const protocol =
    headersList.get('x-forwarded-protocol') ||
    headersList.get('x-forwarded-proto') ||
    'https';

  const fingerprint: Fingerprint = {
    userAgent: headersList.get('user-agent'),
    acceptLanguage: headersList.get('accept-language'),
    acceptEncoding: headersList.get('accept-encoding'),
    ipAddress,
    connectionInfo: {
      protocol,
      host,
      connection: headersList.get('connection')
    },
    forwardedFor: headersList.get('x-forwarded-for'),
    realIP: headersList.get('x-real-ip')
  };

  const hash = await createHash(fingerprint);

  return hash;
};

const createHash = async (data: object): Promise<string> => {
  const msgUint8 = new TextEncoder().encode(JSON.stringify(data));
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
};
