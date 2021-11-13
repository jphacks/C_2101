import { UserInfo } from "@api-schema/types/user";

export type MemberType = "Speaker" | "Viewer" | "Guest";
export type MemberAuthority = "Owner" | "Admin" | "General";

//参加登録済みのユーザの場合はオフラインオンラインにかかわらず存在する
//ゲストの場合はオンラインのみ

export type RoomMember = {
  user: UserInfo;
  type: MemberType;
  authority: MemberAuthority;
  connection:
    | {
        isOnline: false;
      }
    | {
        isOnline: true;
        skywayPeerIds: {
          videotelephony: string;
          screenShare: string | null;
        };
        streamIds: {
          videotelephony: string | null;
          screenShare: string | null;
        };
      };
};
