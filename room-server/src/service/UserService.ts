import api from "api-schema/src/api/$api";
import aspida from "@aspida/axios";
import axios from "axios";
import { UserInfo } from "api-schema/src/types/user";

export class UserService {
  private apiClient = api(aspida(axios, {}));

  /**
   * ログインユーザを取得
   *
   * @param {string} auth
   *
   * @returns ログインユーザ
   */
  async getLoginUser(auth: string): Promise<UserInfo | null> {
    try {
      return await this.apiClient.api.users.me.$get({
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
}
