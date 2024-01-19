import 'dotenv/config';

export const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';
export const LOG_PRETTY =
  process.env.LOG_PRETTY === 'true' || process.env.LOG_PRETTY === '1';

export const MESSAGE_KEY = 'message';
export const TIMESTAMP_KEY = 'timestamp';
