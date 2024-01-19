import { AxiosInstance } from 'axios';

interface IRouteFile {
  method: HttpMethod;
  path: string;
}

interface IServerFile {
  appPort: number;
  adminPort: number;
}

interface IAuthFile {
  path: string;
  salt: string;
}

export interface IRoute {
  method: HttpMethod;
  path: string;
}

export interface IProvider {
  name: string;
  baseUrl: string;
  httpClient: AxiosInstance;
  routes: IRoute[];
}

export interface IServer {
  appPort: number;
  adminPort: number;
}

export interface IProviderFile {
  name: string;
  baseUrl: string;
  routes: IRouteFile[];
}

export interface IConfigFile {
  server: IServerFile;
  auth: IAuthFile;
  providers: Map<string, IProviderFile>;
}

export interface IConfig {
  server: IServer;
  providers: Map<string, IProvider>;
  availableRoutes: Map<string, string>;
}

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
}
