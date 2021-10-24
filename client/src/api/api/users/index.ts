/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** ユーザ一覧を取得する。 */
  get: {
    status: 200
    /** 取得成功 */
    resBody: Types.UsersResponse
  }
}
