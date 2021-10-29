import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
//eventEmitter的なので同期するstate
//のハズなんだけど無限ループしてうまく動かない
export const useRemoteConnectedState = <T>(
  {
    key,
    emitter,
    listenerSetter,
    initialValue,
  }: {
    key: string;
    emitter: (
      key: string,
      action:
        | {
            type: "request";
          }
        | {
            type: "update";
            value: T;
          }
    ) => void;
    listenerSetter: (
      key: string,
      prevValue: T,
      setter: Dispatch<SetStateAction<T>>
    ) => () => void;
    initialValue: T;
  },
  enabled: boolean
): [T, (value: T) => void] => {
  const [state, setInnerState] = useState<T>(initialValue);

  const setState = useCallback(
    (value: T) => {
      console.log("setstate");

      if (isEqualObject(value, state)) return;

      setInnerState(value);
      emitter(key, {
        type: "update",
        value: value,
      });
    },
    [key]
  );

  // const setState = (value: T) => {
  //   console.log("setstate");
  //
  //   if (isEqualObject(value, state)) return;
  //
  //   setInnerState(value);
  //   emitter(key, {
  //     type: "update",
  //     value: value,
  //   });
  // };

  useEffect(() => {
    if (!enabled) return;

    const remover = listenerSetter(key, state, setInnerState);

    //初期値を取得
    emitter(key, {
      type: "request",
    });

    return remover;
  }, [key, enabled]);

  return [state, setState];
};

//マジで良くない
const isEqualObject = (a: any, b: any) => {
  const aJson = JSON.stringify(a);
  const bJson = JSON.stringify(b);
  return aJson === bJson;
};

// const [timetable, setTimetable] = useRemoteConnectedState<Timetable>(
//   {
//     key: "updateTimetable",
//     emitter: (_, action) => {
//       if (action.type === "update") {
//         const data: SkywayData = {
//           type: "updateTimetable",
//           timestamp: createTimestamp(),
//           timetable: action.value,
//         };
//         roomRef.current!.send(data);
//         if (roomRef.current) {
//           console.log("sendTimetable", data);
//         }
//       }
//       if (action.type === "request") {
//         const data: SkywayData = {
//           type: "requestTimetable",
//           timestamp: createTimestamp(),
//         };
//         roomRef.current!.send(data);
//         if (roomRef.current) {
//           console.log("requestTimetable", data);
//         }
//       }
//     },
//     listenerSetter: (_, prevValue, setter) => {
//       const listener = (roomData: RoomData) => {
//         const data = roomData.data as SkywayData;
//         if (data.type === "updateTimetable") {
//           setter(data.timetable);
//         }
//         if (data.type === "requestTimetable" && isOwner) {
//           const data: SkywayData = {
//             type: "updateTimetable",
//             timestamp: createTimestamp(),
//             timetable: prevValue,
//           };
//           roomRef.current!.send(data);
//         }
//       };
//
//       roomRef.current!.on("data", listener);
//
//       return () => {
//         roomRef.current!.off("data", listener);
//       };
//     },
//     initialValue: {
//       sessions: [],
//       pointer: {
//         inSession: false,
//       },
//     },
//   },
//   !!roomRef.current
// );
