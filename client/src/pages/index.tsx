import { Text } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/layout";
import api from "../api/$api";
import aspida from "@aspida/fetch";
import useAspidaSWR from "@aspida/swr";

// const fetchConfig = {
//   baseURL: "https://api.abelab.dev/jphacks/api",
//   throwHttpErrors: true, // throw an error on 4xx/5xx, default is false
// };

const client = api(aspida(fetch));

const Home: React.VFC = () => {
  const { data, error } = useAspidaSWR(client.api.login, "post", {
    body: { email: "test@mail.com", password: "1234Abcd" },
  });

  if (error)
    return (
      <Layout>
        <Text>Error {error.toString()}</Text>
      </Layout>
    );
  if (!data)
    return (
      <Layout>
        <Text>Loading...</Text>
      </Layout>
    );

  return (
    <Layout>
      <Text>Home: {data.body.accessToken}</Text>
    </Layout>
  );
};

export default Home;
