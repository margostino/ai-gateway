import request = require('supertest');

import { mockedAxiosInstance } from '../helpers/mock.http.client';
import { gatewayServer } from '../../src/';
import { closeServer } from '../helpers/server';

jest.mock('axios');

describe('Gateway: access management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('401 because API key missing', async () => {
    await request(gatewayServer)
      .get('/openai/v1/models')
      .expect(401)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'Invalid AI Gateway API key',
          },
        }),
      );
    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(0);
  });

  it('401 because invalid API key', async () => {
    await request(gatewayServer)
      .get('/openai/v1/models')
      .set('Authorization', 'Bearer invalid-key')
      .expect(401)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'Invalid AI Gateway API key',
          },
        }),
      );
    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(0);
  });

  it('403 because invalid scope', async () => {
    await request(gatewayServer)
      .post('/openai/v1/fine_tuning/jobs')
      .set('Authorization', 'Bearer fake')
      .expect(403)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'Invalid AI Gateway API scope',
          },
        }),
      );
    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(0);
  });

  it('404 because route not found', async () => {
    await request(gatewayServer)
      .get('/openai/v1/invalid-path')
      .set('Authorization', 'Bearer fake')
      .expect(404)
      .expect(res =>
        expect(res.body).toEqual({
          error: {
            message: 'Route not found',
          },
        }),
      );
    expect(mockedAxiosInstance.get).toHaveBeenCalledTimes(0);
  });

  afterAll(closeServer);
});
