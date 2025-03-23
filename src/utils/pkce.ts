import crypto from 'crypto';

export const generateCodeVerifier = async (): Promise<string> => {
  const buffer = crypto.randomBytes(32);
  return base64URLEncode(buffer);
};

export const generateCodeChallenge = async (
  codeVerifier: string
): Promise<string> => {
  if (!codeVerifier) {
    return '';
  }
  const hash = crypto.createHash('sha256');
  hash.update(codeVerifier);
  return base64URLEncode(hash.digest());
};

const base64URLEncode = (buffer: Buffer | Uint8Array): string => {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

export const verifyPKCEPair = async (
  codeVerifier: string,
  codeChallenge: string
) => {
  const generatedCodeChallenge = await generateCodeChallenge(codeVerifier);
  return generatedCodeChallenge === codeChallenge;
};
