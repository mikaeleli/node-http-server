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

function processQueries(rawQueries?: string): Record<string, string> {
  if (!rawQueries) {
    return {};
  }

  return rawQueries.split("&").reduce<Record<string, string>>((acc, param) => {
    const [key, value] = param.split("=");
    return { ...acc, [key]: value };
  }, {});
}

function processCookies(rawCookies: string | undefined): Record<string, string> {
  if (!rawCookies) {
    return {};
  }

  const items = rawCookies.slice("Cookie: ".length).split(";");

  return items.reduce<Record<string, string>>((acc, cookie) => {
    const [cookieName, cookieValue] = cookie.trim().split("=");
    return { ...acc, [cookieName]: cookieValue };
  }, {});
}

export const processRequest = (rawRequest: Buffer): HttpRequest => {
  const [request, body] = rawRequest
    .toString()
    .split(HEADER_AND_BODY_SEPARATOR);

  const [requestLine, ...rawMetadata] = request.split(CHARACTER_SET.CRLF);

  const rawHeaders = rawMetadata.filter((line) => !line.startsWith("Cookie:"));
  const rawCookies: string | undefined = rawMetadata.filter((line) => line.startsWith("Cookie:"))[0];

  const [method, path, httpVersion] = requestLine.split(CHARACTER_SET.SP);

  assertHttpMethod(method);

  const { route, rawQueries } = processPath(path);
  const headers = processHeaders(rawHeaders);
  const queries = processQueries(rawQueries);
  const cookies = processCookies(rawCookies);

  return {
    method,
    route,
    httpVersion,
    headers,
    body,
    queries,
    cookies,
  };
};
