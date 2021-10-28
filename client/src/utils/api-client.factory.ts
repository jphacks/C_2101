import api from "../api/$api";
import aspida from "@aspida/axios";
import axios from "axios";
import { AxiosRequestConfig } from "axios";

axios.interceptors.request.use((config: AxiosRequestConfig) => {
  const authToken = localStorage.getItem("lt-space-auth-token");
  if (authToken !== null) {
    config.headers = JSON.parse(authToken);
  }

  return config;
});

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
