import { UserInfo } from "@api-schema/types/user";

export type MemberType = "Speaker" | "Viewer" | "Guest";
export type MemberAuthority = "Owner" | "Admin" | "General";

export type RoomMember = {
  user: UserInfo;
  type: MemberType;
  authority: MemberAuthority;
  isOnline: boolean;
  skywayPeerIds: {
    videotelephony: string;
    screenShare: string;
  };
  streamIds: {
    videotelephony: string;
    screenShare: string;
  };
};
