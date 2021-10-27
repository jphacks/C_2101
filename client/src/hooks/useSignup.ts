import api from "../api/$api";
import aspida from "@aspida/axios";
import { useLocalStorage } from "react-use";
import axios from "axios";
import useSWR from "swr";

const client = api(aspida(axios, {}));

export const useSignup = () => {
  const [authHeader, setAuthHeader, destroyAuthHeader] = useLocalStorage<
    | {
        Authorization: string;
      }
    | undefined
  >("lt-space-auth-token");
  const fetchSignup = async (loginParam: {
    email: string;
    password: string;
    name: string;
    icon: string|null;
  }) => {
    const res = await client.api.signup.$post({
      body: loginParam,
    });
    const header = {
      Authorization: `${res.tokenType} ${res.accessToken}`,
    };
    setAuthHeader(header);
    return header;

  };


  return {
    fetchSignup,
  };
};
