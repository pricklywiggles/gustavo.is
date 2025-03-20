'use server';

import { Settings } from '@/app/tartle/oauth/settings/page';

export const updateSettings = async (
  previousState: { message: string },
  formData: FormData
) => {
  const settings: Settings = {
    client_id: formData.get('client_id') as string,
    client_secret: formData.get('client_secret') as string,
    packet_id: formData.get('packet_id') as string
  };

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
              operation: 'update',
              key: process.env.EDGE_CONFIG_OBJECT_KEY,
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
