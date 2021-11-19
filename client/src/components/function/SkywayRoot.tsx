import React, { useCallback, useEffect } from "react";
import {
  useListenCredentialValue,
  useScreenCredentialValue,
  useCameraCredentialValue,
} from "../../lib/hooks/useCredential";
import Peer, { SfuRoom } from "skyway-js";
import { useRoomId } from "../../lib/hooks/useRoom";
import { socket } from "../../lib/hooks/socket";

type Props = {
  children: React.ReactNode;
};

const skywayPeers: {
  listenPeer: Promise<Peer> | null;
  videoPeer: Promise<Peer> | null;
  screenPeer: Promise<Peer> | null;
} = {
  listenPeer: null,
  videoPeer: null,
  screenPeer: null,
};

const skywayRooms: {
  listenRoom: Promise<SfuRoom> | null;
  videoRoom: Promise<SfuRoom> | null;
  screenRoom: Promise<SfuRoom> | null;
} = {
  listenRoom: null,
  videoRoom: null,
  screenRoom: null,
};

const sharingStreams: {
  video: MediaStream | null;
  screen: MediaStream | null;
} = {
  video: null,
  screen: null,
};

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

export const SkywayRoot: React.VFC<Props> = ({ children }) => {
  const listenCredential = useListenCredentialValue();

  const roomId = useRoomId();

  useEffect(() => {
    if (!listenCredential) return;
    if (!roomId) return;

    const peer = new Peer(listenCredential.peerId, {
      key: skywayApiKey,
      credential: listenCredential,
    });

    peer.on("error", (err) => {
      console.log("skyway video error");
      console.log(err);
    });

    skywayPeers.listenPeer = new Promise<Peer>((resolve) => {
      peer.once("open", () => {
        resolve(peer);

        skywayRooms.listenRoom = new Promise<SfuRoom>((resolve1) => {
          const room = peer.joinRoom(String(roomId), {
            mode: "sfu",
          }) as SfuRoom;
          room.once("open", () => {
            resolve1(room);
          });
        });
      });
    });

    return () => {
      peer.destroy();
      skywayPeers.listenPeer = null;
      skywayRooms.listenRoom = null;
    };
  }, [listenCredential, roomId]);

  return <>{children}</>;
};

export const getListenRoom = async () => {
  return skywayRooms.listenRoom;
};

export const getVideoPeer = async () => {
  return skywayPeers.videoPeer;
};

export const getScreenPeer = async () => {
  return skywayPeers.screenPeer;
};

export const getVideoRoom = async () => {
  return skywayRooms.videoRoom;
};

export const getScreenRoom = async () => {
  return skywayRooms.screenRoom;
};

export const useScreenShareAction = () => {
  const roomId = useRoomId();
  const screenCredential = useScreenCredentialValue();

  const end = useCallback(async (reconnect: boolean = false) => {
    console.log("endScreenShare");
    const room = await getScreenRoom();
    if (room) {
      sharingStreams.screen?.getTracks().forEach((track) => track.stop());
      sharingStreams.screen = null;

      const promise = new Promise<void>((resolve) => {
        room.once("close", () => {
          resolve();
        });
      });
      room.close();
      await promise;
      skywayRooms.screenRoom = null;

      if (!reconnect) {
        socket.emit("setUserMediaStream", {
          screenStreamId: null,
        });
      }
    }
    console.log("closed");
  }, []);

  const start = useCallback(async () => {
    console.log("startScreenShare");
    if (!roomId || !screenCredential) return;

    await end(true);

    const screenMedia = await navigator.mediaDevices
      .getDisplayMedia({
        audio: true,
        video: true,
      })
      .catch((err) => {
        console.warn(err);
        return null;
      });

    if (!screenMedia) return;

    let peer = await getScreenPeer();
    if (!peer) {
      const screenPeer = new Peer(screenCredential.peerId, {
        key: skywayApiKey,
        credential: screenCredential,
      });

      await new Promise<Peer>((resolve) => {
        screenPeer.once("open", () => {
          resolve(screenPeer);
        });
      });
      skywayPeers.screenPeer = Promise.resolve(screenPeer);
      peer = screenPeer;
    }

    const room = peer.joinRoom(String(roomId), {
      mode: "sfu",
      stream: screenMedia,
    }) as SfuRoom;

    await new Promise((resolve) => {
      room.once("open", () => {
        sharingStreams.screen = screenMedia;
        socket.emit("setUserMediaStream", {
          screenStreamId: screenMedia.id,
        });
        //これいる?
        resolve(room);
      });
    });
    skywayRooms.screenRoom = Promise.resolve(room);
  }, [end, roomId, screenCredential]);

  return {
    start,
    end,
  };
};

export const useCameraShareAction = (cameraMediaConfig: {
  audio:
    | boolean
    | {
        deviceId: ConstrainDOMString;
      };
  video:
    | boolean
    | {
        deviceId: ConstrainDOMString;
      };
}) => {
  const roomId = useRoomId();
  const cameraCredential = useCameraCredentialValue();

  const end = useCallback(async (reconnect: boolean = false) => {
    console.log("endCameraShare");
    const room = await getVideoRoom();
    if (room) {
      sharingStreams.video?.getTracks().forEach((track) => track.stop());
      sharingStreams.video = null;

      const promise = new Promise<void>((resolve) => {
        room.once("close", () => {
          resolve();
        });
      });
      room.close();
      await promise;
      skywayRooms.videoRoom = null;
      if (!reconnect) {
        socket.emit("setUserMediaStream", {
          videoStreamId: null,
        });
      }
    }
    console.log("closed");
  }, []);

  const start = useCallback(async () => {
    console.log("startVideoShare");
    if (!roomId || !cameraCredential) return;

    await end(true);

    const cameraMedia = await navigator.mediaDevices
      .getUserMedia({
        audio: cameraMediaConfig.audio,
        video: cameraMediaConfig.video,
      })
      .catch((err) => {
        console.warn(err);
        return null;
      });

    if (!cameraMedia) return;

    let peer = await getVideoPeer();
    if (!peer) {
      const videoPeer = new Peer(cameraCredential.peerId, {
        key: skywayApiKey,
        credential: cameraCredential,
      });

      await new Promise<Peer>((resolve) => {
        videoPeer.once("open", () => {
          resolve(videoPeer);
        });
      });
      skywayPeers.videoPeer = Promise.resolve(videoPeer);
      peer = videoPeer;
    }

    const room = peer.joinRoom(String(roomId), {
      mode: "sfu",
      stream: cameraMedia,
    }) as SfuRoom;

    await new Promise((resolve) => {
      room.once("open", () => {
        sharingStreams.video = cameraMedia;
        socket.emit("setUserMediaStream", {
          videoStreamId: cameraMedia.id,
        });
        //これいる?
        resolve(room);
      });
    });
    skywayRooms.videoRoom = Promise.resolve(room);
  }, [
    roomId,
    cameraCredential,
    end,
    cameraMediaConfig.audio,
    cameraMediaConfig.video,
  ]);

  return {
    start,
    end,
  };
};
