export interface ITrackingInfo {
  method: string;
  path: string;
  username: string;
  onBehalfOf: string;
  model: string;
  statusCode: string;
  providerName: string;
  providerResponseTime: number;
  gatewayResponseTime: number;
}
