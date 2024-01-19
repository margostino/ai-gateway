import 'dotenv/config';

export const SERVER_CONFIG_FILE_PATH =
  (process.env.SERVER_CONFIG_FILE_PATH as string) ||
  '/home/ai-gateway/config.toml';
export const HTTPS_PROXY = process.env.HTTPS_PROXY;
export const PROVIDER_REQUEST_START_TIME_HEADER = 'Provider-Request-Start-Time';
export const PROVIDER_RESPONSE_TIME_HEADER = 'Provider-Response-Time';
export const CONTENT_TYPE_HEADER = 'Content-Type';
export const PROVIDER_NAME_HEADER = 'Provider-Name';
export const GATEWAY_REQUEST_START_TIME_HEADER = 'Gateway-Request-Start-Time';
export const ON_BEHALF_OF_HEADER = 'On-Behalf-Of';
export const USERNAME_HEADER = 'Username';
