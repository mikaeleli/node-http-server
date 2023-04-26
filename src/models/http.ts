import { Brand } from "../types";

// HTTP/1.0 status codes - https://datatracker.ietf.org/doc/html/rfc1945#section-6.1.1
export const statusCodeMap = {
  200: "OK",
  201: "Created",
  202: "Accepted",
  204: "No Content",
  301: "Moved Permanently",
  302: "Moved Temporarily",
  304: "Not Modified",
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  500: "Internal Server Error",
  501: "Not Implemented",
  502: "Bad Gateway",
  503: "Service Unavailable",
} as const;

export type StatusCode = keyof typeof statusCodeMap;

export type Headers = Record<string, string | number>;

// HTTP/1.0 methods - https://datatracker.ietf.org/doc/html/rfc1945#section-8
export type HTTPMethod = Brand<string, "get" | "head" | "post">;

export type HttpRequest = {
  method: HTTPMethod;
  route: string;
  httpVersion: string;
  headers: Headers;
  body?: string;
};
