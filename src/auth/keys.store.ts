import { HASHED_API_KEYS } from '@/auth/auth.const';
import { logger } from '@/logger';

const loadApiKeys = () => {
  const decodedApiKeys = Buffer.from(HASHED_API_KEYS, 'base64').toString(
    'ascii',
  );
  // TODO: validate structure
  logger.info('API keys loaded');

  try {
    return JSON.parse(decodedApiKeys);
  } catch (error) {
    logger.error(`Error parsing API keys: ${error}`);
    process.exit(1);
  }
};

export { loadApiKeys };
