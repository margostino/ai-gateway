import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

export const initRequestMocks = (
  status: number = 200,
  message: string = 'mock.successful.response',
) => {
  jest.clearAllMocks();
  const mock = new MockAdapter(axios);
  mock.onGet('/v1/models').reply(
    status,
    {
      message: message,
    },
    { 'content-type': 'application/json' },
  );
  mock.onPost('/v1/chat/completions').reply(
    status,
    {
      message: message,
    },
    { 'content-type': 'application/json' },
  );
  mock.onPost('/v1/embeddings').reply(
    status,
    {
      message: message,
    },
    { 'content-type': 'application/json' },
  );
  mock.onPost('/v1/images/generations').reply(
    status,
    {
      message: message,
    },
    { 'content-type': 'application/json' },
  );
};
