import { Summary } from 'prom-client';

import { metricRegister } from './metrics';

const gatewayRequestDurationMs = new Summary({
  name: 'gateway_request_duration_ms',
  help: 'Duration of HTTP gateway requests in ms',
  labelNames: [
    'method',
    'path',
    'status_code',
    'model',
    'username',
    'provider_name',
  ],
  percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
});

metricRegister.registerMetric(gatewayRequestDurationMs);

export { gatewayRequestDurationMs };
