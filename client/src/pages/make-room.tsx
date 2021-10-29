import { Button } from "@chakra-ui/react";
import React from "react";
import Layout from "../components/Layout";
import client from "../utils/api-client.factory";

const MakeRoom: React.VFC = () => {
  //以下テスト用の書きちらし
  //momentjs使ったほうが良い
  const fetchMakeRoom = async () => {
    const users = [
      {
        email: "test@mail.com",
        password: "1234Abcd",
      },
      {
        email: "test2@mail.com",
        password: "1234Abcd",
      },
    ];

    const usersWithHeader = await Promise.all(
      users.map(async (user) => {
        const res = await client.api.login.$post({
          body: user,
        });

        const authHeader = `${res.tokenType} ${res.accessToken}`;

        return {
          ...user,
          authHeader,
        };
      })
    );

    const dateToDateTime = (date: Date) => {
      const timezoneOffset = date.getTimezoneOffset();
      const timezoneHours = timezoneOffset / 60;
      const timezoneMinutes = timezoneOffset % 60;
      return [
        date.getFullYear(),
        "-",
        `0${date.getMonth() + 1}`.slice(-2),
        "-",
        `0${date.getDate()}`.slice(-2),
        "T",
        `0${date.getHours()}`.slice(-2),
        ":",
        `0${date.getMinutes()}`.slice(-2),
        ":",
        `0${date.getSeconds()}`.slice(-2),
        -timezoneHours < 0 ? "" : "+",
        `0${-timezoneHours}`.slice(-2),
        ":",
        `0${timezoneMinutes}`.slice(-2),
      ].join("");
    };

    const start = new Date(Date.now() + 60 * 1000);
    const finish = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    await client.api.rooms.$post({
      body: {
        description: "testRoom",
        startAt: dateToDateTime(start),
        finishAt: dateToDateTime(finish),
        presentationTimeLimit: 60 * 3,
        questionTimeLimit: 60,
        title: "testRoom",
      },
      config: {
        headers: {
          Authorization: usersWithHeader[0].authHeader,
        },
      },
    });

    const roomRes = await client.api.rooms.$get({
      config: {
        headers: {
          Authorization: usersWithHeader[0].authHeader,
        },
      },
    });
    console.log(roomRes);
    const room = roomRes.rooms[roomRes.rooms.length - 1];
    console.log(room);

    await Promise.all(
      usersWithHeader.map(async (user, index) => {
        const res = await client.api.rooms._room_id(room.id).join.$post({
          body: {
            title: "hoge",
            type: (index % 2) + 1,
          },
          config: {
            headers: {
              Authorization: user.authHeader,
            },
          },
        });
        console.log(res);
      })
    );
    console.log("created");
  };

  return (
    <Layout>
      <Button onClick={fetchMakeRoom}>make-room</Button>
    </Layout>
  );
};

export default MakeRoom;
