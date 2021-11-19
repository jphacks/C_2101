import React, { useEffect, useRef, useState } from "react";
import { CameraBlock } from "./CameraBlock";
import { useVideoStreamId } from "../../../../lib/hooks/useSyncStream";
import {
  useIsCurrentOwnSession,
  useSpeakingMember,
} from "../../../../lib/hooks/useSyncTimetable";
import {
  getListenRoom,
  useCameraShareAction,
} from "../../../function/SkywayRoot";
import { RoomStream } from "skyway-js";
import {
  useAudioDeviceParam,
  useCameraDeviceParam,
  useSetCameraEnabled,
  useSetMicEnabled,
} from "../../../../lib/hooks/useStreamConfig";

export const CameraBlockContainer: React.VFC = () => {
  //画面表示
  const videoStreamId = useVideoStreamId();
  const videoDomRef = useRef<HTMLVideoElement>(null);

  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);
  const [isCameraEnabled, setIsCameraEnabled] = useState<boolean>(false);

  const setStreamToVideo = (stream: MediaStream | null) => {
    console.log("setStreamToVideo", stream?.id);

    console.log(stream?.getVideoTracks());
    console.log(stream?.getAudioTracks());
    setIsCameraEnabled(!!stream && stream.getVideoTracks().length > 0);
    setIsAudioEnabled(!!stream && stream.getAudioTracks().length > 0);

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
            new Promise<RoomStream>((resolve) => {
              const remoteStreams = {
                ...room?.remoteStreams,
              };

              const stream = remoteStreams[videoStreamId];
              console.log("roomStreams", remoteStreams);
              if (stream) {
                resolve(stream);
                return;
              } else {
                room?.once("stream", () => {
                  resolve(room?.remoteStreams[videoStreamId]);
                });
              }
            })
        )
        .then((stream) => {
          console.log("stream", stream?.id);
          setStreamToVideo(stream ?? null);
        });
    }
  }, [videoStreamId]);

  //画面共有
  const isOwnSession = useIsCurrentOwnSession();
  //デバイス変更時にも更新されたいのでuseParam
  const audioEnabled = useAudioDeviceParam();
  const cameraEnabled = useCameraDeviceParam();
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

  //バー表示用
  const speakingMember = useSpeakingMember();

  return (
    <CameraBlock
      srcRef={videoDomRef}
      muted={isOwnSession}
      user={speakingMember?.user}
      isAudioEnabled={isAudioEnabled}
      isCameraEnabled={isCameraEnabled}
    />
  );
};
