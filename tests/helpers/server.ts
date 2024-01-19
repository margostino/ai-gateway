import { adminServer, gatewayServer } from '../../src';

export const closeServer = (done: jest.DoneCallback) => {
  adminServer.close(() => {
    console.log('Admin server closed');
    gatewayServer.close(() => {
      console.log('Gateway server closed');
      jest.clearAllMocks();
      done();
    });
  });
};
