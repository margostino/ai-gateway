import { Readable } from 'stream';

import axios from 'axios';

import RejectedValue = jest.RejectedValue;

const initAxiosInstance = () => {
  const axiosInstance: any = {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
  };
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  const mockedAxiosInstance = axios as jest.Mocked<typeof axiosInstance>;
  mockedAxios.create.mockReturnValue(mockedAxiosInstance);

  return mockedAxiosInstance;
};

export const mockSuccessfulGetResponse = () => {
  const mockedGetResponse: any = {
    headers: {
      'content-type': 'application/json', // TODO: text/event-stream
      'provider-response-time': 123, // TODO: this is sent because the interceptor is being mocked, ideally we should mock in a sense to include the real interceptor in the test
    },
    data: { message: 'mock.successful.response' },
    status: 200,
  };
  mockedAxiosInstance.get.mockResolvedValue(mockedGetResponse);
};

const mockSuccessfulPostResponse = () => {
  const data = JSON.stringify({
    message: 'mock.successful.response',
  });
  const mockedStream = new Readable();
  mockedStream.push(data);
  mockedStream.push(null);
  const mockedPostResponse: any = {
    headers: {
      'content-type': 'application/json',
      'provider-response-time': 123,
    },
    status: 200,
    data: mockedStream,
  };
  mockedStream.emit('data', Buffer.from(data));
  mockedStream.emit('end');
  mockedAxiosInstance.post.mockResolvedValue(mockedPostResponse);
};

const mockFailureResponse = (message: string, statusCode: number) => {
  const data = JSON.stringify({
    error: {
      message: message,
    },
  });
  const mockedStream = new Readable();
  mockedStream.push(data);
  mockedStream.push(null);
  const mockedPostResponse: any = {
    headers: {
      'content-type': 'application/json',
      'provider-response-time': 123,
    },
    response: {
      status: statusCode,
      data: mockedStream,
    },
  };
  mockedStream.emit('data', Buffer.from(data));
  mockedStream.emit('end');
  mockedAxiosInstance.post.mockRejectedValue(mockedPostResponse);
};

const mockFailureResponseWithNoData = () => {
  mockedAxiosInstance.post.mockRejectedValue({
    message: 'internal error from openai',
  } as RejectedValue<any>);
};

const mockedAxiosInstance = initAxiosInstance();
export {
  mockedAxiosInstance,
  mockFailureResponseWithNoData,
  mockFailureResponse,
  mockSuccessfulPostResponse,
};
