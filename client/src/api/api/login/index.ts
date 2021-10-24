/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** ユーザのログイン処理を行う。 */
  post: {
    status: 200
    /** ログイン成功 */
    resBody: Types.AccessTokenResponse
    /** ログイン情報 */
    reqBody: Types.LoginRequest
  }
}
