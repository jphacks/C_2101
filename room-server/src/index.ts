import { Server } from "socket.io";

const io = new Server({
  /* options */
});

io.on("connection", (socket) => {
  // ...
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
