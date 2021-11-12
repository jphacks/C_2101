/* eslint-disable */
// prettier-ignore
import { AspidaClient, BasicHeaders } from 'aspida'
// prettier-ignore
import { Methods as Methods0 } from '.'
// prettier-ignore
import { Methods as Methods1 } from './me'
// prettier-ignore
import { Methods as Methods2 } from './me/password'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://api.abelab.dev/jphacks' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/users'
  const PATH1 = '/api/users/me'
  const PATH2 = '/api/users/me/password'
  const GET = 'GET'
  const PUT = 'PUT'
  const DELETE = 'DELETE'

  return {
    me: {
      password: {
        /**
         * ログインユーザのパスワードを更新する。
         * @param option.body - パスワード更新情報
         */
        put: (option: { body: Methods2['put']['reqBody'], config?: T }) =>
          fetch<void, BasicHeaders, Methods2['put']['status']>(prefix, PATH2, PUT, option).send(),
        /**
         * ログインユーザのパスワードを更新する。
         * @param option.body - パスワード更新情報
         */
        $put: (option: { body: Methods2['put']['reqBody'], config?: T }) =>
          fetch<void, BasicHeaders, Methods2['put']['status']>(prefix, PATH2, PUT, option).send().then(r => r.body),
        $path: () => `${prefix}${PATH2}`
      },
      /**
       * プロフィールを取得する。
       * @returns 取得成功
       */
      get: (option?: { config?: T }) =>
        fetch<Methods1['get']['resBody'], BasicHeaders, Methods1['get']['status']>(prefix, PATH1, GET, option).json(),
      /**
       * プロフィールを取得する。
       * @returns 取得成功
       */
      $get: (option?: { config?: T }) =>
        fetch<Methods1['get']['resBody'], BasicHeaders, Methods1['get']['status']>(prefix, PATH1, GET, option).json().then(r => r.body),
      /**
       * ログインユーザを更新する。
       * @param option.body - ユーザ更新情報
       */
      put: (option: { body: Methods1['put']['reqBody'], config?: T }) =>
        fetch<void, BasicHeaders, Methods1['put']['status']>(prefix, PATH1, PUT, option).send(),
      /**
       * ログインユーザを更新する。
       * @param option.body - ユーザ更新情報
       */
      $put: (option: { body: Methods1['put']['reqBody'], config?: T }) =>
        fetch<void, BasicHeaders, Methods1['put']['status']>(prefix, PATH1, PUT, option).send().then(r => r.body),
      /**
       * ログインユーザを削除する。
       */
      delete: (option?: { config?: T }) =>
        fetch<void, BasicHeaders, Methods1['delete']['status']>(prefix, PATH1, DELETE, option).send(),
      /**
       * ログインユーザを削除する。
       */
      $delete: (option?: { config?: T }) =>
        fetch<void, BasicHeaders, Methods1['delete']['status']>(prefix, PATH1, DELETE, option).send().then(r => r.body),
      $path: () => `${prefix}${PATH1}`
    },
    /**
     * ユーザ一覧を取得する。
     * @returns 取得成功
     */
    get: (option?: { config?: T }) =>
      fetch<Methods0['get']['resBody'], BasicHeaders, Methods0['get']['status']>(prefix, PATH0, GET, option).json(),
    /**
     * ユーザ一覧を取得する。
     * @returns 取得成功
     */
    $get: (option?: { config?: T }) =>
      fetch<Methods0['get']['resBody'], BasicHeaders, Methods0['get']['status']>(prefix, PATH0, GET, option).json().then(r => r.body),
    $path: () => `${prefix}${PATH0}`
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
