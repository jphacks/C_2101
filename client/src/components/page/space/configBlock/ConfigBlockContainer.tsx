import { ConfigBlock } from "./ConfigBlock";
import React from "react";
import {
  useCameraEnabled,
  useMicEnabled,
  useSetCameraEnabled,
  useSetMicEnabled,
} from "../../../../lib/hooks/useStreamConfig";
import { useIsCurrentOwnSession } from "../../../../lib/hooks/useSyncTimetable";

export const ConfigBlockContainer: React.VFC = () => {
  const cameraValue = useCameraEnabled();
  const micValue = useMicEnabled();
  const setCameraValue = useSetCameraEnabled();
  const setMicValue = useSetMicEnabled();

  const isOwnSession = useIsCurrentOwnSession();
  return (
    <ConfigBlock
      cameraValue={cameraValue}
      micValue={micValue}
      onChangeCameraValue={setCameraValue}
      onChangeMicValue={setMicValue}
      onClickPreference={() => {}}
      micDisabled={!isOwnSession}
      cameraDisabled={!isOwnSession}
    />
  );
};
