/* eslint-disable */
import type * as Types from '../../../@types'

export type Methods = {
  /** プロフィールを取得する。 */
  get: {
    status: 200
    /** 取得成功 */
    resBody: Types.UserResponse
  }

  /** ログインユーザを更新する。 */
  put: {
    status: 200
    /** ユーザ更新情報 */
    reqBody: Types.LoginUserUpdateRequest
  }

  /** ログインユーザを削除する。 */
  delete: {
    status: 200
  }
}
