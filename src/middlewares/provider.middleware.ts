import { AxiosError } from 'axios';

import { getDurationMsFrom } from '@/utils/time';
import {
  PROVIDER_REQUEST_START_TIME_HEADER,
  PROVIDER_RESPONSE_TIME_HEADER,
} from '@/config/const';
import { setAxiosHeader } from '@/utils/headers';

export const startTimeTracking = (config: any) => {
  config.headers[PROVIDER_REQUEST_START_TIME_HEADER] = process
    .hrtime()
    .toString();
  return config;
};

export const responseTimeTracking = (res: any) => {
  const requestStartTimeString =
    res.config.headers[PROVIDER_REQUEST_START_TIME_HEADER];
  const durationMsFrom = getDurationMsFrom(requestStartTimeString);
  setAxiosHeader(PROVIDER_RESPONSE_TIME_HEADER, durationMsFrom, res);
  return res;
};

export const trackProviderFailures = (error: AxiosError) => {
  const requestStartTimeString =
    error.config?.headers[PROVIDER_REQUEST_START_TIME_HEADER];
  if (error.response) {
    const durationMsFrom = getDurationMsFrom(requestStartTimeString);
    setAxiosHeader(
      PROVIDER_RESPONSE_TIME_HEADER,
      durationMsFrom,
      error.response,
    );
  }
  return Promise.reject(error);
};
