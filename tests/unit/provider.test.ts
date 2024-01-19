import request = require('supertest');

import {
  mockedAxiosInstance,
  mockFailureResponse,
  mockFailureResponseWithNoData,
  mockSuccessfulGetResponse,
  mockSuccessfulPostResponse,
} from '../helpers/mock.http.client';
import { gatewayServer } from '../../src';
import { closeServer } from '../helpers/server';

jest.mock('axios');

describe('Gateway: Successful OpenAI endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSuccessfulPostResponse();
    mockSuccessfulGetResponse();
  });

  it('response from GET /v1/models', async () => {
    await request(gatewayServer)
      .get('/openai/v1/models')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .expect(res =>
        expect(res.body).toEqual({ message: 'mock.successful.response' }),
      );
    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(1);
  });

  // TODO: test streaming properly (text/event-stream)
  it('response from POST /v1/chat/completions', async () => {
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .set('On-Behalf-Of', 'john.doe')
      .send({ model: 'mock.model' })
      .expect(200)
      .expect(res => {
        expect(res.text).toEqual(
          JSON.stringify({ message: 'mock.successful.response' }),
        );
        expect(res.headers['provider-name']).toEqual('openai');
        expect(res.headers['provider-response-time']).toEqual('123');
      });
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('response from POST /v1/embeddings', async () => {
    await request(gatewayServer)
      .post('/openai/v1/embeddings')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.model' })
      .expect(200)
      .expect(res =>
        expect(res.text).toEqual(
          JSON.stringify({ message: 'mock.successful.response' }),
        ),
      );
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('response from POST /v1/images/generations', async () => {
    await request(gatewayServer)
      .post('/openai/v1/images/generations')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.model' })
      .expect(200)
      .expect(res =>
        expect(res.text).toEqual(
          JSON.stringify({ message: 'mock.successful.response' }),
        ),
      );
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  afterAll(closeServer);
});

describe('Gateway: 4xx and 5xx OpenAI endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('400 response from GET /v1/chat/completions', async () => {
    mockFailureResponse('bad request error message', 400);
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(400)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'bad request error message',
          },
        }),
      );
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('500 response from GET /v1/chat/completions', async () => {
    mockFailureResponse('internal error from openai', 500);
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(500)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'internal error from openai',
          },
        }),
      );
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  it('500 response from Gateway because provider does not provide response data for error', async () => {
    mockFailureResponseWithNoData();
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(500)
      .expect(res =>
        expect(res.body).toEqual({ error: 'internal error from openai' }),
      );
    expect(mockedAxiosInstance.post).toHaveBeenCalledTimes(1);
  });

  afterAll(closeServer);
});
