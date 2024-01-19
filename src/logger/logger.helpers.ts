import pino from 'pino';

import { ITrackingInfo } from '@/metrics/metrics.model';

export const serializeLogValue = (value: unknown) => {
  if (value instanceof Error) {
    return pino.stdSerializers.errWithCause(value);
  } else {
    return value;
  }
};
export const serializeLogObject = (obj: object) =>
  Object.entries(obj).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: serializeLogValue(value),
    };
  }, {});

export const getMetaLoggingInfoFrom = (trackingInfo: ITrackingInfo) => {
  return {
    method: trackingInfo.method,
    path: trackingInfo.path,
    providerName: trackingInfo.providerName,
    model: trackingInfo.model,
    username: trackingInfo.username,
    onBehalfOf: trackingInfo.onBehalfOf,
    statusCode: trackingInfo.statusCode,
  };
};
