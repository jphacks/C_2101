import { TestType } from "@api-schema/testTypes";
import { io, Socket } from "socket.io-client";
import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "@api-schema/types/events";

const test: TestType = {
  something: "some",
};
//
// interface EventMap extends DefaultEventsMap {
//   "post-comment": (text: string) => void;
// }
//
const socket: Socket<ServerToClientsEventsMap, ClientToServerEventsMap> = io();
socket.emit(
  "postComment",
  {
    text: "hoge",
    timestamp: Date.now(),
    userId: "userid",
  },
  (res) => {
    console.log("res", res);
  }
);
socket.on("updatePostedComment", (comment, res) => {
  res("ok");
});
