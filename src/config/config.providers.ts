import { IProvider, IProviderFile } from '@/config/config.model';
import { exitIfUndefinedOrEmpty } from '@/utils/error';
import { createHttpClient } from '@/config/config.http';

const createProvider = (providerConfig: IProviderFile) => {
  const envVarName = `${providerConfig.name.toUpperCase()}_API_KEY`;
  const providerApiKey = process.env[envVarName];
  exitIfUndefinedOrEmpty(envVarName, providerApiKey);

  const provider: IProvider = {
    name: providerConfig.name,
    baseUrl: providerConfig.baseUrl,
    routes: providerConfig.routes,
    httpClient: createHttpClient(
      providerConfig.baseUrl,
      providerApiKey as string,
    ),
  };

  return provider;
};

export const loadProviders = (providersFile: Map<string, IProviderFile>) => {
  const providers: Map<string, IProvider> = new Map();
  Object.values(providersFile).forEach(value => {
    const provider = createProvider(value);
    providers.set(value.name, provider);
  });
  return providers;
};
