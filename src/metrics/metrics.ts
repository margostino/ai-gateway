import {Registry} from 'prom-client';
import {Request, Response} from 'express';

import {GATEWAY_REQUEST_START_TIME_HEADER, ON_BEHALF_OF_HEADER, PROVIDER_NAME_HEADER, PROVIDER_RESPONSE_TIME_HEADER, USERNAME_HEADER,} from '@/config/const';
import {getDurationMsFrom} from '@/utils/time';
import {ITrackingInfo} from '@/metrics/metrics.model';
import {getModelFromRequest} from '@/utils/http';
import {getRequestHeader, getResponseHeader} from "@/utils/headers";

export const metricRegister = new Registry();

export const getTrackingInfo = (req: Request, res: Response) => {
  // TODO: potentially logs can be enriched with more information provider specific (i.e. headers). For example ORG_ID for OpenAI
  const providerResponseTime = res.getHeader(
    PROVIDER_RESPONSE_TIME_HEADER,
  ) as number;
  const providerName = getResponseHeader(res, PROVIDER_NAME_HEADER);
  const username = getRequestHeader(req, USERNAME_HEADER);
  const onBehalfOf = getRequestHeader(req, ON_BEHALF_OF_HEADER);
  const model = getModelFromRequest(req)
  const gatewayResponseTime = getDurationMsFrom(
    res.req.headers[GATEWAY_REQUEST_START_TIME_HEADER]?.toString(),
  );

  const trackingInfo: ITrackingInfo = {
    method: req.method,
    path: req.path,
    username: username,
    onBehalfOf: onBehalfOf ? onBehalfOf : username,
    model: model,
    statusCode: res.statusCode.toString(),
    providerName: providerName,
    providerResponseTime: providerResponseTime,
    gatewayResponseTime: gatewayResponseTime,
  };

  return trackingInfo;
};
