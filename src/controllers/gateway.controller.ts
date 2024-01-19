import { NextFunction, Request, Response } from 'express';
import { AxiosResponse } from 'axios';

import { config } from '@/app/app';
import { extractScopeFromRequest } from '@/utils/http';
import { HttpMethod, IProvider } from '@/config/config.model';
import {
  CONTENT_TYPE_HEADER,
  PROVIDER_NAME_HEADER,
  PROVIDER_RESPONSE_TIME_HEADER,
} from '@/config/const';
import { handleError } from '@/controllers/error.handler';
import { copyHeader } from '@/utils/headers';

export const routingHandler = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // If Auth handler is not successful, it will return a response with error status code.
  // One option is to next(customError) and handle it in error handler or just skip this routing.
  if (res.statusCode != 200) {
    next();
    return;
  }
  const [name, scope] = extractScopeFromRequest(req);
  const provider = config.providers.get(name) as IProvider;
  const httpClient = provider.httpClient;
  const path = scope.path;

  res.setHeader(PROVIDER_NAME_HEADER, provider.name);

  try {
    const response: AxiosResponse = await (scope.method == HttpMethod.GET
      ? httpClient.get(path)
      : httpClient.post(path, req.body, {
          responseType: 'stream',
        }));

    // It is important to propagate the headers from the provider to the client because libraries and tools use Provider headers to make decisions (e.g. response deserialization).
    // TODO: Propagating all makes get model fail. See Chatbot-UI log for proper fix. This propagation is temporarily for SlackBot library compatibility.
    copyHeader(PROVIDER_RESPONSE_TIME_HEADER, response, res);
    copyHeader(CONTENT_TYPE_HEADER, response, res);

    if (response.data.readable) {
      response.data.pipe(res);
    } else {
      res.status(response.status).json(response.data);
    }
  } catch (error: any) {
    handleError(error, res);
  }
};
