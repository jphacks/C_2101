import Peer, { SfuRoom } from "skyway-js";
import { SkywayCredentialsModel } from "@api-schema/api/@types";

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

export const skywayConnections: {
  videoPeer: Peer | null;
  screenPeer: Peer | null;
  videoRoom: SfuRoom | null;
  screenRoom: SfuRoom | null;
} = {
  videoPeer: null,
  screenPeer: null,
  videoRoom: null,
  screenRoom: null,
};

export const connectVideoPeer = async (
  credential: SkywayCredentialsModel,
  roomId: number,
  mediaStream?: MediaStream
): Promise<void> =>
  new Promise((resolve, reject) => {
    const peer = new Peer({
      key: skywayApiKey,
      credential: credential,
    });

    peer.once("open", () => {
      console.log("skyway video peer opened");
      const room: SfuRoom = peer.joinRoom(String(roomId), {
        mode: "sfu",
        stream: mediaStream,
      });

      room.once("open", () => {
        console.log("skyway video room opened");
        skywayConnections.videoPeer = peer;
        skywayConnections.videoRoom = room;
        resolve();
      });
    });

    peer.on("error", (err) => {
      console.log("skyway video error");
      console.log(err);
    });
  });

export const connectScreenPeer = async (
  credential: SkywayCredentialsModel,
  roomId: number,
  mediaStream: MediaStream
): Promise<void> =>
  new Promise((resolve, reject) => {
    const peer = new Peer({
      key: skywayApiKey,
      credential: credential,
    });

    peer.once("open", () => {
      console.log("skyway screen peer opened");
      const room: SfuRoom = peer.joinRoom(String(roomId), {
        mode: "sfu",
        stream: mediaStream,
      });

      room.once("open", () => {
        console.log("skyway screen room opened");
        skywayConnections.screenPeer = peer;
        skywayConnections.screenRoom = room;
        resolve();
      });
    });

    peer.on("error", (err) => {
      console.log("skyway screen error");
      console.log(err);
    });
  });

export const disconnectScreenPeer = async () => {
  skywayConnections.screenPeer?.destroy();
};

export const disconnectAllPeer = async () => {
  skywayConnections.videoPeer?.destroy();
  skywayConnections.screenPeer?.destroy();
};
