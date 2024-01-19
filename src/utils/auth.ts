import crypto from 'crypto';

import { STORED_HASHED_AUTH_SALT } from '@/auth/auth.const';

export const hashApiKey = (apiKey: string): string => {
  const hmac = crypto.createHmac('sha256', STORED_HASHED_AUTH_SALT);
  hmac.update(apiKey);
  return hmac.digest('hex');
};
