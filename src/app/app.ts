import express from 'express';

import { setMiddlewares } from '@/middlewares/app.middleware';
import { setRoutes } from '@/routes/gateway.routes';
import { logger } from '@/logger';
import { loadConfig } from '@/config/config';
import { loadApiKeys } from '@/auth/keys.store';

const gatewayApp = express();
const adminApp = express();
const config = loadConfig();
const apiKeysStore = loadApiKeys();

setMiddlewares(gatewayApp);
setRoutes(gatewayApp, adminApp, config);

const startGatewayServer = (port: number) => {
  return gatewayApp.listen(port, () => {
    logger.info(`⚡️ Gateway server started and listening on port ${port}`);
  });
};

const startAdminServer = (port: number) => {
  return adminApp.listen(port, () => {
    logger.info(`⚡️ Admin server started and listening on port ${port}`);
  });
};

export { startGatewayServer, startAdminServer, config, apiKeysStore };
