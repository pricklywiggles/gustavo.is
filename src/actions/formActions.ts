'use server';

import { setConfigValues } from './actions';
import { Settings } from '../types/common';
import { pushSellersPacket } from './tartleActions';

// Settings.tsx Form Action
export const updateSettings = async (
  previousState: { message: string },
  formData: FormData
) => {
  try {
    const settings: Partial<Settings> = {
      client_id: formData.get('client_id') as string,
      client_secret: formData.get('client_secret') as string
    };

    await setConfigValues(settings);

    return { message: 'Settings updated successfully!' };
  } catch (error) {
    console.error('Error updating settings:', error);
    return { message: 'An error occurred while updating settings' };
  }
};

// DataSync.tsx Form Action
export const syncTartleData = async (
  previousState: { message: string },
  formData: FormData
) => {
  try {
    const token = formData.get('token') as string;
    const data = JSON.parse(formData.get('data') as string);
    const packetId = formData.get('packet_id') as string;

    const responseData = await pushSellersPacket(token, data, packetId);

    return { success: true, message: responseData };
  } catch (error) {
    console.error({ error });
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to sync data'
    };
  }
};
