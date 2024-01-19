import axios from 'axios';
import { HttpsProxyAgent } from 'hpagent';

import { HTTPS_PROXY } from '@/config/const';
import {
  responseTimeTracking,
  startTimeTracking,
  trackProviderFailures,
} from '@/middlewares/provider.middleware';

const httpsAgent = HTTPS_PROXY
  ? new HttpsProxyAgent({
      keepAlive: true,
      keepAliveMsecs: 1000,
      maxSockets: 256,
      maxFreeSockets: 256,
      scheduling: 'lifo',
      proxy: HTTPS_PROXY,
    })
  : undefined;

// TODO: add circuit breaker, timeout, retry, etc.
export const createHttpClient = (baseUrl: string, apiKey: string) => {
  const httpClient = axios.create({
    baseURL: baseUrl,
    httpsAgent: httpsAgent,
    proxy: false,
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });
  httpClient.interceptors.request.use(startTimeTracking, trackProviderFailures);
  httpClient.interceptors.response.use(
    responseTimeTracking,
    trackProviderFailures,
  );
  return httpClient;
};
