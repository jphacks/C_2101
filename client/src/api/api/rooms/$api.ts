/* eslint-disable */
// prettier-ignore
import { AspidaClient, BasicHeaders } from 'aspida'
// prettier-ignore
import { Methods as Methods0 } from '.'
// prettier-ignore
import { Methods as Methods1 } from './_room_id@number'
// prettier-ignore
import { Methods as Methods2 } from './_room_id@number/join'
// prettier-ignore
import { Methods as Methods3 } from './_room_id@number/unjoin'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://api.abelab.dev/jphacks' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/rooms'
  const PATH1 = '/join'
  const PATH2 = '/unjoin'
  const GET = 'GET'
  const POST = 'POST'
  const DELETE = 'DELETE'

  return {
    _room_id: (val0: number) => {
      const prefix0 = `${PATH0}/${val0}`

      return {
        join: {
          /**
           * ルームを参加登録する。
           * @param option.body - 参加登録情報
           */
          post: (option: { body: Methods2['post']['reqBody'], config?: T }) =>
            fetch<void, BasicHeaders, Methods2['post']['status']>(prefix, `${prefix0}${PATH1}`, POST, option).send(),
          /**
           * ルームを参加登録する。
           * @param option.body - 参加登録情報
           */
          $post: (option: { body: Methods2['post']['reqBody'], config?: T }) =>
            fetch<void, BasicHeaders, Methods2['post']['status']>(prefix, `${prefix0}${PATH1}`, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${prefix0}${PATH1}`
        },
        unjoin: {
          /**
           * ルームを参加辞退する。
           */
          post: (option?: { config?: T }) =>
            fetch<void, BasicHeaders, Methods3['post']['status']>(prefix, `${prefix0}${PATH2}`, POST, option).send(),
          /**
           * ルームを参加辞退する。
           */
          $post: (option?: { config?: T }) =>
            fetch<void, BasicHeaders, Methods3['post']['status']>(prefix, `${prefix0}${PATH2}`, POST, option).send().then(r => r.body),
          $path: () => `${prefix}${prefix0}${PATH2}`
        },
        /**
         * ルームを削除する。
         */
        delete: (option?: { config?: T }) =>
          fetch<void, BasicHeaders, Methods1['delete']['status']>(prefix, prefix0, DELETE, option).send(),
        /**
         * ルームを削除する。
         */
        $delete: (option?: { config?: T }) =>
          fetch<void, BasicHeaders, Methods1['delete']['status']>(prefix, prefix0, DELETE, option).send().then(r => r.body),
        $path: () => `${prefix}${prefix0}`
      }
    },
    /**
     * ルーム一覧を取得する。
     * @returns 取得成功
     */
    get: (option?: { config?: T }) =>
      fetch<Methods0['get']['resBody'], BasicHeaders, Methods0['get']['status']>(prefix, PATH0, GET, option).json(),
    /**
     * ルーム一覧を取得する。
     * @returns 取得成功
     */
    $get: (option?: { config?: T }) =>
      fetch<Methods0['get']['resBody'], BasicHeaders, Methods0['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
    /**
     * ルームを作成する。
     * @param option.body - ルーム作成情報
     */
    post: (option: { body: Methods0['post']['reqBody'], config?: T }) =>
      fetch<void, BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).send(),
    /**
     * ルームを作成する。
     * @param option.body - ルーム作成情報
     */
    $post: (option: { body: Methods0['post']['reqBody'], config?: T }) =>
      fetch<void, BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).send().then(r => r.body),
    $path: () => `${prefix}${PATH0}`
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
