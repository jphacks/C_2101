import api from "api-schema/src/api/$api";
import aspida from "@aspida/axios";
import axios from "axios";
import { UserId } from "api-schema/src/types/user";
import {
  RoomResponse,
  SkywayCredentialsModel,
} from "api-schema/src/api/@types";

export class RoomService {
  private apiClient = api(aspida(axios, {}));

  /**
   * ルームを取得
   *
   * @param {number} roomId
   * @param {string} auth
   *
   * @returns ルーム情報
   */
  async getRoom(roomId: number, auth: string): Promise<RoomResponse | null> {
    try {
      return await this.apiClient.api.rooms._room_id(roomId).$get({
        config: {
          headers: {
            Authorization: auth,
          },
        },
      });
    } catch (e) {
      return null;
    }
  }

  /**
   * ルームを認証
   *
   * @param {number} roomId
   * @param {UserId} userId
   * @param {string} auth
   *
   * @returns SkyWayクレデンシャル
   */
  async authenticateRoom(
    roomId: number,
    userId: UserId,
    auth: string
  ): Promise<SkywayCredentialsModel | null> {
    try {
      const timestamp = new Date().getTime();

      const res = await this.apiClient.api.rooms
        ._room_id(roomId)
        .authenticate.$post({
          body: {
            // NOTE: peerIdをユニーク化
            peerId: `${userId}-video-${timestamp}`,
          },
          config: {
            headers: {
              Authorization: auth,
            },
          },
        });
      return res.skyway;
    } catch (e) {
      return null;
    }
  }
}
