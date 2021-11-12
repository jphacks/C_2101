/* eslint-disable */
import type * as Types from '../../../../@types'

export type Methods = {
  /** ルームを認証する。 */
  post: {
    status: 200
    /** 認証成功 */
    resBody: Types.RoomCredentialsResponse
    /** ルーム認証情報 */
    reqBody: Types.RoomAuthenticateRequest
  }
}
