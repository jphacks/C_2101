import api from "@api-schema/api/$api";
import aspida from "@aspida/axios";
import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "api-schema/src/types/events";
import axios from "axios";
import { Server } from "socket.io";

import {
  getAuthedUser,
  getRoomInfo,
  issueSkywayCredential,
} from "./fetchApiService";
import { joinUser } from "./roomService";

export const client = api(aspida(axios, {}));

const io = new Server<ClientToServerEventsMap, ServerToClientsEventsMap>({
  /* options */
});

io.on("connection", (socket) => {
  socket.on("joinRoomAsUser", async ({ roomId, userId, auth }, res) => {
    console.log("joinRoomAsUser");
    const user = await getAuthedUser(auth);

    if (!user) {
      res({
        status: "failure",
        reason: "not authorized",
      });
      return;
    }

    const roomInfo = await getRoomInfo(roomId, auth);
    if (!roomInfo) {
      res({
        status: "failure",
        reason: "room not found",
      });
      return;
    }

    const videoCredential = await issueSkywayCredential(roomId, userId, auth);
    if (!videoCredential) {
      res({
        status: "failure",
        reason: "credential could not get",
      });
      return;
    }

    await joinUser(user, socket.id, roomInfo, videoCredential);

    await socket.join(String(roomId));

    res({
      status: "success",
      credential: videoCredential,
    });
  });

  socket.on("joinRoomAsGuest", () => {
    console.log("joinRoomAsGuest");
  });

  socket.on("leaveRoom", () => {
    console.log("leaveRoom");
  });

  socket.on("getScreenCredential", (res) => {
    console.log("leaveRoom");
  });

  socket.on("postComment", (comment) => {
    console.log("postComment");
  });

  socket.on("postReaction", (reaction) => {
    console.log("postReaction");
  });

  socket.on("startScreenShare", (mediaScreenId) => {
    console.log("startScreenShare");
  });

  socket.on("setTimetable", (timetable) => {
    console.log("setTimetable");
  });

  socket.on("setTimer", (timer) => {
    console.log("setTimer");
  });

  socket.on("getInitialStates", (res) => {
    console.log("getInitialStates");
  });
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
