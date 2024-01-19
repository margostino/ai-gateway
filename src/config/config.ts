import * as dotevnv from 'dotenv';

import { IConfig, IConfigFile } from '@/config/config.model';
import { SERVER_CONFIG_FILE_PATH } from '@/config/const';
import { exitIfUndefinedOrEmpty } from '@/utils/error';
import { parseTomlFile } from '@/utils/file';
import { loadProviders } from '@/config/config.providers';
import { loadRoutes } from '@/config/config.routes';
import { logger } from '@/logger';
import { validate } from '@/config/config.validation';

dotevnv.config();

export const loadConfig = () => {
  const configFilePath = SERVER_CONFIG_FILE_PATH;
  exitIfUndefinedOrEmpty('SERVER_CONFIG_FILE_PATH', configFilePath);
  const configFileData = parseTomlFile(configFilePath) as IConfigFile;
  const server = configFileData.server;
  const providers = loadProviders(configFileData.providers);
  const availableRoutes = loadRoutes(configFileData.providers);
  const config: IConfig = {
    server,
    providers,
    availableRoutes,
  };
  validate(config);

  const serializedConfig = {
    ...config,
    providers: Array.from(config.providers.entries()),
    availableRoutes: Array.from(config.availableRoutes.entries()),
  };
  logger.info(`Configuration loaded: ${JSON.stringify(serializedConfig)}`);

  return config;
};
