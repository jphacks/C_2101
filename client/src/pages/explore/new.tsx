import {
  Text,
  Button,
  Textarea,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Stack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import Layout from "../../components/layout";
import DatePicker, { registerLocale } from "react-datepicker";
import client from "../../utils/api-client.factory";
import { useLogin } from "../../hooks/useLogin";
import { useToast } from "@chakra-ui/react";
import "react-datepicker/dist/react-datepicker.css";
import { parseAsMoment } from "../../utils/datetime";
import ja from "date-fns/locale/ja";
import { useRouter } from "next/router";
registerLocale("ja", ja);

const CreateSpace: React.VFC = () => {
  let now = new Date();
  let defaultDate = new Date();
  defaultDate.setHours(now.getHours() + 2);
  let defaultEndDate = new Date();
  defaultEndDate.setHours(defaultDate.getHours() + 2);

  const [startDate, setStartDate] = useState(defaultDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [presentationTimeLimit, setPresentationTimeLimit] =
    useState<number>(10);
  const [questionTimeLimit, setQuestionTimeLimit] = useState<number>(3);
  const toast = useToast();
  const router = useRouter();
  const { authHeader } = useLogin();
  const create = async () => {
    if (!title || !description) {
      toast({
        title: "タイトル・説明は必須です",
        status: "error",
        duration: 10000,
        isClosable: true,
      });
      return;
    }
    const createRoom = async () => {
      return await client.api.rooms.$post({
        body: {
          description: description,
          startAt: parseAsMoment(startDate).add(9, "h").toISOString(),
          finishAt: parseAsMoment(endDate).add(9, "h").toISOString(),
          presentationTimeLimit: presentationTimeLimit,
          questionTimeLimit: questionTimeLimit,
          title: title,
        },
        config: {
          headers: {
            Authorization: authHeader.Authorization,
          },
        },
      });
    };
    await createRoom()
      .then(() => {
        toast({
          title: "スペース予定を作成しました",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        router.push("/explore");
      })
      .catch((error: string) => {
        toast({
          title: error as string,
          status: "error",
          duration: 10000,
          isClosable: true,
        });
      });
  };

  const changeStartdate = (date: Date) => {
    var end = new Date(date.getTime());
    end.setHours(end.getHours() + 2);
    setStartDate(date);
    setEndDate(end);
  };
  return (
    <Layout>
      <Stack spacing={4} maxWidth={500} margin="auto" paddingBottom={50}>
        <Text fontSize="4xl" fontWeight="bold" marginBottom="6" marginTop="12">
          スペースを作成する
        </Text>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          イベントのタイトル
        </Text>
        <Input
          placeholder="イベントのタイトル"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        ></Input>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          イベントの説明
        </Text>
        <Textarea
          placeholder="イベントの説明"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        ></Textarea>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          開始時間の選択
        </Text>
        <DatePicker
          selected={startDate}
          onChange={changeStartdate}
          showTimeSelect
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          locale="ja"
          //   inline
          customInput={
            <Button>
              {parseAsMoment(startDate).format("YYYY/MM/DD HH:mm")}
            </Button>
          }
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          終了時間の選択
        </Text>
        <DatePicker
          selected={endDate}
          onChange={(date: Date) => setEndDate(date)}
          showTimeSelect
          timeFormat="p"
          timeIntervals={15}
          dateFormat="Pp"
          locale="ja"
          //   inline
          customInput={
            <Button>{parseAsMoment(endDate).format("YYYY/MM/DD HH:mm")}</Button>
          }
        />
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          発表時間
        </Text>
        <Stack direction={["column", "row"]} spacing="24px" alignItems="center">
          <NumberInput
            min={1}
            max={190}
            maxWidth={100}
            value={presentationTimeLimit}
            onChange={(value) => {
              setPresentationTimeLimit(Number(value));
            }}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>
        <Text marginTop={24} paddingTop={2} fontWeight="bold">
          質問時間
        </Text>
        <Stack
          direction={["column", "row"]}
          spacing="24px"
          alignItems="center"
          paddingBottom={8}
        >
          <NumberInput
            min={0}
            max={60}
            maxWidth={100}
            value={questionTimeLimit}
            onChange={(value) => setQuestionTimeLimit(Number(value))}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text>分</Text>
        </Stack>

        <Button
          marginTop={42}
          onClick={create}
          bg="teal.400"
          color="white"
          _hover={{
            bg: "teal.500",
          }}
        >
          作成する
        </Button>
      </Stack>
    </Layout>
  );
};

export default CreateSpace;
