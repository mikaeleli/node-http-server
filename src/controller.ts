import net from "net";
import { HttpRequest } from "./models/http";
import { routes } from "./routes";

export const controller = (request: HttpRequest, socket: net.Socket): void => {
  if (request.route.startsWith("/public/assets/")) {
    return routes.assets(request, socket);
  }

  if (request.route.startsWith("/api/")) {
    return routes.api(request, socket);
  }

  switch (request.route) {
    case "/":
      return routes.frontpage(request, socket);

    case "/dad-jokes":
      return routes.dadJokes(request, socket);

    case "/login":
      return routes.login(request, socket);

    case "/restricted":
      return routes.restricted(request, socket);

    default:
      return routes.notFound(request, socket);
  }
};
