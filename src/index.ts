import net from "net";
import { controller } from "./controller";
import { processRequest } from "./models/http-request";


const server = net.createServer((socket) => {
  console.log("client connected");

  socket.on("error", (error) => {
    console.error("server crashed with unexpected error", error);
    socket.destroy();
  });

  socket.on("data", (buffer) => {
    const request = processRequest(buffer);
    controller(request, socket);
  });

  socket.on("end", () => {
    console.log("client disconnected");
  });
});

server.listen(5432);
