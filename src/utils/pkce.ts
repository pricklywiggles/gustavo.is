const generateCodeVerifier = async (): Promise<string> => {
  const buffer = new Uint8Array(32);
  window.crypto.getRandomValues(buffer);
  return base64URLEncode(buffer);
};

export const generateCodeChallenge = async (
  codeVerifier: string
): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(digest));
};

const base64URLEncode = (buffer: Uint8Array): string => {
  return btoa(String.fromCharCode.apply(null, Array.from(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Usage:
export const generatePKCEPair = async () => {
  const codeVerifier = await generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);
  return { codeVerifier, codeChallenge };
};

export const verifyPKCEPair = async (
  codeVerifier: string,
  codeChallenge: string
) => {
  const generatedCodeChallenge = await generateCodeChallenge(codeVerifier);
  return generatedCodeChallenge === codeChallenge;
};
