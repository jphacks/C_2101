import { TestType } from "@api-schema/testTypes";

const test: TestType = {
  something: "some",
};
//
// interface EventMap extends DefaultEventsMap {
//   "post-comment": (text: string) => void;
// }
//
// const socket: Socket<EventMap, EventMap> = io();
// socket.emit("post-comment", "hoge");
// socket.on("post-comment", (text) => {});
