'use server';
import { Settings } from '@/types/common';
import { get } from '@vercel/edge-config';
import { getId } from '@/utils/fingerprint';

// Core function to update settings
export const setConfigValues = async (settings: Partial<Settings>) => {
  const testAppUserId = await getId();
  let existingConfig: Settings | undefined = undefined;
  let operation = 'create';

  try {
    existingConfig = (await get(testAppUserId, {
      consistentRead: true
    })) as Settings;
    if (existingConfig) {
      operation = 'update';
    }
  } catch (error) {
    console.error('Error getting existing config:', error);
  }

  const keys = Object.keys(settings);

  const mergedConfig =
    keys.length > 0
      ? Object.keys(settings).reduce<Settings>((acc, untypedKey) => {
          const key = untypedKey as keyof Settings;
          if (settings[key]) {
            acc[key] = settings[key] as string;
          }
          return acc;
        }, existingConfig || ({} as Settings))
      : {};

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
    throw new Error('Failed to update settings');
  }

  return mergedConfig;
};

// Used for getting config values from the client, prevents leaking sensitive config values
const allowedKeys = ['packet_id', 'client_id'] as const;
export const getConfigValueFromClient = async (
  key: (typeof allowedKeys)[number]
) => {
  if (!allowedKeys.includes(key)) {
    throw new Error('Invalid key');
  }
  let config: Settings | undefined;
  try {
    config = await getConfig();
  } catch (error) {
    return '';
  }

  return config?.[key] || '';
};

// Used in server functions to get the full config.
export const getConfig = async () => {
  const testAppUserId = await getId();
  const config = await get(testAppUserId, {
    consistentRead: true
  });

  if (!config) {
    throw new Error(`No config found for ${testAppUserId}`);
  }

  return config as Settings;
};
