import { DefaultEventsMap } from "socket.io/dist/typed-events";

//socket.ioのイベント型
export interface EventsMap extends DefaultEventsMap {
  hoge: () => void;
}
