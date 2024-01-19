import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import { auth } from '@/middlewares/auth.middleware';
import {
  requestTracking,
  timeTracking,
} from '@/middlewares/gateway.middleware';

export const setMiddlewares = (app: Express) => {
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(helmet());
  app.use(requestTracking);
  app.use(auth);
  app.use(timeTracking);
};
