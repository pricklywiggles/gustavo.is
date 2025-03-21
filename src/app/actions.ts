'use server';
import { Settings } from '@/types/common';
import { get } from '@vercel/edge-config';
import { getFingerprint } from '@/utils/fingerprint';

export const updateSettings = async (
  previousState: { message: string },
  formData: FormData
) => {
  const settings: Settings = {
    client_id: formData.get('client_id') as string,
    client_secret: formData.get('client_secret') as string,
    packet_id: formData.get('packet_id') as string
  };

  const testAppUserId = await getFingerprint();

  let operation = 'update';

  try {
    const existingConfig = await get(testAppUserId);
    if (!existingConfig) {
      operation = 'create';
    }
  } catch (error) {
    console.error('Error getting existing config:', error);
  }

  try {
    const response = await fetch(
      `${process.env.VERCEL_API_URI}/${process.env.EDGE_CONFIG_ID}/items`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.VERCEL_API_KEY}`
        },
        body: JSON.stringify({
          items: [
            {
              operation,
              key: testAppUserId,
              value: settings
            }
          ]
        })
      }
    );

    if (!response.ok) {
      const error = await response.json();
      return {
        message: `Failed to update settings: ${
          error?.error?.message || 'Unknown error'
        }`
      };
    }

    Response.redirect(
      new URL('/tartle/oauth', process.env.NEXT_PUBLIC_APP_URL)
    );

    return { message: 'Settings updated successfully!' };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { message: 'An error occurred while updating settings' };
  }
};

export const getClientId = async () => {
  const testAppUserId = await getFingerprint();

  const config = (await get(testAppUserId)) as Settings;

  return config.client_id;
};
