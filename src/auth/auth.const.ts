import 'dotenv/config';

export const STORED_HASHED_AUTH_SALT = process.env.HASH_AUTH_SALT as string;
export const HASHED_API_KEYS = process.env.HASHED_API_KEYS as string;
