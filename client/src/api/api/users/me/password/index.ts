/* eslint-disable */
import type * as Types from '../../../../@types'

export type Methods = {
  /** ログインユーザのパスワードを更新する。 */
  put: {
    status: 200
    /** パスワード更新情報 */
    reqBody: Types.LoginUserPasswordUpdateRequest
  }
}
