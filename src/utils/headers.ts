import {AxiosResponse} from 'axios';
import {Request, Response} from 'express';
import {PROVIDER_NAME_HEADER} from "@/config/const";

export const getAxiosHeader = (response: AxiosResponse, name: string) => {
  return response?.headers?.[name];
};

export const getRequestHeader = (request: Request, name: string) => {
  return request.headers[name.toLowerCase()] as string;
}

export const getResponseHeader = (response: Response, name: string) => {
  return response.getHeader(name) as string
}

export const setAxiosHeader = (
  name: string,
  value: any,
  response: AxiosResponse,
) => {
  response.headers[name.toLowerCase()] = value;
};

export const copyHeader = (
  name: string,
  fromResponse: AxiosResponse,
  toResponse: Response,
) => {
  const value = getAxiosHeader(fromResponse, name.toLowerCase());
  if (value !== undefined) {
    toResponse.setHeader(name.toLowerCase(), value);
  }
};
