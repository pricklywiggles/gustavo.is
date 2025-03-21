'use server';
import { Settings } from '@/types/common';
import { get } from '@vercel/edge-config';
import { getFingerprint } from '@/utils/fingerprint';

// Core function to update settings
export const setConfigValues = async (settings: Partial<Settings>) => {
  const testAppUserId = await getFingerprint();
  const existingConfig = (await get(testAppUserId, {
    consistentRead: true
  })) as Settings;

  const mergedConfig = Object.keys(settings).reduce<Settings>(
    (acc, untypedKey) => {
      const key = untypedKey as keyof Settings;
      if (
        settings[key] !== undefined &&
        settings[key] !== null &&
        settings[key] !== ''
      ) {
        acc[key] = settings[key] as string;
      }
      return acc;
    },
    existingConfig
  );

  let operation = 'update';

  try {
    const existingConfig = await get(testAppUserId);
    if (!existingConfig) {
      operation = 'create';
    }
  } catch (error) {
    console.error('Error getting existing config:', error);
  }

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
            value: mergedConfig
          }
        ]
      })
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      `Failed to update settings: ${error?.error?.message || 'Unknown error'}`
    );
  }

  return mergedConfig;
};

// Form action wrapper
export const updateSettings = async (
  previousState: { message: string },
  formData: FormData
) => {
  try {
    const settings: Settings = {
      client_id: formData.get('client_id') as string,
      client_secret: formData.get('client_secret') as string,
      packet_id: formData.get('packet_id') as string
    };

    await setConfigValues(settings);

    Response.redirect(
      new URL('/tartle/oauth', process.env.NEXT_PUBLIC_APP_URL)
    );

    return { message: 'Settings updated successfully!' };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { message: 'An error occurred while updating settings' };
  }
};

const allowedKeys = ['packet_id', 'client_id'] as const;
export const getConfigValue = async (key: (typeof allowedKeys)[number]) => {
  if (!allowedKeys.includes(key)) {
    throw new Error('Invalid key');
  }

  const testAppUserId = await getFingerprint();

  const config = (await get(testAppUserId, {
    consistentRead: true
  })) as Settings;

  return config[key];
};

export const syncTartleData = async (
  previousState: { message: string },
  formData: FormData
) => {
  try {
    const token = formData.get('token') as string;
    const data = JSON.parse(formData.get('data') as string);
    const packetId = formData.get('packet_id') as string;

    const testAppUserId = await getFingerprint();
    const config = await setConfigValues({ packet_id: packetId });

    const url = `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/api/v5/packets/${packetId}/sellers_packets/push`;
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    const body = {
      id: packetId,
      payload: data
    };

    console.log({ url, headers, body });

    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    });

    console.log({ response });
    const responseData = await response.json();
    console.log({ responseData });

    if (!response.ok) {
      return {
        success: false,
        message: responseData?.errors?.[0] || 'Failed to sync data'
      };
    }

    return { success: true, message: responseData };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Failed to sync datas'
    };
  }
};

export const refreshTartleToken = async (refreshToken: string) => {
  try {
    const testAppUserId = await getFingerprint();
    const config = (await get(testAppUserId, {
      consistentRead: true
    })) as Settings;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_TARTLE_API_URI}/oauth/token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: config.client_id,
          client_secret: config.client_secret,
          redirect_uri: process.env.NEXT_PUBLIC_TARTLE_REDIRECT_URI,
          refresh_token: refreshToken,
          grant_type: 'refresh_token'
        })
      }
    );

    const responseData = await response.json();

    return { success: response.ok, data: responseData };
  } catch (error) {
    return {
      success: false,
      data:
        error instanceof Error
          ? error.message
          : typeof error === 'string'
          ? error
          : 'Unknown error'
    };
  }
};
