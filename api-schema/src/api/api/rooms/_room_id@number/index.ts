/* eslint-disable */
import type * as Types from '../../../@types'

export type Methods = {
  /** ルームを取得する。 */
  get: {
    status: 200
    /** 取得成功 */
    resBody: Types.RoomResponse
  }

  /** ルームを削除する。 */
  delete: {
    status: 200
  }
}
