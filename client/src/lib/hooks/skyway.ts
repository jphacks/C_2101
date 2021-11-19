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

export const connectVideoPeer = (
  credential: SkywayCredentialsModel,
  roomId: number,
  mediaStream?: MediaStream
): Promise<void> =>
  disconnectVideoPeer().then(
    () =>
      new Promise((resolve, reject) => {
        console.log("try connect skyway peer", credential.peerId);
        const peer = new Peer(credential.peerId, {
          key: skywayApiKey,
          credential: credential,
        });
        skywayConnections.videoPeer = peer;
        console.log("set skywayConnections.videoPeer");

        peer.once("open", () => {
          console.log("skyway video peer opened");
          const room: SfuRoom = peer.joinRoom(String(roomId), {
            mode: "sfu",
            stream: mediaStream,
          });

          room.once("open", () => {
            console.log("skyway video room opened", room);
            skywayConnections.videoRoom = room;

            resolve();
          });

          room.once("stream", (stream) => {
            console.log("skyway stream received", stream.id);
          });
        });

        peer.on("error", (err) => {
          console.log("skyway video error");
          console.log(err);
        });
      })
  );

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

export const disconnectVideoPeer = () =>
  new Promise<void>((resolve) => {
    if (!skywayConnections.videoPeer) {
      resolve();
      return;
    }
    console.log("disconnect video peer", skywayConnections.videoPeer);
    skywayConnections.videoPeer.once("disconnected", () => {
      console.log("disconnected", skywayConnections.videoPeer);
      skywayConnections.videoPeer = null;
      resolve();
    });
    skywayConnections.videoPeer.destroy();
  });

export const disconnectScreenPeer = async () => {
  skywayConnections.screenPeer?.destroy();
};

export const disconnectAllPeer = async () => {
  skywayConnections.videoPeer?.destroy();
  skywayConnections.screenPeer?.destroy();
};
