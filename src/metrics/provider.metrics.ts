import { Summary } from 'prom-client';

import { metricRegister } from './metrics';

const providerRequestDurationMs = new Summary({
  name: 'provider_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'path', 'status_code', 'model', 'provider_name'],
  percentiles: [0.5, 0.75, 0.9, 0.95, 0.99],
});

metricRegister.registerMetric(providerRequestDurationMs);

export { providerRequestDurationMs };
