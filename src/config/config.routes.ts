import { IProviderFile, IRoute } from '@/config/config.model';

export const loadRoutes = (providers: Map<string, IProviderFile>) => {
  const routes: Map<string, string> = new Map();
  Object.values(providers).forEach(value => {
    value.routes.forEach((route: IRoute) => {
      const routeKey = `${route.method}:/${value.name}/${route.path}`;
      routes.set(routeKey, value.name);
    });
  });
  return routes;
};
