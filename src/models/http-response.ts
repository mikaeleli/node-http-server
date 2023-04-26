import { CHARACTER_SET, HEADER_KEY_VALUE_SEPARATOR } from "../constants";
import { HTTPMethod, Headers, HttpRequest, StatusCode, statusCodeMap } from "./http";

const isBodyAllowedInResponse = (statusCode: StatusCode, method: HTTPMethod): boolean => {
  // response body is not allowed for HEAD requests
  const isHeadRequest = method.toUpperCase() === "HEAD";
  // response body is not allowed for 1xx, 204, and 304
  const isAllowedStatus = statusCode > 199 && statusCode !== 204 && statusCode !== 304;
  // see more: https://datatracker.ietf.org/doc/html/rfc1945#section-7.2
  return !isHeadRequest && isAllowedStatus;
};

const getFixedHeaders = (): Headers => {
  return {
    Date: new Date().toUTCString(),
  };
};

const createResponseHeaders = (
  headers: Headers,
  contentLength: number | null
) => {
  const fixedHeaders = getFixedHeaders();

  const responseHeaders: Headers = {
    ...headers,
    ...fixedHeaders,
  };

  if (contentLength) responseHeaders["Content-Length"] = contentLength;

  return responseHeaders;
};

export type CreateResponse = {
  requestMethod: HTTPMethod;
  statusCode: StatusCode;
  httpVersion: string;
  headers: Headers;
  body?: string | Buffer;
};

export const createResponse = (options: CreateResponse): Buffer => {
  const { statusCode, httpVersion, headers, body, requestMethod } = options;

  const frames: Array<string> = [];

  const statusLine = [httpVersion, statusCode, statusCodeMap[statusCode]].join(
    CHARACTER_SET.SP
  );

  frames.push(statusLine);

  const shouldProcessBody =
    body !== undefined && isBodyAllowedInResponse(statusCode, requestMethod);

  const responseHeaders: Headers = createResponseHeaders(
    headers,
    shouldProcessBody ? Buffer.byteLength(body) : null
  );

  for (const [headerName, headerValue] of Object.entries(responseHeaders)) {
    frames.push([headerName, headerValue].join(HEADER_KEY_VALUE_SEPARATOR));
  }

  // add empty string, will be replaced with \r\n (CRLF)
  // this will seperate the headers from the body
  frames.push("");

  if (shouldProcessBody) {
    if (Buffer.isBuffer(body)) {
      frames.push(body.toString());
    } else {
      frames.push(body);
    }
  } else {
    frames.push("");
  }

  const response = frames.join(CHARACTER_SET.CRLF);

  return Buffer.from(response);
};

export const internalErrorResponse = (requestMethod: HTTPMethod) => createResponse({
  requestMethod,
  statusCode: 500,
  httpVersion: "HTTP/1.0",
  headers: {
    "Content-Type": "text/json",
  },
  body: JSON.stringify({
    message: "Internal Server Error",
  }),
});
