import aspida from "@aspida/axios";
import axios from "axios";
import api from "../../../api-schema/src/api/$api";

// axios.interceptors.request.use((config: AxiosRequestConfig) => {
//   const itemStr = localStorage.getItem("lt-space-auth-token");
//   if (itemStr) {
//     const authorization = JSON.parse(itemStr) as AuthHeader;
//     // console.log(authorization);
//     config.headers = {
//       ...authorization,
//       ...config.headers,
//     };
//   }
//   return config;
// });
//
axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response.data;
    const message = response.message
      ? response.message
      : "予期せぬエラーが発生しました。";

    // 401エラーでトークンを削除
    if (response.status === 401) {
      localStorage.removeItem("lt-space-auth-token");
    }

    return Promise.reject(message);
  }
);

const client = api(aspida(axios, {}));
export default client;
