import React, { useEffect, useRef } from "react";
import { CameraBlock } from "./CameraBlock";
import { useVideoStreamId } from "../../../../lib/hooks/useSyncStream";
import { useIsCurrentOwnSession } from "../../../../lib/hooks/useSyncTimetable";
import {
  getListenRoom,
  useCameraShareAction,
} from "../../../function/SkywayRoot";
import { RoomStream } from "skyway-js";
import {
  useCameraEnabled,
  useMicEnabled,
  useSetCameraEnabled,
  useSetMicEnabled,
} from "../../../../lib/hooks/useStreamConfig";

type VideoStatus = {};

//自分の番で配信待ち→カメラをオンにするボタンを表示→クリックされたらconnectVideoPeer
//自分の番で配信中→ローカルのmediaStream表示
//他人の番で配信待ち→配信者のアイコン表示
//他人の番で音声のみ→配信者のアイコン表示　音声のみでmediaStream繋ぐ
//他人の番で映像音声→配信者のmediaStreamを表示

export const CameraBlockContainer: React.VFC = () => {
  //画面表示
  const videoStreamId = useVideoStreamId();
  const videoDomRef = useRef<HTMLVideoElement>(null);

  const setStreamToVideo = (stream: MediaStream | null) => {
    console.log("setStreamToVideo", stream?.id);
    if (!videoDomRef.current) {
      return;
    }
    videoDomRef.current.srcObject = stream;
    videoDomRef.current.play();
  };

  useEffect(() => {
    if (!videoStreamId) {
      setStreamToVideo(null);
    } else {
      getListenRoom()
        .then(
          (room) =>
            new Promise<Record<string, RoomStream>>((resolve) => {
              const remoteStreams = {
                ...room?.remoteStreams,
              };
              console.log("roomStreams", remoteStreams);

              if (Object.entries(remoteStreams).length > 0) {
                resolve(remoteStreams);
                return;
              } else {
                room?.once("stream", () => {
                  resolve({
                    ...room?.remoteStreams,
                  });
                });
              }
            })
        )
        .then((remoteStreams) => {
          const stream = remoteStreams[videoStreamId];
          setStreamToVideo(stream ?? null);
        });
    }
  }, [videoStreamId]);

  //画面共有
  const isOwnSession = useIsCurrentOwnSession();
  const audioEnabled = useMicEnabled();
  const cameraEnabled = useCameraEnabled();
  const { start, end } = useCameraShareAction({
    audio: audioEnabled,
    video: cameraEnabled,
  });

  const setCameraEnabled = useSetCameraEnabled();
  const setMicEnabled = useSetMicEnabled();
  useEffect(() => {
    if (!isOwnSession) {
      setCameraEnabled(false);
      setMicEnabled(false);
      return;
    }
    if (!audioEnabled && !cameraEnabled) {
      end();
    } else {
      start();
    }
  }, [
    audioEnabled,
    cameraEnabled,
    end,
    isOwnSession,
    setCameraEnabled,
    setMicEnabled,
    start,
  ]);

  return <CameraBlock srcRef={videoDomRef} muted={isOwnSession} />;
};
