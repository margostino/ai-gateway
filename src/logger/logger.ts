import pino from 'pino';

import {
  LOG_LEVEL,
  LOG_PRETTY,
  MESSAGE_KEY,
  TIMESTAMP_KEY,
} from './logger.const';
import { serializeLogObject } from './logger.helpers';

export const logger = pino({
  level: LOG_LEVEL,
  messageKey: MESSAGE_KEY,
  errorKey: 'error',
  timestamp: () =>
    `,"${TIMESTAMP_KEY}":"${new Date(Date.now()).toISOString()}"`,
  formatters: {
    level: label => {
      return { level: label.toUpperCase() };
    },
    log: logObject => {
      const { meta, ...payload } = logObject;
      const serializedMeta =
        typeof meta === 'object' && meta !== null
          ? serializeLogObject(meta)
          : undefined;
      const serializePayload = Object.keys(payload).length
        ? serializeLogObject(payload)
        : undefined;
      return { meta: serializedMeta, payload: serializePayload };
    },
  },
  transport: LOG_PRETTY
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          colorizeObjects: true,
          messageKey: MESSAGE_KEY,
          timestampKey: TIMESTAMP_KEY,
        },
      }
    : undefined,
});
