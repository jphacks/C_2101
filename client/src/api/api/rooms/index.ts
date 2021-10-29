/* eslint-disable */
import type * as Types from '../../@types'

export type Methods = {
  /** ルーム一覧を取得する。 */
  get: {
    status: 200
    /** 取得成功 */
    resBody: Types.RoomsResponse
  }

  /** ルームを作成する。 */
  post: {
    status: 201
    /** ルーム作成情報 */
    reqBody: Types.RoomCreateRequest
  }
}
