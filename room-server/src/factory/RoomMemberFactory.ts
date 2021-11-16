import { RoomResponse, SkywayCredentialsModel } from "@api-schema/api/@types";
import { MemberType, RoomMember } from "@api-schema/types/member";
import { UserId, UserInfo } from "@api-schema/types/user";

export class RoomMemberFactory {
  /**
   * ルームメンバーを作成
   *
   * @param {UserInfo} user
   * @param {string} socketId
   * @param {RoomResponse} room
   * @param {SkywayCredentialsModel} credential
   *
   * @return {RoomMember} ルームメンバー
   */
  create(
    user: UserInfo,
    socketId: string,
    room: RoomResponse,
    credential: SkywayCredentialsModel
  ): RoomMember {
    return {
      type: this.getMemberType(user.id, room),
      user: user,
      authority: room.owner.id === user.id ? "Owner" : "General",
      connection: {
        isOnline: true,
        socketId: socketId,
        streamIds: {
          videotelephony: null,
          screenShare: null,
        },
        skywayPeerIds: {
          videotelephony: credential.peerId,
          screenShare: null,
        },
      },
    };
  }

  private getMemberType(userId: UserId, roomInfo: RoomResponse): MemberType {
    if (roomInfo.speakers.some((speaker) => speaker.id === userId)) {
      return "Speaker";
    } else {
      return "Viewer";
    }
  }
}