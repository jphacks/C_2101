/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** ユーザのサインアップ処理を行う。 */
  post: {
    status: 201
    /** 作成成功 */
    resBody: Types.AccessTokenResponse
    /** サインアップ情報 */
    reqBody: Types.SignupRequest
  }
}
