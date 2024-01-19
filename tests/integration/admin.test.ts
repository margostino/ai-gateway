import request = require('supertest');

import { adminServer } from '../../src';
import { closeServer } from '../helpers/server';

describe('Gateway: Successful Admin endpoints', () => {
  it('GET /ping response with pong', async () => {
    await request(adminServer)
      .get('/ping')
      .expect(200)
      .expect(res => expect(res.text).toBe('pong'));
  });

  it('GET /metrics response with metrics', async () => {
    await request(adminServer)
      .get('/metrics')
      .expect(200)
      .expect(res => {
        expect(res.text).toContain('gateway_request_duration_ms');
        expect(res.text).toContain('provider_request_duration_ms');
      });
  });

  afterAll(closeServer);
});
