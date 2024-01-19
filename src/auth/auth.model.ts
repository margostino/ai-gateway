import { HttpMethod } from '@/config/config.model';

export interface IScope {
  method: HttpMethod;
  path: string;
}

export interface IApiKey {
  username: string;
  salt: string;
  scopes: IScope[];
}

export interface IApiKeys {
  [hash: string]: IApiKey;
}
