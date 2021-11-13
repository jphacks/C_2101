import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "api-schema/src/types/events";
import { Server } from "socket.io";

const io = new Server<ClientToServerEventsMap, ServerToClientsEventsMap>({
  /* options */
});

io.on("connection", (socket) => {
  // ...
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
