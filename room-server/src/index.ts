import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "api-schema/src/types/events";
import { Server } from "socket.io";

import { RoomMemberFactory } from "./factory/RoomMemberFactory";
import { RoomSessionFactory } from "./factory/RoomSessionFactory";
import { InMemoryRoomSessionRepository } from "./repository/InMemoryRoomSessionRepository";
import { InMemoryUserSessionRepository } from "./repository/InMemoryUserSessionRepository";
import { UserService } from "./service/UserService";
import { RoomService } from "./service/RoomService";
import { RoomSessionService } from "./service/RoomSessionService";

const userService = new UserService();
const roomService = new RoomService();
const roomSessionService = new RoomSessionService(
  new InMemoryRoomSessionRepository(),
  new InMemoryUserSessionRepository(),
  new RoomMemberFactory(),
  new RoomSessionFactory()
);

const io = new Server<ClientToServerEventsMap, ServerToClientsEventsMap>({
  /* options */
});

io.on("connection", (socket) => {
  socket.on("joinRoomAsUser", async ({ roomId, userId, auth }, res) => {
    console.log("[joinRoomAsUser] is called");

    const user = await userService.getLoginUser(auth);

    if (!user) {
      res({
        status: "failure",
        reason: "not authorized",
      });
      return;
    }

    const roomInfo = await roomService.getRoom(roomId, auth);
    if (!roomInfo) {
      res({
        status: "failure",
        reason: "room not found",
      });
      return;
    }

    const videoCredential = await roomService.authenticateRoom(
      roomId,
      userId,
      auth
    );
    if (!videoCredential) {
      res({
        status: "failure",
        reason: "credential could not get",
      });
      return;
    }

    await roomSessionService.userJoinRoom(
      user,
      socket.id,
      roomInfo,
      videoCredential
    );

    await socket.join(String(roomId));

    res({
      status: "success",
      credential: videoCredential,
    });
  });

  socket.on("joinRoomAsGuest", () => {
    console.log("[joinRoomAsGuest] is called");
  });

  socket.on("leaveRoom", () => {
    console.log("[leaveRoom] is called");
  });

  socket.on("getScreenCredential", (res) => {
    console.log("[getScreenCredential] is called");
  });

  socket.on("postComment", (comment) => {
    console.log("[postComment] is called");
  });

  socket.on("postReaction", (reaction) => {
    console.log("[postReaction] is called");
  });

  socket.on("startScreenShare", (mediaScreenId) => {
    console.log("[startScreenShare] is called");
  });

  socket.on("setTimetable", async (timetable) => {
    console.log("[setTimetable] is called");

    await roomSessionService.setTimetable(timetable, socket.id);
  });

  socket.on("setTimer", async (timer) => {
    console.log("[setTimer] is called");

    await roomSessionService.setTimer(timer, socket.id);
  });

  socket.on("getInitialStates", async (res) => {
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession);
  });
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
