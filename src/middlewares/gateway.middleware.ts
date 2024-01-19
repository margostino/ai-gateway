import { NextFunction, Request, Response } from 'express';

import { logger } from '@/logger';
import { gatewayRequestDurationMs } from '@/metrics/gateway.metrics';
import { providerRequestDurationMs } from '@/metrics/provider.metrics';
import { GATEWAY_REQUEST_START_TIME_HEADER } from '@/config/const';
import { getTrackingInfo } from '@/metrics/metrics';
import { getMetaLoggingInfoFrom } from '@/logger/logger.helpers';

const timeTracking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  delete req.headers['host'];
  delete req.headers['user-agent'];
  req.headers[GATEWAY_REQUEST_START_TIME_HEADER] = process.hrtime().toString();
  next();
};

const requestTracking = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.on('finish', () => {
    const trackingInfo = getTrackingInfo(req, res);
    const metaLoggingInfo = getMetaLoggingInfoFrom(trackingInfo);

    logger.info(
      {
        meta: metaLoggingInfo,
      },
      'gateway request',
    );

    if (trackingInfo.providerResponseTime) {
      providerRequestDurationMs
        .labels(
          trackingInfo.method,
          trackingInfo.path,
          trackingInfo.statusCode,
          trackingInfo.model,
          trackingInfo.providerName,
        )
        .observe(trackingInfo.providerResponseTime);
    }

    if (trackingInfo.gatewayResponseTime) {
      gatewayRequestDurationMs
        .labels(
          trackingInfo.method,
          trackingInfo.path,
          trackingInfo.statusCode,
          trackingInfo.model,
          trackingInfo.username,
          trackingInfo.providerName,
        )
        .observe(trackingInfo.gatewayResponseTime);
    }

    if (res.statusCode >= 400) {
      logger.error(
        {
          meta: metaLoggingInfo,
        },
        'gateway request failed',
      );
    }
  });
  next();
};

export { timeTracking, requestTracking };
