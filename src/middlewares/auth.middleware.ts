import { NextFunction, Request, Response } from 'express';

import { hashApiKey } from '@/utils/auth';
import { apiKeysStore, config } from '@/app/app';
import { IApiKey, IScope } from '@/auth/auth.model';
import { extractScopeFromRequest } from '@/utils/http';

const auth = (req: Request, res: Response, next: NextFunction) => {
  let errorStatusCode, errorMessage;
  const headers = { ...req.headers };
  delete headers['host'];
  const apiKey = headers['authorization']?.split(' ')[1] as string;

  const [providerName, requestScope] = extractScopeFromRequest(req);
  const routeKey = `${requestScope.method}:/${providerName}${requestScope.path}`;

  if (config.availableRoutes.has(routeKey)) {
    const apiKeyInfo = getApiKeyInfo(apiKey);

    if (apiKeyInfo) {
      req.headers['username'] = apiKeyInfo.username;
    }

    const isAuthenticated = isValidApiKey(apiKeyInfo);
    const isAuthorized = isValidScope(apiKeyInfo?.scopes, req);

    if (!isAuthenticated || !isAuthorized) {
      errorStatusCode = !isAuthenticated ? 401 : 403;
      errorMessage = !isAuthenticated
        ? 'Invalid AI Gateway API key'
        : 'Invalid AI Gateway API scope';
    }
  } else {
    errorStatusCode = 404;
    errorMessage = 'Route not found';
  }

  if (errorStatusCode) {
    res.status(errorStatusCode).json({
      error: {
        message: errorMessage,
      },
    });
  }

  next();
};

const getApiKeyInfo = (apiKey: string | undefined): IApiKey | undefined => {
  if (apiKey) {
    const hashedApiKey = hashApiKey(apiKey);
    return apiKeysStore[hashedApiKey];
  }
};

const isValidApiKey = (apiKeyInfo: IApiKey | undefined): boolean => {
  return !!apiKeyInfo;
};

const isValidScope = (
  apiKeyInfo: IScope[] | undefined,
  req: Request,
): boolean => {
  const [providerName, requestScope] = extractScopeFromRequest(req);
  const fullRequestScope = `/${providerName}${requestScope.path}`;
  return (
    !!apiKeyInfo &&
    apiKeyInfo.some(
      scope =>
        scope.path === fullRequestScope && scope.method === requestScope.method,
    )
  );
};

export { auth };
