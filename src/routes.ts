import net from "net";
import { HTTPMethod, HttpRequest } from "./models/http";
import { createResponse, internalErrorResponse } from "./models/http-response";
import { readAsset, readHTML } from "./services/filesystem";

const SUPER_SECRET_AUTH = "super-secret-auth";

type RequestHandler = (request: HttpRequest, socket: net.Socket) => void;

const defaultErrorHandler =
  (socket: net.Socket, requestMethod: HTTPMethod) =>
  (error: NodeJS.ErrnoException): void => {
    console.error("error reading file", error);
    socket.write(internalErrorResponse(requestMethod));
    socket.end();
  };

function handleConnectionHeader(request: HttpRequest, socket: net.Socket) {
  if (request.headers["Connection"] === "close") {
    socket.end();
  }
}

function handleRequest(handler: RequestHandler) {
  return (request: HttpRequest, socket: net.Socket) => {
    handler(request, socket);
    handleConnectionHeader(request, socket);
  };
}

function json(
  socket: net.Socket,
  request: HttpRequest,
  body: Record<string, unknown>
) {
  socket.write(
    createResponse({
      requestMethod: request.method,
      httpVersion: "HTTP/1.0",
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
  );
}

const handleIndexRoute = handleRequest((request, socket) => {
  readHTML("index.html", {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 200,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": "text/html",
          },
          body: data,
        })
      );
    },
  });
});

const handleDadJokesRoute = handleRequest((request, socket) => {
  readHTML("dad-jokes.html", {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 200,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": "text/html",
          },
          body: data,
        })
      );
    },
  });
});

const handleNotFoundRoute = handleRequest((request, socket) => {
  readHTML("404.html", {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 404,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": "text/html",
          },
          body: data.replace("%{PATH}%", request.route),
        })
      );
    },
  });
});

const handleAssetsRoute = handleRequest((request, socket) => {
  const asset = request.route.split("/public/assets/")[1];
  const assetType = asset.split(".")[1];

  readAsset(asset, {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      const contentType = `image/${assetType}`;
      const dataPrefix = `data:${contentType};base64,`;
      const body = dataPrefix + data;

      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 200,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": contentType,
          },
          body,
        })
      );
    },
  });
});

const handleApi = handleRequest((request, socket) => {
  json(socket, request, {
    message: `Hello to ${
      request.queries.name || "you, our nameless overlord,"
    } from the server!`,
  });
});

const handleLoginRoute = handleRequest((request, socket) => {
  console.log({ cookies: request.cookies });

  readHTML("login.html", {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 200,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": "text/html",
          },
          cookies: [
            {
              name: "super-secret-cookie",
              value: SUPER_SECRET_AUTH,
            },
          ],
          body: data,
        })
      );
    },
  });
});

const handleRestricedRoute = handleRequest((request, socket) => {
  const isLoggedIn =
    request.cookies["super-secret-cookie"] === SUPER_SECRET_AUTH;

  if (!isLoggedIn) {
    // redirect to login
    socket.write(
      createResponse({
        requestMethod: request.method,
        statusCode: 302,
        headers: {
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Location
          Location: "/login",
        },
        httpVersion: "HTTP/1.0",
      })
    );
  }

  readHTML("restricted.html", {
    onError: defaultErrorHandler(socket, request.method),
    onSuccess: (data) => {
      socket.write(
        createResponse({
          requestMethod: request.method,
          statusCode: 200,
          httpVersion: "HTTP/1.0",
          headers: {
            "Content-Type": "text/html",
          },
          body: data,
        })
      );
    },
  });
});

export const routes = {
  frontpage: handleIndexRoute,
  dadJokes: handleDadJokesRoute,
  assets: handleAssetsRoute,
  notFound: handleNotFoundRoute,
  api: handleApi,
  login: handleLoginRoute,
  restricted: handleRestricedRoute,
} as const;
