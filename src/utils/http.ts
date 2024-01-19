import { Request } from 'express';

import { HttpMethod } from '@/config/config.model';
import { IScope } from '@/auth/auth.model';

export const extractScopeFromRequest = (req: Request): [string, IScope] => {
  const urlParts = req.url.split('/');
  const method = HttpMethod[req.method as keyof typeof HttpMethod];
  const providerName = urlParts[1];
  const path = '/' + urlParts.slice(2).join('/');
  const scope: IScope = {
    method: method,
    path: path,
  };
  return [providerName, scope];
};

export const getModelFromRequest = (req: Request): string => {
  let model: string;
  if (req.body.model) {
    model = req.body.model;
  } else if (req.method === HttpMethod.GET) {
    // TODO: Should extract model if GET models/{model} ?
    model = 'na';
  } else {
    model = 'unknown';
  }
  return model;
};

export const getModelFromData = (data: any): string => {
  let model: string;
  // check if object data is empty
  if (data) {
    model = data.model ? data.model : 'unknown';
  } else {
    model = 'na';
  }
  return model;
};
