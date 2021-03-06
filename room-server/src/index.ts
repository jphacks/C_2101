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
import { UserSessionService } from "./service/UserSessionService";
import { RoomSessionService } from "./service/RoomSessionService";
import { CommentItem } from "@api-schema/types/comment";

// repository
const userSessionRepository = new InMemoryUserSessionRepository();
const roomSessionRepository = new InMemoryRoomSessionRepository();

// service
const userService = new UserService();
const roomService = new RoomService();
const userSessionService = new UserSessionService(userSessionRepository);
const roomSessionService = new RoomSessionService(
  roomSessionRepository,
  userSessionRepository,
  new RoomMemberFactory(),
  new RoomSessionFactory()
);

console.log("start room server");

const io = new Server<ClientToServerEventsMap, ServerToClientsEventsMap>({
  cors: {
    origin: process.env.CLIENT_URL ?? "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`connection: ${socket.id}`);
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

    const listenCredential = await roomService.authenticateRoom(
      roomId,
      userId,
      auth,
      "listen"
    );
    if (!listenCredential) {
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
      listenCredential
    );

    await socket.join(String(roomId));

    res({
      status: "success",
      credential: listenCredential,
    });

    socket.emit("joinedRoom", roomId);

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // ????????????????????????????????????
    io.to(String(userSession.roomId)).emit(
      "updateMembersState",
      roomSession.members
    );

    // const comment: CommentItem = {
    //   type: "system",
    //   timestamp: Date.now(),
    //   text: `${user.name}?????????????????????`,
    // };
    // // ?????????????????????
    // await roomSessionService.postComment(comment, socket.id);
    // io.to(String(userSession.roomId)).emit("broadcastComment", comment);
  });

  // NOTE: ???????????????????????????????????????
  socket.on("joinRoomAsGuest", () => {
    console.log("[joinRoomAsGuest] is called");
  });

  socket.on("leaveRoom", async () => {
    console.log("[leaveRoom] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ?????????????????????
    await roomSessionService.leaveRoom(userSession.userId, socket.id);
    await socket.leave(String(userSession.roomId));

    // ????????????????????????
    // ????????????????????????getActiveRoomSession??????????????????
    const roomSession = await roomSessionService.getRoomSession(
      userSession.roomId
    );
    if (!roomSession) {
      return;
    }

    // ????????????????????????????????????
    io.to(String(userSession.roomId)).emit(
      "updateMembersState",
      roomSession.members
    );
  });

  socket.on("getScreenCredential", async (auth, res) => {
    console.log("[getScreenCredential] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // ??????????????????????????????
    const screenCredential = await roomService.authenticateRoom(
      userSession.roomId,
      userSession.userId,
      auth,
      "screen"
    );
    if (!screenCredential) {
      return;
    }

    res(screenCredential);
  });

  socket.on("getCameraCredential", async (auth, res) => {
    console.log("[getVideoCredential] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // ??????????????????????????????
    const cameraCredential = await roomService.authenticateRoom(
      userSession.roomId,
      userSession.userId,
      auth,
      "camera"
    );
    if (!cameraCredential) {
      return;
    }

    res(cameraCredential);
  });

  socket.on("postComment", async (comment) => {
    console.log("[postComment] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ?????????????????????
    await roomSessionService.postComment(comment, socket.id);
    io.to(String(userSession.roomId)).emit("broadcastComment", comment);
  });

  socket.on("postReaction", async (reaction) => {
    console.log("[postReaction] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ???????????????????????????
    io.to(String(userSession.roomId)).emit("broadcastReaction", reaction);
  });

  socket.on("setUserMediaStream", async (streams) => {
    console.log("[setUserMediaStream] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      console.warn("user not authed");
      return;
    }

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      console.warn("room not found");
      return;
    }

    await roomSessionService.setMemberStream(
      streams,
      socket.id,
      userSession.userId
    );
    await roomSessionService.mutateRoomStream(socket.id);

    // ???????????????????????????????????????
    const updatedRoomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!updatedRoomSession) {
      console.warn("room not found 2");
      return;
    }

    console.log("emit updateMembersState");

    const socketRoomId = String(userSession.roomId);
    io.to(socketRoomId).emit("updateMembersState", updatedRoomSession.members);

    console.log("emit updateStreamState");
    //????????????????????????????????????????????????????????????
    io.to(socketRoomId).emit(
      "updateStreamState",
      updatedRoomSession.streamState
    );
  });

  socket.on("setTimetable", async (timetable) => {
    console.log("[setTimetable] is called");

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) return;

    const prevSection =
      roomSession.timetable.sections[roomSession.timetable.cursor];

    // ??????????????????????????????
    await roomSessionService.setTimetable(timetable, socket.id);
    await roomSessionService.mutateRoomStream(socket.id);

    // ???????????????????????????????????????
    const updatedRoomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!updatedRoomSession) {
      return;
    }

    const updatedSection =
      updatedRoomSession.timetable.sections[
        updatedRoomSession.timetable.cursor
      ];

    const socketRoomId = String(userSession.roomId);
    io.to(socketRoomId).emit("updateTimetable", updatedRoomSession.timetable);

    //????????????????????????????????????????????????????????????
    io.to(socketRoomId).emit(
      "updateStreamState",
      updatedRoomSession.streamState
    );

    if (prevSection.type !== "speaking" && updatedSection.type === "speaking") {
      const user = updatedRoomSession.members.find(
        (member) => member.user.id === updatedSection.userId
      );
      const comment: CommentItem = {
        type: "system",
        timestamp: Date.now(),
        text: `${user?.user.name ?? "??????????????????"}??????????????????????????????`,
      };
      // ?????????????????????
      await roomSessionService.postComment(comment, socket.id);
      io.to(socketRoomId).emit("broadcastComment", comment);
    }
  });

  socket.on("setTimer", async (timer) => {
    console.log("[setTimer] is called");
    console.log(timer);

    // ????????????????????????
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ?????????????????????
    await roomSessionService.setTimer(timer, socket.id);
    io.to(String(userSession.roomId)).emit("updateTimer", timer);
  });

  socket.on("getCommentsState", async (res) => {
    console.log("[getCommentsState] is called");

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      console.log("[getCommentsState] user not in room");
      return;
    }

    res(roomSession.comments);
  });

  socket.on("getTimerState", async (res) => {
    console.log("[getTimerState] is called");

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession.timer);
  });

  // TODO
  socket.on("getTimetableState", async (res) => {
    console.log("[getTimetableState] is called");

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession.timetable);
  });

  socket.on("getScreenState", async (res) => {
    console.log("[getScreenState] is called");

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession.streamState);
  });

  socket.on("getMemberState", async (res) => {
    console.log("[getMemberState] is called");

    // ????????????????????????
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession.members);
  });
});

io.listen(process.env.PORT ? Number(process.env.PORT) : 3001);
