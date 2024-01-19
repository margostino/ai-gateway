import express from 'express';

import { pingHandler, metricsHandler } from '@/controllers/admin.controller';

export const initAdminRouter = () => {
  const adminRouter = express.Router();
  adminRouter.get('/ping', pingHandler);
  adminRouter.get('/metrics', metricsHandler);
  return adminRouter;
};
