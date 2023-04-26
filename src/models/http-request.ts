import {
  HEADER_AND_BODY_SEPARATOR,
  CHARACTER_SET,
  HEADER_KEY_VALUE_SEPARATOR,
} from "../constants";
import { HTTPMethod, Headers, HttpRequest } from "./http";

function assertHttpMethod(method: string): asserts method is HTTPMethod {
  if (!["GET", "HEAD", "POST"].includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
}

function processPath(path: string): { route: string; rawQueries?: string } {
  const [route, rawQueries] = path.split("?");
  return { route, rawQueries };
}

function processHeaders(rawHeaders: string[]): Headers {
  return rawHeaders.reduce<Headers>((acc, header) => {
    const [headerName, headerValue] = header.split(HEADER_KEY_VALUE_SEPARATOR);
    return { ...acc, [headerName]: headerValue };
  }, {});
}

function getQueries(rawQueries?: string): Record<string, string> {
  if (!rawQueries) {
    return {};
  }

  return (
    rawQueries?.split("&").reduce<Record<string, string>>((acc, param) => {
      const [key, value] = param.split("=");
      return { ...acc, [key]: value };
    }, {}) ?? {}
  );
}

export const processRequest = (rawRequest: Buffer): HttpRequest => {
  const [request, body] = rawRequest
    .toString()
    .split(HEADER_AND_BODY_SEPARATOR);

  const [requestLine, ...rawHeaders] = request.split(CHARACTER_SET.CRLF);

  const [method, path, httpVersion] = requestLine.split(CHARACTER_SET.SP);

  const { route, rawQueries } = processPath(path);

  assertHttpMethod(method);

  const headers = processHeaders(rawHeaders);
  const queries = getQueries(rawQueries);

  return {
    method,
    route,
    httpVersion,
    headers,
    body,
    queries,
  };
};
