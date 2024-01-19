import { Express } from 'express';

import { initProvidersRouter } from '@/routes/provider.routes';
import { initAdminRouter } from '@/routes/admin.routes';
import { IConfig } from '@/config/config.model';

export const setRoutes = (
  gatewayApp: Express,
  adminApp: Express,
  config: IConfig,
) => {
  const adminRouter = initAdminRouter();
  const providersRouter = initProvidersRouter(config.providers);
  gatewayApp.use('/', providersRouter);
  adminApp.use('/', adminRouter);
};
