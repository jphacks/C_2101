import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "api-schema/src/types/events";
import { Server } from "socket.io";

console.log("start room server");

const io = new Server<ClientToServerEventsMap, ServerToClientsEventsMap>({
  /* options */
});

io.on("connection", (socket) => {
  //権限とかのチェック
  const auth = socket.handshake.auth;
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
