import express from 'express';

import { logger } from '@/logger';
import { routingHandler } from '@/controllers/gateway.controller';
import { IProvider, IRoute } from '@/config/config.model';

export const initProvidersRouter = (providers: Map<string, IProvider>) => {
  const providersRouter = express.Router();
  providers.forEach((provider, name) => {
    provider.routes.forEach((route: IRoute) => {
      const providerRoute = `/${name}/${route.path}`;
      logger.info(
        {
          meta: {
            route: providerRoute,
            method: route.method,
          },
        },
        `new route mounted for provider ${name}`,
      );
      providersRouter.get(providerRoute, routingHandler);
      providersRouter.post(providerRoute, routingHandler);
    });
  });
  return providersRouter;
};
