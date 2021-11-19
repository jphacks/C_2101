import React, { useEffect, useRef } from "react";

import { useScreenStreamId } from "../../../../lib/hooks/useSyncStream";
import { useIsCurrentOwnSession } from "../../../../lib/hooks/useSyncTimetable";
import {
  getListenRoom,
  useScreenShareAction,
} from "../../../function/SkywayRoot";
import { ScreenBlockMenu } from "./ScreenBlockMenu";
import { RoomStream } from "skyway-js";
import { ScreenBlock } from "./ScreenBlock";

export const ScreenBlockContainer: React.VFC = () => {
  //画面表示
  const screenStreamId = useScreenStreamId();
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
    if (!screenStreamId) {
      setStreamToVideo(null);
    } else {
      getListenRoom()
        .then(
          (room) =>
            new Promise<RoomStream>((resolve) => {
              const remoteStreams = {
                ...room?.remoteStreams,
              };

              const stream = remoteStreams[screenStreamId];
              console.log("roomStreams", remoteStreams);
              if (stream) {
                resolve(stream);
                return;
              } else {
                room?.once("stream", () => {
                  resolve(room?.remoteStreams[screenStreamId]);
                });
              }
            })
        )
        .then((stream) => {
          console.log("stream", stream?.id);
          setStreamToVideo(stream ?? null);
        });
    }
  }, [screenStreamId]);

  //画面共有
  const isOwnSession = useIsCurrentOwnSession();
  const { start, end } = useScreenShareAction();

  if (!isOwnSession) {
    return <ScreenBlock srcRef={videoDomRef} muted={false} />;
  } else {
    return (
      <ScreenBlock
        srcRef={videoDomRef}
        muted={true}
        menu={
          <ScreenBlockMenu
            onClickStartScreenShare={() => {
              void start();
            }}
            onClickEndScreenShare={() => {
              void end();
            }}
          />
        }
      />
    );
  }
};
