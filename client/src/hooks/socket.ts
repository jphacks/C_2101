import { io, Socket } from "socket.io-client";
import {
  ClientToServerEventsMap,
  ServerToClientsEventsMap,
} from "@api-schema/types/events";

export type ClientSocket = Socket<
  ServerToClientsEventsMap,
  ClientToServerEventsMap
>;

const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
export const socket: ClientSocket = io(socketUrl, {});

socket.on("connect", () => {
  console.log("socket.io connected");
});

export const joinRoomGuest = (roomId: number) => {
  // socket.emit("")
};
