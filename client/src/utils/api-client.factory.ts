import api from "../api/$api";
import aspida from "@aspida/axios";
import axios from "axios";

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const response = error.response.data;
    const message = response.message
      ? response.message
      : "予期せぬエラーが発生しました。";
    return Promise.reject(message);
  }
);

const client = api(aspida(axios, {}));
export default client;
