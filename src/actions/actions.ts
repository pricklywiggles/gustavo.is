'use server';
import { Settings } from '@/types/common';
import { neon } from '@neondatabase/serverless';
import { getId } from '@/utils/fingerprint';
import { generateCodeVerifier } from '@/utils/pkce';

const sql = neon(process.env.POSTGRES_URL!);

const resetQuery = `
      UPDATE user_settings
      SET
        client_id = '',
        packet_id = '',
        code_verifier = '',
        token = '',
        refresh_token = '',
        client_secret = '',
        updated_at = CURRENT_TIMESTAMP
      WHERE user_id = $1
      RETURNING *;
    `;

export const setConfigValues = async (settings: Partial<Settings>) => {
  const userId = await getId();

  if (Object.keys(settings).length === 0) {
    const result = (await sql(resetQuery, [userId])) as Settings[];
    return result[0];
  }

  if (settings.hasOwnProperty('client_id')) {
    const verifier = await generateCodeVerifier();
    settings['code_verifier'] = verifier;
  }

  const columns = Object.keys(settings);
  const values = Object.values(settings);
  const placeholders = values.map((_, i) => `$${i + 2}`).join(', ');
  const updates = columns.map((col, i) => `${col} = $${i + 2}`).join(', ');

  const query = `
    INSERT INTO user_settings (user_id, ${columns.join(', ')})
    VALUES ($1, ${placeholders})
    ON CONFLICT (user_id)
    DO UPDATE SET ${updates}, updated_at = CURRENT_TIMESTAMP
    RETURNING *;
  `;

  const result = (await sql(query, [userId, ...values])) as Settings[];
  return result[0];
};

export const getConfigValueFromClient = async (
  key: 'packet_id' | 'client_id' | 'code_verifier'
) => {
  const config = await getConfig();
  return config[key];
};

export const getConfig = async () => {
  const userId = await getId();
  const result = (await sql('SELECT * FROM user_settings WHERE user_id = $1', [
    userId
  ])) as Settings[];

  if (!result[0]) {
    return {
      client_id: '',
      packet_id: '',
      code_verifier: '',
      token: '',
      refresh_token: '',
      client_secret: ''
    };
  }

  return result[0];
};
