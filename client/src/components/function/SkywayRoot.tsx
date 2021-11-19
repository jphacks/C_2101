import React, { useCallback, useEffect } from "react";
import {
  useListenCredentialValue,
  useScreenCredentialValue,
  useCameraCredentialValue,
} from "../../lib/hooks/useCredential";
import Peer, { SfuRoom } from "skyway-js";
import { useRoomId } from "../../lib/hooks/useRoom";
import { SkywayCredentialsModel } from "@api-schema/api/@types";
import { socket } from "../../lib/hooks/socket";
import { useStreamValue } from "../../lib/hooks/useSyncStream";
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

const skywayApiKey = "401e1886-919c-4988-ba47-ac85cae091a5";

export const SkywayRoot: React.VFC<Props> = ({ children }) => {
  const listenCredential = useListenCredentialValue();
  const cameraCredential = useCameraCredentialValue();
  const screenCredential = useScreenCredentialValue();

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
          });
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

export const joinSkywayRoomVideo = async (
  roomId: number,
  stream?: MediaStream
) => {
  const peer = await getVideoPeer();
  if (!peer) {
    console.warn("peer not connected");
    return;
  }

  if (await getVideoRoom()) {
    await leaveSkywayRoomVideo();
  }

  const room = peer.joinRoom(String(roomId), {
    mode: "sfu",
    stream: stream,
  });

  skywayRooms.videoRoom = new Promise<SfuRoom>((resolve) => {
    room.once("open", () => {
      resolve(room);
    });
  });

  return skywayRooms.videoRoom;
};

export const leaveSkywayRoomVideo = async () => {
  const room = await getVideoRoom();
  if (!room) return;

  room.close();

  await new Promise<void>((resolve) => {
    room.once("close", () => {
      resolve();
    });
  });
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

  const end = useCallback(async () => {
    console.log("endScreenShare");
    const room = await getScreenRoom();
    if (room) {
      await new Promise<void>((resolve) => {
        room.once("close", () => {
          resolve();
        });
      });
      room.close();
    }

    const peer = await getScreenPeer();
    if (peer) {
      await new Promise<void>((resolve) => {
        peer.once("close", () => {
          resolve();
        });
      });
      peer.destroy();
    }
  }, []);

  const start = useCallback(async () => {
    console.log("startScreenShare");
    if (!roomId || !screenCredential) return;

    await end();

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

    const screenPeer = new Peer(screenCredential.peerId, {
      key: skywayApiKey,
      credential: screenCredential,
    });

    screenPeer.once("open", () => {
      //これいる?
      skywayPeers.screenPeer = Promise.resolve(screenPeer);

      const room = screenPeer.joinRoom(String(roomId), {
        mode: "sfu",
        stream: screenMedia,
      });

      room.once("open", () => {
        socket.emit("setUserMediaStream", {
          screenStreamId: screenMedia.id,
        });
        //これいる?
        skywayRooms.screenRoom = Promise.resolve(room);
      });
    });
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

  const end = useCallback(async () => {
    console.log("endCameraShare");
    const room = await getVideoRoom();
    if (room) {
      await new Promise<void>((resolve) => {
        room.once("close", () => {
          resolve();
        });
      });
      room.close();
    }

    const peer = await getVideoPeer();
    if (peer) {
      await new Promise<void>((resolve) => {
        peer.once("close", () => {
          resolve();
        });
      });
      peer.destroy();
    }
  }, []);

  const start = useCallback(async () => {
    console.log("startVideoShare");
    if (!roomId || !cameraCredential) return;

    await end();

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

    const videoPeer = new Peer(cameraCredential.peerId, {
      key: skywayApiKey,
      credential: cameraCredential,
    });

    videoPeer.once("open", () => {
      //これいる?
      skywayPeers.videoPeer = Promise.resolve(videoPeer);

      const room = videoPeer.joinRoom(String(roomId), {
        mode: "sfu",
        stream: cameraMedia,
      });

      room.once("open", () => {
        socket.emit("setUserMediaStream", {
          videoStreamId: cameraMedia.id,
        });
        //これいる?
        skywayRooms.videoRoom = Promise.resolve(room);
      });
    });
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
