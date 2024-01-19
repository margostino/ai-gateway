import request = require('supertest');

import { initRequestMocks } from '../helpers/mock.provider.apis';
import { gatewayServer } from '../../src';
import { closeServer } from '../helpers/server';

jest.mock('axios', () => {
  return {
    ...(jest.requireActual('axios') as object),
    create: jest.fn().mockReturnValue(jest.requireActual('axios')),
  };
});

describe('Gateway: Successful OpenAI endpoints', () => {
  beforeEach(() => {
    initRequestMocks();
  });

  it('response from GET /v1/models', async () => {
    await request(gatewayServer)
      .get('/openai/v1/models')
      .set('Authorization', 'Bearer fake')
      .expect(200)
      .expect(res =>
        expect(res.body).toEqual({ message: 'mock.successful.response' }),
      );
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
        expect(res.headers['provider-response-time']).toBeTruthy();
      });
  });

  it('response from POST /v1/embeddings', async () => {
    await request(gatewayServer)
      .post('/openai/v1/embeddings')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.model' })
      .expect(200)
      .expect(res => {
        expect(res.text).toEqual(
          JSON.stringify({ message: 'mock.successful.response' }),
        );
        expect(res.headers['provider-name']).toEqual('openai');
        expect(res.headers['provider-response-time']).toBeTruthy();
      });
  });

  it('response from POST /v1/images/generations', async () => {
    await request(gatewayServer)
      .post('/openai/v1/images/generations')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.model' })
      .expect(200)
      .expect(res => {
        expect(res.text).toEqual(
          JSON.stringify({ message: 'mock.successful.response' }),
        );
        expect(res.headers['provider-name']).toEqual('openai');
        expect(res.headers['provider-response-time']).toBeTruthy();
      });
  });

  afterAll(closeServer);
});

describe('Gateway: 400 OpenAI endpoints', () => {
  beforeEach(() => {
    initRequestMocks(400, 'mock.bad_request.response');
  });

  it('400 response from GET /v1/chat/completions', async () => {
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(400)
      .expect(res =>
        expect(res.body).toEqual({
          message: 'mock.bad_request.response',
        }),
      );
  });

  afterAll(closeServer);
});

describe('Gateway: 500 OpenAI endpoints', () => {
  beforeEach(() => {
    initRequestMocks(500, 'mock.internal_error.response');
  });

  it('500 response from GET /v1/chat/completions', async () => {
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(500)
      .expect(res =>
        expect(res.body).toEqual({
          message: 'mock.internal_error.response',
        }),
      );
  });

  it('500 response from Gateway because provider does not provide response data for error', async () => {
    await request(gatewayServer)
      .post('/openai/v1/chat/completions')
      .set('Authorization', 'Bearer fake')
      .send({ model: 'mock.valid.model' })
      .expect(500)
      .expect(res =>
        expect(res.body).toEqual({ message: 'mock.internal_error.response' }),
      );
  });

  afterAll(closeServer);
});
