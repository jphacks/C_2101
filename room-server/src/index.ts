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

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ルーム情報を取得
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // メンバー情報の更新を配信
    io.to(String(userSession.roomId)).emit(
      "updateMembersState",
      roomSession.members
    );
  });

  // NOTE: ゲスト機能はとりあえずパス
  socket.on("joinRoomAsGuest", () => {
    console.log("[joinRoomAsGuest] is called");
  });

  socket.on("leaveRoom", async () => {
    console.log("[leaveRoom] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ルームから退出
    await roomSessionService.leaveRoom(socket.id);
    await socket.leave(String(userSession.roomId));
  });

  socket.on("getScreenCredential", async (auth, res) => {
    console.log("[getScreenCredential] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ルーム情報を取得
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // クレデンシャルを発行
    const screenCredential = await roomService.authenticateRoom(
      userSession.roomId,
      userSession.userId,
      auth
    );
    if (!screenCredential) {
      return;
    }

    res(screenCredential);
  });

  socket.on("postComment", async (comment) => {
    console.log("[postComment] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // コメントを配信
    await roomSessionService.postComment(comment, socket.id);
    io.to(String(userSession.roomId)).emit("broadcastComment", comment);
  });

  socket.on("postReaction", async (reaction) => {
    console.log("[postReaction] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // リアクションを配信
    io.to(String(userSession.roomId)).emit("broadcastReaction", reaction);
  });

  socket.on("startScreenShare", async (mediaScreenId) => {
    console.log("[startScreenShare] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // ルーム情報を取得
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    // 画面共有状態を更新
    await roomSessionService.startScreenShare(mediaScreenId, socket.id);
    io.to(String(userSession.roomId)).emit(
      "updateStreamState",
      roomSession.streamState
    );
  });

  socket.on("setTimetable", async (timetable) => {
    console.log("[setTimetable] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // タイムテーブルを更新
    await roomSessionService.setTimetable(timetable, socket.id);
    io.to(String(userSession.roomId)).emit("updateTimetable", timetable);
  });

  socket.on("setTimer", async (timer) => {
    console.log("[setTimer] is called");

    // ユーザ情報を取得
    const userSession = await userSessionService.getUserSession(socket.id);
    if (!userSession || userSession.isGuest) {
      return;
    }

    // タイマーを更新
    await roomSessionService.setTimer(timer, socket.id);
    io.to(String(userSession.roomId)).emit("updateTimer", timer);
  });

  socket.on("getCommentsState", async (res) => {
    console.log("[getCommentsState] is called");

    // ルーム情報を取得
    const roomSession = await roomSessionService.getActiveRoomSession(
      socket.id
    );
    if (!roomSession) {
      return;
    }

    res(roomSession.comments);
  });

  socket.on("getTimerState", async (res) => {
    console.log("[getTimerState] is called");

    // ルーム情報を取得
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
    console.log("[] is called");

    // ルーム情報を取得
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

    // ルーム情報を取得
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

    // ルーム情報を取得
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
