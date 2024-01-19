import { IConfig } from '@/config/config.model';

export const validate = (config: IConfig) => {
  // TODO: more validation
  if (config.server && !config.server.appPort) {
    console.log(`No appPort value specified...`);
    process.exit(1);
  }
  if (config.server && !config.server.adminPort) {
    console.log(`No adminPort value specified...`);
    process.exit(1);
  }

  if (config.providers && config.providers.size === 0) {
    console.log(`No providers configured...`);
    process.exit(1);
  }

  if (config.providers) {
    config.providers.forEach(provider => {
      // TODO: accumulative validation and reporting at the end
      // TODO: validate URL, method, etc.
      if (!provider.name) {
        console.log(`Provider name not specified...`);
        process.exit(1);
      }
      if (!provider.baseUrl) {
        console.log(`Provider baseUrl not specified...`);
        process.exit(1);
      }
      if (!provider.routes || provider.routes.length === 0) {
        console.log(`Provider routes not specified...`);
        process.exit(1);
      }
      provider.routes.forEach(route => {
        if (!route.path) {
          console.log(`Provider route path not specified...`);
          process.exit(1);
        }
        if (!route.method) {
          console.log(`Provider route method not specified...`);
          process.exit(1);
        }
      });
    });
  }
};
