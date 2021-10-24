/* eslint-disable */
// prettier-ignore
import { AspidaClient, BasicHeaders } from 'aspida'
// prettier-ignore
import { Methods as Methods0 } from '.'

// prettier-ignore
const api = <T>({ baseURL, fetch }: AspidaClient<T>) => {
  const prefix = (baseURL === undefined ? 'https://api.abelab.dev/jphacks' : baseURL).replace(/\/$/, '')
  const PATH0 = '/api/users/me/password'
  const PUT = 'PUT'

  return {
    /**
     * ログインユーザのパスワードを更新する。
     * @param option.body - パスワード更新情報
     */
    put: (option: { body: Methods0['put']['reqBody'], config?: T }) =>
      fetch<void, BasicHeaders, Methods0['put']['status']>(prefix, PATH0, PUT, option).send(),
    /**
     * ログインユーザのパスワードを更新する。
     * @param option.body - パスワード更新情報
     */
    $put: (option: { body: Methods0['put']['reqBody'], config?: T }) =>
      fetch<void, BasicHeaders, Methods0['put']['status']>(prefix, PATH0, PUT, option).send().then(r => r.body),
    $path: () => `${prefix}${PATH0}`
  }
}

// prettier-ignore
export type ApiInstance = ReturnType<typeof api>
// prettier-ignore
export default api
