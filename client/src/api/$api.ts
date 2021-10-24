/* eslint-disable */
// prettier-ignore
import { AspidaClient, BasicHeaders } from 'aspida'
// prettier-ignore
import { Methods as Methods0 } from './api/login'
// prettier-ignore
import { Methods as Methods1 } from './api/rooms'
// prettier-ignore
import { Methods as Methods2 } from './api/rooms/_room_id@number'
// prettier-ignore
import { Methods as Methods3 } from './api/rooms/_room_id@number/join'
// prettier-ignore
import { Methods as Methods4 } from './api/rooms/_room_id@number/unjoin'
// prettier-ignore
import { Methods as Methods5 } from './api/signup'
// prettier-ignore
import { Methods as Methods6 } from './api/users'
// prettier-ignore
import { Methods as Methods7 } from './api/users/me'
// prettier-ignore
import { Methods as Methods8 } from './api/users/me/password'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://api.abelab.dev/jphacks' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/login'
  const PATH1 = '/api/rooms'
  const PATH2 = '/join'
  const PATH3 = '/unjoin'
  const PATH4 = '/api/signup'
  const PATH5 = '/api/users'
  const PATH6 = '/api/users/me'
  const PATH7 = '/api/users/me/password'
  const GET = 'GET'
  const POST = 'POST'
  const PUT = 'PUT'
  const DELETE = 'DELETE'

  return {
    api: {
      login: {
        /**
         * ユーザのログイン処理を行う。
         * @param option.body - ログイン情報
         * @returns ログイン成功
         */
        post: (option: { body: Methods0['post']['reqBody'], config?: T }) =>
          fetch<Methods0['post']['resBody'], BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).json(),
        /**
         * ユーザのログイン処理を行う。
         * @param option.body - ログイン情報
         * @returns ログイン成功
         */
        $post: (option: { body: Methods0['post']['reqBody'], config?: T }) =>
          fetch<Methods0['post']['resBody'], BasicHeaders, Methods0['post']['status']>(prefix, PATH0, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH0}`
      },
      rooms: {
        _room_id: (val2: number) => {
          const prefix2 = `${PATH1}/${val2}`

          return {
            join: {
              /**
               * ルームを参加登録する。
               * @param option.body - 参加登録情報
               */
              post: (option: { body: Methods3['post']['reqBody'], config?: T }) =>
                fetch<void, BasicHeaders, Methods3['post']['status']>(prefix, `${prefix2}${PATH2}`, POST, option).send(),
              /**
               * ルームを参加登録する。
               * @param option.body - 参加登録情報
               */
              $post: (option: { body: Methods3['post']['reqBody'], config?: T }) =>
                fetch<void, BasicHeaders, Methods3['post']['status']>(prefix, `${prefix2}${PATH2}`, POST, option).send().then(r => r.body),
              $path: () => `${prefix}${prefix2}${PATH2}`
            },
            unjoin: {
              /**
               * ルームを参加辞退する。
               */
              post: (option?: { config?: T }) =>
                fetch<void, BasicHeaders, Methods4['post']['status']>(prefix, `${prefix2}${PATH3}`, POST, option).send(),
              /**
               * ルームを参加辞退する。
               */
              $post: (option?: { config?: T }) =>
                fetch<void, BasicHeaders, Methods4['post']['status']>(prefix, `${prefix2}${PATH3}`, POST, option).send().then(r => r.body),
              $path: () => `${prefix}${prefix2}${PATH3}`
            },
            /**
             * ルームを削除する。
             */
            delete: (option?: { config?: T }) =>
              fetch<void, BasicHeaders, Methods2['delete']['status']>(prefix, prefix2, DELETE, option).send(),
            /**
             * ルームを削除する。
             */
            $delete: (option?: { config?: T }) =>
              fetch<void, BasicHeaders, Methods2['delete']['status']>(prefix, prefix2, DELETE, option).send().then(r => r.body),
            $path: () => `${prefix}${prefix2}`
          }
        },
        /**
         * ルーム一覧を取得する。
         * @returns 取得成功
         */
        get: (option?: { config?: T }) =>
          fetch<Methods1['get']['resBody'], BasicHeaders, Methods1['get']['status']>(prefix, PATH1, GET, option).json(),
        /**
         * ルーム一覧を取得する。
         * @returns 取得成功
         */
        $get: (option?: { config?: T }) =>
          fetch<Methods1['get']['resBody'], BasicHeaders, Methods1['get']['status']>(prefix, PATH1, GET, option).json().then(r => r.body),
        /**
         * ルームを作成する。
         * @param option.body - ルーム作成情報
         */
        post: (option: { body: Methods1['post']['reqBody'], config?: T }) =>
          fetch<void, BasicHeaders, Methods1['post']['status']>(prefix, PATH1, POST, option).send(),
        /**
         * ルームを作成する。
         * @param option.body - ルーム作成情報
         */
        $post: (option: { body: Methods1['post']['reqBody'], config?: T }) =>
          fetch<void, BasicHeaders, Methods1['post']['status']>(prefix, PATH1, POST, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH1}`
      },
      signup: {
        /**
         * ユーザのサインアップ処理を行う。
         * @param option.body - サインアップ情報
         * @returns 作成成功
         */
        post: (option: { body: Methods5['post']['reqBody'], config?: T }) =>
          fetch<Methods5['post']['resBody'], BasicHeaders, Methods5['post']['status']>(prefix, PATH4, POST, option).json(),
        /**
         * ユーザのサインアップ処理を行う。
         * @param option.body - サインアップ情報
         * @returns 作成成功
         */
        $post: (option: { body: Methods5['post']['reqBody'], config?: T }) =>
          fetch<Methods5['post']['resBody'], BasicHeaders, Methods5['post']['status']>(prefix, PATH4, POST, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH4}`
      },
      users: {
        me: {
          password: {
            /**
             * ログインユーザのパスワードを更新する。
             * @param option.body - パスワード更新情報
             */
            put: (option: { body: Methods8['put']['reqBody'], config?: T }) =>
              fetch<void, BasicHeaders, Methods8['put']['status']>(prefix, PATH7, PUT, option).send(),
            /**
             * ログインユーザのパスワードを更新する。
             * @param option.body - パスワード更新情報
             */
            $put: (option: { body: Methods8['put']['reqBody'], config?: T }) =>
              fetch<void, BasicHeaders, Methods8['put']['status']>(prefix, PATH7, PUT, option).send().then(r => r.body),
            $path: () => `${prefix}${PATH7}`
          },
          /**
           * プロフィールを取得する。
           * @returns 取得成功
           */
          get: (option?: { config?: T }) =>
            fetch<Methods7['get']['resBody'], BasicHeaders, Methods7['get']['status']>(prefix, PATH6, GET, option).json(),
          /**
           * プロフィールを取得する。
           * @returns 取得成功
           */
          $get: (option?: { config?: T }) =>
            fetch<Methods7['get']['resBody'], BasicHeaders, Methods7['get']['status']>(prefix, PATH6, GET, option).json().then(r => r.body),
          /**
           * ログインユーザを更新する。
           * @param option.body - ユーザ更新情報
           */
          put: (option: { body: Methods7['put']['reqBody'], config?: T }) =>
            fetch<void, BasicHeaders, Methods7['put']['status']>(prefix, PATH6, PUT, option).send(),
          /**
           * ログインユーザを更新する。
           * @param option.body - ユーザ更新情報
           */
          $put: (option: { body: Methods7['put']['reqBody'], config?: T }) =>
            fetch<void, BasicHeaders, Methods7['put']['status']>(prefix, PATH6, PUT, option).send().then(r => r.body),
          /**
           * ログインユーザを削除する。
           */
          delete: (option?: { config?: T }) =>
            fetch<void, BasicHeaders, Methods7['delete']['status']>(prefix, PATH6, DELETE, option).send(),
          /**
           * ログインユーザを削除する。
           */
          $delete: (option?: { config?: T }) =>
            fetch<void, BasicHeaders, Methods7['delete']['status']>(prefix, PATH6, DELETE, option).send().then(r => r.body),
          $path: () => `${prefix}${PATH6}`
        },
        /**
         * ユーザ一覧を取得する。
         * @returns 取得成功
         */
        get: (option?: { config?: T }) =>
          fetch<Methods6['get']['resBody'], BasicHeaders, Methods6['get']['status']>(prefix, PATH5, GET, option).json(),
        /**
         * ユーザ一覧を取得する。
         * @returns 取得成功
         */
        $get: (option?: { config?: T }) =>
          fetch<Methods6['get']['resBody'], BasicHeaders, Methods6['get']['status']>(prefix, PATH5, GET, option).json().then(r => r.body),
        $path: () => `${prefix}${PATH5}`
      }
    }
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
