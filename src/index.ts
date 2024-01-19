import { IServer } from '@/config/config.model';
import { config, startAdminServer, startGatewayServer } from '@/app/app';

const init = (config: IServer) => {
  const gatewayServer = startGatewayServer(config.appPort);
  const adminServer = startAdminServer(config.adminPort);
  return [gatewayServer, adminServer];
};

/// Startup ///
export const [gatewayServer, adminServer] = init(config.server);
