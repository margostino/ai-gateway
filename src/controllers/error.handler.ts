import { Response } from 'express';
import { HttpStatusCode } from 'axios';

import { PROVIDER_RESPONSE_TIME_HEADER } from '@/config/const';
import { copyHeader } from '@/utils/headers';

export const handleError = (error: any, res: Response) => {
  if (error.response && error.response.status) {
    copyHeader(PROVIDER_RESPONSE_TIME_HEADER, error.response, res);

    let output = '';
    if (error.response.data?.readable) {
      error.response.data
        .on('data', (chunk: Buffer) => (output += chunk.toString()))
        .on('error', (err: any) =>
          res
            .status(HttpStatusCode.InternalServerError)
            .json({ error: `stream failed: ${err.message}` }),
        )
        .on('end', () =>
          res.status(error.response.status).json(JSON.parse(output)),
        );
    } else if (error.response.data) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(error.response.status).json({ error: error.message });
    }
  } else {
    res
      .status(HttpStatusCode.InternalServerError)
      .json({ error: error.message });
  }
};
