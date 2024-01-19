import { NextFunction, Request, Response } from 'express';
import expressAsyncHandler from 'express-async-handler';

import { metricRegister } from '@/metrics/metrics';

export const metricsHandler = async (req: Request, res: Response) => {
  res.set('Content-Type', metricRegister.contentType);
  res.end(await metricRegister.metrics());
};

export const pingHandler = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send('pong');
  },
);
