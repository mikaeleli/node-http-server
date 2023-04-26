import { HEADER_AND_BODY_SEPARATOR, CHARACTER_SET, HEADER_KEY_VALUE_SEPARATOR } from "../constants";
import { HTTPMethod, Headers, HttpRequest } from "./http";

function assertHttpMethod(method: string): asserts method is HTTPMethod {
  if (!["GET", "HEAD", "POST"].includes(method.toUpperCase())) {
    throw new Error(`Invalid HTTP method: ${method}`);
  }
}

export const processRequest = (rawRequest: Buffer): HttpRequest => {
  const [request, body] = rawRequest
    .toString()
    .split(HEADER_AND_BODY_SEPARATOR);

  const [requestLine, ...rawHeaders] = request.split(CHARACTER_SET.CRLF);

  const [method, route, httpVersion] = requestLine.split(CHARACTER_SET.SP);

  assertHttpMethod(method);

  const headers = rawHeaders.reduce<Headers>((acc, header) => {
     const [headerName, headerValue] = header.split(HEADER_KEY_VALUE_SEPARATOR);
    return { ...acc, [headerName]: headerValue };
  }, {});

  return {
    method,
    route,
    httpVersion,
    headers,
    body,
  };
};
